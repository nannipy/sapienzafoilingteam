'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { blogTranslations } from '../../translations/blog';
import { supabase } from '../../lib/supabase';
import {
  Edit,
  Trash,
  Eye,
  UploadCloud,
  Image as ImageIcon, // Renamed to avoid conflict with Next/Image
  XCircle,
  Loader2,
  LayoutDashboard, // New icon for Dashboard/List view
  PlusCircle, // New icon for Create view
  FileText, // Icon for article content
  Tag, // Icon for image alt text
  Newspaper // Icon for general article info
} from 'lucide-react';
import dynamic from 'next/dynamic';
import NextImage from 'next/image'; // Use alias for clarity
import debounce from 'lodash.debounce';
import { User } from '@supabase/supabase-js';

// Dynamically import MDEditor
const MDEditor = dynamic(() => import("@uiw/react-md-editor").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-8 w-8 text-[#822433]" /></div>,
});
// If you encounter issues with the default import, try:
// const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });


type Article = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  image_alt: string;
  created_at: string;
};

type ViewMode = 'list' | 'form';

export default function BlogAdminPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // 'list' or 'form'

  // --- State for Image Dropzone ---
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const BUCKET_NAME = 'images'; // <-- IMPORTANT: Change this to your actual bucket name
  const [editorContent, setEditorContent] = useState('');

  // Sync editorContent when currentArticle content changes (loading for edit)
  useEffect(() => {
    setEditorContent(currentArticle.content || '');
  }, [currentArticle.content]);

  // --- Cleanup Preview URL ---
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) { // Only revoke blob URLs
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Debounced function to update the main article state
  const debouncedUpdateArticleContent = useMemo(
    () => debounce((value: string) => {
        setCurrentArticle(prev => ({ ...prev, content: value }));
    }, 500),
    []
  );

  // Handle editor changes: update local state immediately, debounce main state update
  const handleEditorChange = useCallback((value: string | undefined) => {
    setEditorContent(value || '');
    debouncedUpdateArticleContent(value || '');
  }, [debouncedUpdateArticleContent]);

  // --- Handle File Selection (from drop or input) ---
  const handleFileSelected = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
        setUploadError(null);
        // Create a preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        // Automatically start upload
        handleUpload(file);
    } else {
        setPreviewUrl(null);
        if (file) {
             setUploadError('Invalid file type. Please upload an image.');
        }
    }
  };


  // --- Handle File Upload to Supabase ---
  const handleUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { data, error: uploadError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
      if (!urlData || !urlData.publicUrl) throw new Error('Could not get public URL.');

      setCurrentArticle(prev => ({ ...prev, image_url: urlData.publicUrl }));
    } catch (error: unknown) {
      const errorMessage = 'Si è verificato un errore imprevisto';
      console.error('Upload process error:', error);
      setUploadError(errorMessage || 'An unknown error occurred during upload.');
      // Keep preview/file on error for retry? Or clear? Let's keep it for now.
      // clearImage(); // Uncomment to clear on error
    } finally {
      setIsUploading(false);
    }
  };

  // --- Drag and Drop Event Handlers ---
  const preventDefaults = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { preventDefaults(e); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { preventDefaults(e); if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { preventDefaults(e); setIsDragging(true); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(e);
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleFileSelected(files[0]);
    if (e.dataTransfer.items) e.dataTransfer.items.clear(); else e.dataTransfer.clearData();
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files.length > 0) handleFileSelected(e.target.files[0]); };

  // Clear image selection and state
  const clearImage = useCallback(() => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl); // Revoke if it's a blob URL
      }
      setPreviewUrl(null);
      setUploadError(null);
      setIsUploading(false); // Ensure uploading state is reset
      setCurrentArticle(prev => ({ ...prev, image_url: null }));
      if (fileInputRef.current) fileInputRef.current.value = "";
  }, [previewUrl]); // Dependency on previewUrl to revoke correctly

  // Check auth and fetch articles
  useEffect(() => {
    const checkUserAndFetchArticles = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) { router.push('/auth'); return; }
        setUser(data.session.user);

        setLoading(true); setError(null);
        try {
          const response = await fetch('/api/articles', {
            headers: { 'Authorization': `Bearer ${data.session.access_token}` }
          });
          if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch articles');
          setArticles(await response.json());
        }catch (error: unknown) {
          const errorMessage = 'Si è verificato un errore imprevisto';
          console.error('Error fetching articles:', error);
          setError (errorMessage || 'Failed to load articles');
        } finally {
          setLoading(false);
        }
      } catch (error: unknown) {
        console.error('Error checking session:', error);
        router.push('/auth');
      }
    };
    checkUserAndFetchArticles();
  }, [router]);

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentArticle(prev => ({ ...prev, [name]: value }));
  };

  // Create or update article
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      if (!currentArticle.title?.trim() || !editorContent?.trim()) { // Check trimmed values
        setError('Title and content are required');
        return;
      }

      // Make sure the content from the editor state is in the object being saved
      const articleDataToSave = {
          ...currentArticle,
          content: editorContent, // Use the latest content from the editor state
      };

      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error("User session not found.");

      const url = articleDataToSave.id ? `/api/articles/${articleDataToSave.id}` : '/api/articles';
      const method = articleDataToSave.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(articleDataToSave),
      });

      if (!response.ok) throw new Error((await response.json()).error || 'Failed to save article');

      const savedArticle: Article = await response.json();
      if (!savedArticle || !savedArticle.id) throw new Error("Invalid data received after saving.");

      // Update state and UI
      if (isEditing) {
        setArticles(articles.map(a => a.id === savedArticle.id ? savedArticle : a));
      } else {
        setArticles([savedArticle, ...articles]);
      }

      setSuccess(blogTranslations[language].admin.saveSuccess);
      handleCancel(); // Reset form and switch view

    } catch (error: unknown) {
      const errorMessage = 'Si è verificato un errore imprevisto';
      console.error('Error saving article:', error);
      setError(errorMessage || blogTranslations[language].admin.error);
      // Keep the form open on error
    }
  };

  // Delete article
