'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// Removed unused LanguageContext and translations
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js'; // Added specific user type
import {
  Folder,
  FolderPlus,
  Upload,
  Trash2,
  Edit2,
  Link as LinkIcon,
  Loader2,
  XCircle,
  Image as ImageIcon,
  ArrowUp, // Icon for 'Up' button
} from 'lucide-react';

type FileItem = {
  type: 'file';
  name: string;
  id: string; // Files usually have IDs
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
  publicUrl: string; // Store public URL for easier access
};

type FolderItem = {
  type: 'folder';
  name: string;
  id: string | null; // Allow null ID for folders from list
};

const NOTIFICATION_TIMEOUT = 5000; // 5 seconds
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/webp',
  'application/pdf',
];

export default function MediaManagerPage() {
  const router = useRouter();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [isLoading, setIsLoading] = useState(true); // General loading state
  const [isProcessing, setIsProcessing] = useState(false); // For actions like upload, delete, rename
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null); // Store user object
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Notifications ---
  const showNotification = (type: 'success' | 'error', message: string) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    if (type === 'success') {
      setSuccess(message);
      setError(null);
    } else {
      setError(message);
      setSuccess(null);
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setSuccess(null);
      setError(null);
      notificationTimeoutRef.current = null;
    }, NOTIFICATION_TIMEOUT);
  };

  // --- Authentication ---
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Authentication error or no session:', sessionError);
        router.push('/auth');
      } else {
        setAuthUser(session.user);
      }
    };
    checkSession();

    // Listen for auth changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setAuthUser(null);
        router.push('/auth');
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setAuthUser(session.user);
      }
    });

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [router]);

  // --- Data Fetching ---
  const fetchFilesAndFolders = useCallback(async () => {
    if (!authUser) return; // Don't fetch if user is not authenticated yet

    setIsLoading(true);
    try {
      const { data: listData, error: listError } = await supabase
        .storage
        .from('images')
        .list(currentPath || undefined, { // Use undefined for root path
          limit: 500, // Increased limit, consider pagination for very large folders
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) throw listError;

      const fetchedFolders: FolderItem[] = [];
      const fetchedFiles: FileItem[] = [];

      for (const item of listData || []) {
        // Heuristic: Items without metadata or specific placeholder names are treated as folders
        // Supabase `list` returns items with null metadata for folders created via the UI or empty uploads
        if (!item.metadata) {
          // Skip the automatically created '.emptyFolderPlaceholder' if present
          if (item.name !== '.emptyFolderPlaceholder') {
            fetchedFolders.push({
              type: 'folder',
              name: item.name,
              id: item.id,
            });
          }
        } else {
          // Fetch public URL - consider doing this on demand if many files
          const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(currentPath ? `${currentPath}/${item.name}` : item.name);

          fetchedFiles.push({
            type: 'file',
            name: item.name,
            id: item.id!, // Assert non-null ID for files based on having metadata
            updated_at: item.updated_at!,
            created_at: item.created_at!,
            last_accessed_at: item.last_accessed_at!,
            metadata: {
              size: item.metadata.size ?? 0,
              mimetype: item.metadata.mimetype ?? 'application/octet-stream',
            },
            publicUrl: urlData?.publicUrl || '',
          });
        }
      }

      setFolders(fetchedFolders);
      setFiles(fetchedFiles);

    } catch (error: unknown) { // Changed from any to unknown
      console.error('Error fetching files/folders:', error);
      // Type check before accessing message
      const errorMessage = error instanceof Error ? error.message : 'Dettagli non disponibili';
      showNotification('error', `Errore nel caricamento: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [authUser, currentPath]); // Dependency array includes authUser and currentPath

  // Fetch data when authenticated user or current path changes
  useEffect(() => {
    fetchFilesAndFolders();
  }, [fetchFilesAndFolders]); // fetchFilesAndFolders is memoized by useCallback


  // --- Actions ---

  const handleFileUpload = async (uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const validFiles: File[] = [];
    const invalidFiles: { name: string; reason: string }[] = [];

    Array.from(uploadedFiles).forEach(file => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        invalidFiles.push({ name: file.name, reason: `Dimensioni superiori a ${MAX_FILE_SIZE_MB}MB` });
      } else if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        invalidFiles.push({ name: file.name, reason: 'Tipo di file non supportato' });
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      const errorMessages = invalidFiles.map(f => `${f.name} (${f.reason})`).join(', ');
      showNotification('error', `File non validi: ${errorMessages}`);
    }

    if (validFiles.length === 0) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      const uploadPromises = validFiles.map(file => {
        const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
        return supabase.storage
          .from('images')
          .upload(filePath, file, { upsert: false });
      });

      const results = await Promise.allSettled(uploadPromises);

      results.forEach(result => {
        if (result.status === 'fulfilled' && !result.value.error) {
          successCount++;
        } else {
          errorCount++;
          const error = result.status === 'rejected' ? result.reason : result.value.error;
          console.error('Upload error:', error);
        }
      });

      if (successCount > 0) {
        showNotification('success', `${successCount} file(s) caricati con successo.`);
        await fetchFilesAndFolders();
      }
      if (errorCount > 0) {
        showNotification('error', `${errorCount} file(s) non caricati. Controlla se esistono già.`);
      }

    } catch (error: unknown) {
      console.error('Error during batch upload:', error);
      showNotification('error', 'Errore imprevisto durante il caricamento.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt('Inserisci il nome della nuova cartella:');
    if (!folderName || folderName.trim() === '') return;

    // Basic validation for invalid characters in Supabase paths
    if (/[#?%]/g.test(folderName)) {
      showNotification('error', 'Il nome della cartella contiene caratteri non validi (#, ?, %).');
      return;
    }

    setIsProcessing(true);
    // Create a placeholder file to represent the folder
    const folderPath = currentPath ? `${currentPath}/${folderName.trim()}/.emptyFolderPlaceholder` : `${folderName.trim()}/.emptyFolderPlaceholder`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(folderPath, new Blob(['']), { contentType: 'text/plain', upsert: false }); // Use empty blob

      if (uploadError) {
        // Handle specific error for existing folder/file
        if (uploadError.message.includes('Duplicate')) { // Or check status code if available
          throw new Error(`Una cartella o file chiamato '${folderName.trim()}' esiste già.`);
        }
        throw uploadError; // Re-throw other errors
      }


      showNotification('success', 'Cartella creata con successo.');
      await fetchFilesAndFolders(); // Refresh list
    } catch (error: unknown) { // Changed from any to unknown
      console.error('Error creating folder:', error);
      // Type check before accessing message
      const errorMessage = error instanceof Error ? error.message : 'Dettagli non disponibili';
      showNotification('error', `Errore creazione cartella: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Recursive function to list all objects within a folder prefix
  const listAllObjects = async (folderPath: string): Promise<string[]> => {
    let allObjectPaths: string[] = [];
    const { data, error } = await supabase.storage.from('images').list(folderPath);

    if (error) {
      console.error('Error listing objects in:', folderPath, error);
      throw error; // Propagate error
    }

    if (!data) return [];

    for (const item of data) {
      const currentItemPath = `${folderPath}/${item.name}`;
      // Check if it's potentially a sub-folder (no metadata or is placeholder)
      // We assume anything returned by list is either a file or represents a folder structure
      if (!item.metadata || item.name === '.emptyFolderPlaceholder') {
        // If it's the placeholder, add it directly to be deleted.
        if (item.name === '.emptyFolderPlaceholder') {
          allObjectPaths.push(currentItemPath);
        }
        // Recursively list contents of the sub-folder prefix
        const subFolderObjects = await listAllObjects(currentItemPath);
        allObjectPaths = allObjectPaths.concat(subFolderObjects);
      } else {
        // It's a file, add its path
        allObjectPaths.push(currentItemPath);
      }
    }
    return allObjectPaths;
  };


  // Function to delete a single file
  // Function to delete a single file
  const handleDeleteFile = async (fileName: string) => {
    // 1. Construct the full path
    const filePath = currentPath ? `${currentPath}/${fileName}` : fileName;
    console.log('[handleDeleteFile] Attempting to delete file with path:', filePath); // <-- Log the exact path

    // 2. Confirmation
    if (!confirm(`Sei sicuro di voler eliminare il file "${fileName}"?`)) {
      console.log('[handleDeleteFile] Deletion cancelled by user.');
      return;
    }

    setIsProcessing(true);
    try {
      // 3. Supabase remove call
      console.log('[handleDeleteFile] Calling Supabase remove...');
      const { data, error: deleteError } = await supabase.storage
        .from('images')
        .remove([filePath]); // Path must be in an array

      // 4. Detailed Error Handling
      if (deleteError) {
        console.error('[handleDeleteFile] Supabase storage remove error:', deleteError); // <-- Log the specific Supabase error object
        // Add specific checks based on common errors
        if (deleteError.message.includes('Not found')) {
          throw new Error(`File non trovato sul server (${filePath}). Potrebbe essere già stato eliminato.`);
        } else if (deleteError.message.includes('Unauthorized') || deleteError.message.includes('policy')) {
          throw new Error(`Non autorizzato a eliminare il file. Controlla i permessi (RLS).`);
        }
        // Throw the original error for other cases
        throw deleteError;
      }

      console.log('[handleDeleteFile] Supabase remove successful. Response data:', data); // Log success data (often minimal)

      // 5. Success Feedback and Refresh
      showNotification('success', `File "${fileName}" eliminato.`);
      await fetchFilesAndFolders(); // Refresh list

    } catch (error: unknown) { // Changed from any to unknown
      // This catches errors thrown above or other unexpected errors
      console.error('[handleDeleteFile] Caught error during delete process:', error);
      // Type check
      const errorMessage = error instanceof Error ? error.message : 'Dettagli non disponibili';
      showNotification('error', `Errore eliminazione file: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
      console.log('[handleDeleteFile] Finished processing.');
    }
  };

  // Function to delete a folder and its contents
  const handleDeleteFolder = async (folderName: string) => {
    const folderPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    if (!confirm(`Sei sicuro di voler eliminare la cartella "${folderName}" e TUTTO il suo contenuto? Questa azione è irreversibile.`)) return;

    setIsProcessing(true);
    try {
      console.log(`Listing objects to delete in: ${folderPath}`);
      // List all objects (files and placeholders) recursively within the folder path
      const objectsToDelete = await listAllObjects(folderPath);

      // If the folder might have been created only as a prefix (without a placeholder),
      // ensure we try to remove the placeholder if it exists, even if listAllObjects didn't explore it initially
      const placeholderPath = `${folderPath}/.emptyFolderPlaceholder`;
      if (!objectsToDelete.includes(placeholderPath)) {
        // Check if the placeholder actually exists before adding it
        const { data: placeholderData, error: placeholderError } = await supabase.storage
          .from('images')
          .download(placeholderPath); // Use download or list with specific name to check existence
        if (!placeholderError && placeholderData) {
          objectsToDelete.push(placeholderPath);
        } else if (placeholderError && placeholderError.message !== 'The resource was not found') {
          // Log unexpected errors during placeholder check but proceed
          console.warn(`Error checking for placeholder ${placeholderPath}:`, placeholderError.message);
        }
      }


      console.log('Objects identified for deletion:', objectsToDelete);

      if (objectsToDelete.length > 0) {
        const { data, error: deleteError } = await supabase.storage
          .from('images')
          .remove(objectsToDelete);

        if (deleteError) {
          console.error('Error during bulk delete:', deleteError);
          throw new Error(`Errore durante l'eliminazione del contenuto della cartella: ${deleteError.message}`);
        }
        console.log('Bulk delete result:', data);
      } else {
        console.log(`No objects found to delete in ${folderPath}. Folder might be empty or just a prefix.`);
        // Optional: attempt to remove a placeholder just in case? Usually handled above.
      }


      showNotification('success', `Cartella "${folderName}" eliminata.`);
      await fetchFilesAndFolders(); // Refresh the list
    } catch (error: unknown) { // Changed from any to unknown
      console.error('Error deleting folder:', error);
      // Type check
      const errorMessage = error instanceof Error ? error.message : 'Dettagli non disponibili';
      showNotification('error', `Errore eliminazione cartella: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };


  // Function to rename a single file
  const handleRenameFile = async (oldName: string) => {
    const newName = prompt('Inserisci il nuovo nome per il file:', oldName);
    if (!newName || newName.trim() === '' || newName === oldName) return;

    const oldPath = currentPath ? `${currentPath}/${oldName}` : oldName;
    const newPath = currentPath ? `${currentPath}/${newName.trim()}` : newName.trim();

    setIsProcessing(true);
    try {
      const { error: moveError } = await supabase.storage
        .from('images')
        .move(oldPath, newPath);

      if (moveError) throw moveError;

      showNotification('success', 'File rinominato con successo.');
      await fetchFilesAndFolders();
    } catch (error: unknown) { // Changed from any to unknown
      console.error('Error renaming file:', error);
      // Type check
      const errorMessage = error instanceof Error ? error.message : 'Dettagli non disponibili';
      showNotification('error', `Errore rinomina file: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to rename a folder (move all contents)
  const handleRenameFolder = async (oldName: string) => {
    const newName = prompt('Inserisci il nuovo nome per la cartella:', oldName);
    if (!newName || newName.trim() === '' || newName === oldName) return;

    const trimmedNewName = newName.trim();
    if (/[#?%]/g.test(trimmedNewName)) {
      showNotification('error', 'Il nome della cartella contiene caratteri non validi (#, ?, %).');
      return;
    }


    const oldFolderPath = currentPath ? `${currentPath}/${oldName}` : oldName;
    const newFolderPath = currentPath ? `${currentPath}/${trimmedNewName}` : trimmedNewName;

    setIsProcessing(true);
    try {
      console.log(`Renaming folder from ${oldFolderPath} to ${newFolderPath}`);

      // 1. List all objects in the old folder path recursively
      const objectsToMove = await listAllObjects(oldFolderPath);

      // Ensure the placeholder is included if it exists, in case listAllObjects missed it
      // (e.g., if the folder was truly empty except for the placeholder)
      const oldPlaceholderPath = `${oldFolderPath}/.emptyFolderPlaceholder`;
      if (!objectsToMove.includes(oldPlaceholderPath)) {
        const { data: placeholderData, error: placeholderError } = await supabase.storage
          .from('images')
          .download(oldPlaceholderPath);
        if (!placeholderError && placeholderData) {
          objectsToMove.push(oldPlaceholderPath);
        } else if (placeholderError && placeholderError.message !== 'The resource was not found') {
          console.warn(`Error checking for placeholder ${oldPlaceholderPath} during rename:`, placeholderError.message);
        }
      }

      console.log('Objects identified for moving:', objectsToMove);

      if (objectsToMove.length === 0) {
        // Folder might be empty or just a prefix. Try creating the new placeholder.
        console.log("Source folder seems empty or is just a prefix. Attempting to create destination placeholder.");
        const newPlaceholderPath = `${newFolderPath}/.emptyFolderPlaceholder`;
        const { error: createError } = await supabase.storage
          .from('images')
          .upload(newPlaceholderPath, new Blob(['']), { contentType: 'text/plain', upsert: false });

        if (createError && !createError.message.includes('Duplicate')) { // Ignore if new folder already exists
          throw new Error(`Could not create new folder placeholder: ${createError.message}`);
        }
        // If old placeholder existed, try removing it (best effort)
        try {
          await supabase.storage.from('images').remove([oldPlaceholderPath]);
        } catch (removeError: unknown) { // Changed from any to unknown
          // Type check before accessing message
          const message = removeError instanceof Error ? removeError.message : '';
          if (message !== 'The resource was not found') {
            console.warn("Could not remove old placeholder during rename of empty folder:", removeError);
          }
        }

      } else {
        // 2. Move each object individually
        const movePromises = objectsToMove.map(oldObjectPath => {
          const relativePath = oldObjectPath.substring(oldFolderPath.length + 1); // Get path relative to folder root
          const newObjectPath = `${newFolderPath}/${relativePath}`;
          console.log(`Moving ${oldObjectPath} to ${newObjectPath}`);
          return supabase.storage.from('images').move(oldObjectPath, newObjectPath);
        });

        const results = await Promise.allSettled(movePromises);

        const errors = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.error));
        if (errors.length > 0) {
          console.error('Errors during folder rename move:', errors);
          // Note: This might leave the folder in a partially renamed state.
          // More robust handling might involve copying first, then deleting original on success.
          throw new Error(`Non è stato possibile rinominare tutti gli elementi (${errors.length} errori).`);
        }
      }

      showNotification('success', 'Cartella rinominata con successo.');
      await fetchFilesAndFolders(); // Refresh list

    } catch (error: unknown) { // Changed from any to unknown
      console.error('Error renaming folder:', error);
      // Type check
      const errorMessage = error instanceof Error ? error.message : 'Dettagli non disponibili';
      showNotification('error', `Errore rinomina cartella: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };


  const handleCopyUrl = (fileName: string) => {
    const file = files.find(f => f.name === fileName);
    if (file && file.publicUrl) {
      navigator.clipboard.writeText(file.publicUrl)
        .then(() => showNotification('success', 'URL pubblico copiato!'))
        .catch(err => {
          console.error('Failed to copy URL:', err);
          showNotification('error', 'Impossibile copiare l\'URL.');
        });
    } else {
      // Fallback if URL wasn't pre-fetched (shouldn't happen with current logic)
      const path = currentPath ? `${currentPath}/${fileName}` : fileName;
      const { data } = supabase.storage.from('images').getPublicUrl(path);
      if (data?.publicUrl) {
        navigator.clipboard.writeText(data.publicUrl)
          .then(() => showNotification('success', 'URL pubblico copiato!'))
          .catch(err => {
            console.error('Failed to copy URL:', err);
            showNotification('error', 'Impossibile copiare l\'URL.');
          });
      } else {
        showNotification('error', 'URL pubblico non trovato.');
      }
    }
  };

  const navigateToFolder = (folderName: string) => {
    setCurrentPath(prevPath => prevPath ? `${prevPath}/${folderName}` : folderName);
  };

  const navigateUp = () => {
    setCurrentPath(prevPath => prevPath.split('/').slice(0, -1).join('/'));
  };

  // --- Drag and Drop Handlers ---
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if leaving the main drop zone area
    // This basic check might need refinement depending on nested elements
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.stopPropagation();
    setIsDragging(true); // Keep highlighting while over
  };


  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  // --- Render ---
  if (!authUser) {
    // Optional: Show a loading indicator while checking auth before redirecting
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-5"> {/* Adjusted padding top */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6"> {/* Adjusted padding */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 md:mb-0">
              Media
            </h1>
            {/* Action Buttons - Moved here for better mobile layout */}
            <div className="flex items-center space-x-1 md:space-x-2 flex-wrap">
              <button
                onClick={handleCreateFolder}
                disabled={isProcessing}
                className="px-4 py-2 bg-[#822433] text-white rounded-lg hover:bg-[#6d1f2b] transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
              >
                <FolderPlus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Nuova Cartella
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                multiple
                disabled={isProcessing}
              />
              {(isProcessing || isLoading) && <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-gray-500 ml-2" />}
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center space-x-1 md:space-x-2 mb-4 text-xs md:text-sm overflow-x-auto whitespace-nowrap pb-1">
            <button
              onClick={() => setCurrentPath('')}
              disabled={currentPath === '' || isProcessing || isLoading} // Disable when loading too
              className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Root
            </button>
            {currentPath.split('/').filter(Boolean).map((folder, index, array) => ( // Filter(Boolean) removes empty strings from split('/') at the start
              <React.Fragment key={index}>
                <span className="text-gray-400">/</span>
                <button
                  onClick={() => setCurrentPath(array.slice(0, index + 1).join('/'))}
                  disabled={isProcessing || isLoading} // Disable when loading
                  className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {/* Truncate long folder names in breadcrumb if needed */}
                  <span className="max-w-[100px] sm:max-w-[150px] truncate inline-block align-bottom">
                    {folder}
                  </span>
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Notifications */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center justify-between text-sm">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-2">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center justify-between text-sm">
              <span>{success}</span>
              <button onClick={() => setSuccess(null)} className="ml-2">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 md:p-8 mb-6 text-center transition-colors duration-200 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} ${isProcessing ? 'cursor-not-allowed opacity-60' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver} // Use handleDragOver here
            onDragLeave={handleDragLeave}
            onDrop={!isProcessing ? handleDrop : (e) => e.preventDefault()} // Prevent drop when processing
            aria-disabled={isProcessing}
          >
            <Upload className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-xs md:text-sm text-gray-600">
              Trascina i file qui oppure{' '}
              <button
                type="button"
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                disabled={isProcessing}
                className="font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                sfoglia per caricare
              </button>
            </p>
            {isProcessing && (
              <p className="text-xs text-gray-500 mt-2">Caricamento in corso...</p>
            )}
          </div>

          {/* Files and Folders Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12 min-h-[200px]">
              <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
              <span className="ml-3 text-gray-600">Caricamento media...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {/* Up Folder Button */}
              {currentPath && (
                <button
                  onClick={navigateUp}
                  disabled={isProcessing || isLoading}
                  className="p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex flex-col items-center justify-center aspect-square disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Cartella superiore"
                >
                  <ArrowUp className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 font-medium">..</span>
                </button>
              )}

              {/* Folders */}
              {folders.map((folder) => (
                <div
                  key={`folder-${folder.name}`}
                  className="relative group border rounded-lg hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1 transition-all duration-150 flex flex-col"
                >
                  <button
                    onClick={() => navigateToFolder(folder.name)}
                    disabled={isProcessing || isLoading}
                    className="flex-grow flex flex-col items-center justify-center p-4 text-center w-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    title={`Apri cartella ${folder.name}`}
                  >
                    <Folder className="w-10 h-10 md:w-12 md:h-12 text-yellow-500 mb-3 flex-shrink-0" />
                    <span className="text-xs md:text-sm text-gray-800 font-medium break-words w-full line-clamp-2">
                      {folder.name}
                    </span>
                  </button>
                  {/* Actions Overlay - appears on hover/focus-within */}
                  <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRenameFolder(folder.name); }}
                      disabled={isProcessing || isLoading}
                      className="p-1 bg-white rounded-full shadow text-gray-600 hover:text-blue-600 disabled:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      title="Rinomina Cartella"
                    >
                      <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.name); }}
                      disabled={isProcessing || isLoading}
                      className="p-1 bg-white rounded-full shadow text-gray-600 hover:text-red-600 disabled:text-gray-300 focus:outline-none focus:ring-1 focus:ring-red-400"
                      title="Elimina Cartella"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Files */}
              {files.map((file) => (
                <div
                  key={file.id || `file-${file.name}`}
                  className="relative group border rounded-lg hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1 transition-all duration-150 flex flex-col"
                >
                  <div className="flex-grow p-2 flex flex-col">
                    <div className="w-full aspect-square relative mb-2 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {file.metadata.mimetype.startsWith('image/') && file.publicUrl ? (
                        <Image
                          src={file.publicUrl}
                          alt={file.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw" // Optimize image loading
                          className="object-cover"
                          loading="lazy" // Lazy load images below the fold
                          onError={(e) => {
                            // Optional: Handle image loading errors, e.g., show placeholder
                            console.warn(`Failed to load image: ${file.publicUrl}`);
                            (e.target as HTMLImageElement).style.display = 'none'; // Hide broken image icon
                            // You might want to show the ImageIcon here instead
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs md:text-sm text-gray-800 font-medium break-words w-full text-center line-clamp-2 mt-auto">
                      {file.name}
                    </span>
                  </div>
                  {/* Actions Overlay */}
                  <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopyUrl(file.name); }}
                      disabled={isProcessing || isLoading}
                      className="p-1 bg-white rounded-full shadow text-gray-600 hover:text-green-600 disabled:text-gray-300 focus:outline-none focus:ring-1 focus:ring-green-400"
                      title="Copia URL Pubblico"
                    >
                      <LinkIcon className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRenameFile(file.name); }}
                      disabled={isProcessing || isLoading}
                      className="p-1 bg-white rounded-full shadow text-gray-600 hover:text-blue-600 disabled:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      title="Rinomina File"
                    >
                      <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.name); }}
                      disabled={isProcessing || isLoading}
                      className="p-1 bg-white rounded-full shadow text-gray-600 hover:text-red-600 disabled:text-gray-300 focus:outline-none focus:ring-1 focus:ring-red-400"
                      title="Elimina File"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* No items message */}
              {!isLoading && folders.length === 0 && files.length === 0 && !currentPath && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <ImageIcon size={48} className="mx-auto mb-4" />
                  <p>La libreria media è vuota.</p>
                  <p>Trascina i file o usa il pulsante Carica File.</p>
                </div>
              )}
              {!isLoading && folders.length === 0 && files.length === 0 && currentPath && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <Folder size={48} className="mx-auto mb-4" />
                  <p>Questa cartella è vuota.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