const handleDelete = async (id: string) => {
    // Create custom confirmation dialog
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    confirmDialog.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
            <p class="text-gray-600 mb-6">Are you sure you want to delete this article? This action cannot be undone.</p>
            <div class="flex justify-end gap-4">
                <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg" id="cancelDelete">Cancel</button>
                <button class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg" id="confirmDelete">Delete</button>
            </div>
        </div>
    `;

    document.body.appendChild(confirmDialog);

    // Handle dialog response
    const dialogResult = new Promise((resolve) => {
        document.getElementById('confirmDelete')?.addEventListener('click', () => {
            document.body.removeChild(confirmDialog);
            resolve(true);
        });
        document.getElementById('cancelDelete')?.addEventListener('click', () => {
            document.body.removeChild(confirmDialog);
            resolve(false);
        });
    });

    const confirmed = await dialogResult;
    if (!confirmed) return;

    setError(null); 
    setSuccess(null);
    
    try {
        const session = (await supabase.auth.getSession()).data.session;
        if (!session) throw new Error("User session not found.");

        const response = await fetch(`/api/articles?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            }
        });
        
        if (!response.ok) throw new Error((await response.json()).error || 'Failed to delete article');

        setArticles(articles.filter(a => a.id !== id));
        setSuccess(blogTranslations[language].admin.deleteSuccess);
        
        if (currentArticle.id === id) {
            handleCancel();
        } else {
            setViewMode('list');
        }

    } catch (error: unknown) {
        const errorMessage = 'Si è verificato un errore imprevisto';
        console.error('Error deleting article:', error);
        setError(errorMessage || blogTranslations[language].admin.error);
    }
};

   // Switch to form for editing
   const handleEdit = (article: Article) => {
    setError(null); // Clear errors when starting edit
    setSuccess(null);
    setCurrentArticle({...article}); // Set the full article object
    setIsEditing(true);
    setEditorContent(article.content || ''); // Ensure editor has content
    if (article.image_url) {
        setPreviewUrl(article.image_url); // Show existing image URL
        setUploadError(null);
    } else {
        clearImage(); // Clear if no image
    }
    setViewMode('form');
    window.scrollTo(0, 0); // Scroll to top of form
  };

  // Switch to form for creating
  const handleCreateNew = () => {
      setError(null); // Clear errors when starting new
      setSuccess(null);
      setCurrentArticle({});
      setIsEditing(false);
      setEditorContent('');
      clearImage();
      setViewMode('form');
      window.scrollTo(0, 0);
  };

  // Cancel editing/creating and return to list
  const handleCancel = () => {
    setCurrentArticle({});
    setIsEditing(false);
    setEditorContent('');
    clearImage();
    setError(null);
    // Keep success message visible for a moment? Optionally clear it here:
    // setSuccess(null);
    setViewMode('list');
  };

  // Loading state before authentication check is complete
  if (!user && loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <Loader2 className="animate-spin h-12 w-12 text-[#822433]" />
      </div>
    );
  }

  // Main Dashboard Layout
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10"> {/* Added margin-left to offset sidebar */}
        {/* Notifications */}
         <div className="mb-6 h-10"> {/* Reserve space even when no message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                        <XCircle size={16} />
                    </button>
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm flex items-center justify-between">
                     <span>{success}</span>
                    <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
                        <XCircle size={16} />
                    </button>
                </div>
            )}
        </div>

        {/* Dynamic Content: List or Form */}
        {viewMode === 'list' && (
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {blogTranslations[language].admin.articlesList}
                </h1>
                 <button
                    onClick={handleCreateNew}
                    className="px-4 py-2 bg-[#822433] text-white rounded-lg hover:bg-[#6d1f2b] transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
                    >
                    <PlusCircle size={18} />
                    Create New
                </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-[#822433]" />
              </div>
            ) : articles.length === 0 ? (
              <p className="text-center text-gray-500 py-12">{blogTranslations[language].noArticles}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {blogTranslations[language].admin.articleTitle}
                      </th>
                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Image
                       </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {blogTranslations[language].publishedOn}
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articles.map((article) => {
                      const date = new Date(article.created_at);
                      const formattedDate = date.toLocaleDateString(language === 'en' ? 'en-US' : 'it-IT', { year: 'numeric', month: 'short', day: 'numeric' });
                      return (
                        <tr key={article.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{article.title}</div>
                          </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             {article.image_url ? (
                               <NextImage
                                 src={article.image_url}
                                 alt={article.image_alt || 'Article image'}
                                 width={60}
                                 height={40}
                                 className="h-10 w-auto object-contain rounded"
                               />
                             ) : (
                               <div className="h-10 w-15 flex items-center justify-center bg-gray-100 rounded text-gray-400">
                                 <ImageIcon size={20} />
                               </div>
                             )}
                           </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formattedDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-3 gap-4">
                              <Link href={`/blog/${article.id}`} title={blogTranslations[language].admin.view} className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                                <Eye size={18} />
                                <span>View</span>
                              </Link>
                              <button onClick={() => handleEdit(article)} title={blogTranslations[language].admin.edit} className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
                                <Edit size={18} />
                                <span>Edit</span>
                              </button>
                              <button onClick={() => handleDelete(article.id)} title={blogTranslations[language].admin.delete} className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1">
                                <Trash size={18} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ----- Article Form ----- */}
        {viewMode === 'form' && (
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200 animate-fade-in">
            <div className="flex justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">
                {isEditing
                  ? blogTranslations[language].admin.editArticle
                  : blogTranslations[language].admin.newArticle}
              </h1>
              <div className="flex justify-end space-x-4 ">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
                >
                  <LayoutDashboard size={16} />
                  Back To List
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    <Newspaper size={16} className="inline mr-1 mb-0.5" />
                    {blogTranslations[language].admin.articleTitle}
                    <span className="text-red-500 ml-1"></span>
                </label>
                
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={currentArticle.title || ''}
                  onChange={handleInputChange}
                  placeholder={blogTranslations[language].admin.titlePlaceholder}
                  className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#822433] focus:border-transparent transition-shadow"
                  required
                  autoComplete="off"
                />
              </div>

              {/* Content Editor */}
              <div data-color-mode="light">
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText size={16} className="inline mr-1 mb-0.5" />
                    {blogTranslations[language].admin.articleContent}
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <MDEditor
                        value={editorContent}
                        onChange={handleEditorChange}
                        height={400}
                        preview="edit" // Default to edit view, user can switch
                        // Optional: Customize commands if needed
                    />
                </div>
                 {/* Simple validation message placeholder */}
                 {!editorContent?.trim() && <p className="text-xs text-red-500 mt-1">Content cannot be empty.</p>}
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                     <ImageIcon size={16} className="inline mr-1 mb-0.5" />
                     {blogTranslations[language].admin.articleImage} (Optional)
                </label>
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => !isUploading && fileInputRef.current?.click()} // Prevent click during upload
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ease-in-out group ${
                    isDragging
                        ? 'border-[#822433] bg-red-50'
                        : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    } ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    style={{ minHeight: '150px' }} // Ensure minimum height
                >
                    {/* Hidden File Input */}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" disabled={isUploading} />

                    {/* Loading Overlay */}
                    {isUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 rounded-lg z-10">
                        <Loader2 className="w-8 h-8 text-[#822433] animate-spin mb-2" />
                        <p className="text-sm text-gray-600"> Uploading... </p>
                    </div>
                    )}

                    {/* Preview or Prompt */}
                    {!isUploading && (
                        previewUrl ? (
                            // Preview State
                            <div className="relative">
                                <NextImage
                                    src={previewUrl}
                                    alt="Image preview"
                                    width={240} // Increased size slightly
                                    height={160}
                                    className="mx-auto max-h-40 w-auto rounded-md object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); clearImage(); }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-80 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                    title="Remove image"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            // Default Prompt State
                            <div className="flex flex-col items-center text-gray-500 pointer-events-none"> {/* Disable pointer events on text/icon */}
                                <UploadCloud className="w-10 h-10 mb-2 text-gray-400" />
                                <p className="font-semibold text-sm">
                                <span className="text-[#822433]">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs mt-1">PNG, JPG, GIF (Max 5MB recommended)</p>
                            </div>
                        )
                    )}
                </div>
                 {/* Upload Error Message */}
                {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
                 {/* Hidden field to store URL - or remove if only using dropzone */}
                 <input type="hidden" name="image_url" value={currentArticle.image_url || ''} />
              </div>


             {/* Image Alt Text */}
              <div>
                <label htmlFor="image_alt" className="block text-sm font-medium text-gray-700 mb-1">
                     <Tag size={16} className="inline mr-1 mb-0.5" />
                     {blogTranslations[language].admin.articleImageAlt} (Important for accessibility)
                </label>
                <input
                  type="text"
                  id="image_alt"
                  name="image_alt"
                  value={currentArticle.image_alt || ''}
                  onChange={handleInputChange}
                  placeholder={blogTranslations[language].admin.imageAltPlaceholder}
                  className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#822433] focus:border-transparent transition-shadow"
                  autoComplete="off"
                />
                 <p className="text-xs text-gray-500 mt-1">Describe the image for screen readers and if the image fails to load.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#822433] text-white rounded-lg hover:bg-[#6d1f2b] transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <FileText size={16} />
                  )}
                  {isEditing
                    ? 'Save Changes'
                    : 'Publish Article'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
                >
                  <LayoutDashboard size={16} />
                  Back To List
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}