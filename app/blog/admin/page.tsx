'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
//import { useRouter } from 'next/navigation'; // Keep useRouter if needed for other things
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { blogTranslations } from '../../translations/blog';
import { supabase } from '../../lib/supabase';
import {
  Edit, Trash, Eye, UploadCloud, Image as ImageIcon, XCircle, Loader2,
  LayoutDashboard, PlusCircle, FileText, Tag, Newspaper
} from 'lucide-react';
import dynamic from 'next/dynamic';
import NextImage from 'next/image';
import debounce from 'lodash.debounce';
import { useAdminContext } from '../../context/AdminContext';

const MDEditor = dynamic(() => import("@uiw/react-md-editor").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-8 w-8 text-[#822433]" /></div>,
});


type Article = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  image_alt: string;
  created_at: string;
};

export default function BlogAdminPage() {
  const { language } = useLanguage();
  //const router = useRouter(); // Keep for potential redirects within the page logic
  // Consume context for viewMode, isEditing, user and their setters
  const { user, viewMode, setViewMode, isEditing, setIsEditing } = useAdminContext();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true); // Loading state for articles
  // const [user, setUser] = useState<User | null>(null); // User state now comes from context
  // const [isEditing, setIsEditing] = useState(false); // State now from context
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // const [viewMode, setViewMode] = useState<ViewMode>('list'); // State now from context

  // --- State for Image Dropzone ---
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const BUCKET_NAME = 'images';
  const [editorContent, setEditorContent] = useState('');


  // --- useEffects and Handlers (modify where setViewMode/setIsEditing are used) ---

  useEffect(() => {
    setEditorContent(currentArticle.content || '');
  }, [currentArticle.content]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const debouncedUpdateArticleContent = useMemo(
    () => debounce((value: string) => {
        setCurrentArticle(prev => ({ ...prev, content: value }));
    }, 500),
    []
  );

  const handleEditorChange = useCallback((value: string | undefined) => {
    setEditorContent(value || '');
    debouncedUpdateArticleContent(value || '');
  }, [debouncedUpdateArticleContent]);

  const handleFileSelected = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
        setUploadError(null);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        handleUpload(file);
    } else {
        setPreviewUrl(null);
        if (file) {
             setUploadError('Invalid file type. Please upload an image.');
        }
    }
  };

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
      if (!data) throw new Error('Upload successful but no data returned.'); // Added check

      const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
      if (!urlData || !urlData.publicUrl) throw new Error('Could not get public URL.');

      setCurrentArticle(prev => ({ ...prev, image_url: urlData.publicUrl }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred during upload.';
      console.error('Upload process error:', error);
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

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

    const clearImage = useCallback(() => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setUploadError(null);
        setIsUploading(false);
        setCurrentArticle(prev => ({ ...prev, image_url: null }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [previewUrl]);

  // Fetch articles (Auth check is done in layout)
  useEffect(() => {
    const fetchArticles = async () => {
       if (!user) {
           setLoading(false); // Stop loading if no user
           setArticles([]); // Clear articles if no user
           return;
       }
       setLoading(true);
       setError(null);
       try {
        const session = (await supabase.auth.getSession()).data.session;
        if (!session) {
          throw new Error('Session not found, cannot fetch articles.');
        }

         const response = await fetch('/api/articles', {
             headers: { 'Authorization': `Bearer ${session.access_token}` }
         });
         if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch articles');
         const data = await response.json();
         setArticles(data);
       } catch (error: unknown) {
         const message = error instanceof Error ? error.message : 'Failed to load articles';
         console.error('Error fetching articles:', error);
         setError(message);
         setArticles([]); // Clear articles on fetch error
       } finally {
         setLoading(false);
       }
    };

    fetchArticles();
    // This effect now primarily depends on `user`.
    // setViewMode/setIsEditing might only be needed if a user change should forcefully reset the view.
    // Let's remove them for now and rely on the initial state + handleCancel/handleCreate/handleEdit.
    // If you find you *need* the view to reset when the user object changes (e.g. re-login), add them back.
  }, [user]); // <--- Simplified dependency array

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentArticle(prev => ({ ...prev, [name]: value }));
  };

  // --- Modify handleSubmit, handleDelete, handleEdit, handleCreateNew, handleCancel
  // --- to use setViewMode and setIsEditing from context ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      if (!currentArticle.title?.trim() || !editorContent?.trim()) {
        setError('Title and content are required');
        return;
      }
      const articleDataToSave = { ...currentArticle, content: editorContent };
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error("User session not found.");

      const url = articleDataToSave.id ? `/api/articles/${articleDataToSave.id}` : '/api/articles';
      const method = articleDataToSave.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify(articleDataToSave),
      });

      if (!response.ok) throw new Error((await response.json()).error || 'Failed to save article');
      const savedArticle: Article = await response.json();
      if (!savedArticle || !savedArticle.id) throw new Error("Invalid data received after saving.");

      if (isEditing) { // Use context state
        setArticles(articles.map(a => a.id === savedArticle.id ? savedArticle : a));
      } else {
        setArticles([savedArticle, ...articles]);
      }
      setSuccess(blogTranslations[language].admin.saveSuccess);
      handleCancel(); // Reset form and switch view using context setters

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : blogTranslations[language].admin.error;
      console.error('Error saving article:', error);
      setError(message);
    }
  };

  const handleDelete = async (id: string) => {
        // Keep custom confirmation dialog logic...
        const confirmDialog = document.createElement('div');
        confirmDialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]'; // Ensure higher z-index than header
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

        const dialogResult = new Promise((resolve) => {
            document.getElementById('confirmDelete')?.addEventListener('click', () => {
                if (confirmDialog.parentNode) document.body.removeChild(confirmDialog);
                resolve(true);
            });
            document.getElementById('cancelDelete')?.addEventListener('click', () => {
                 if (confirmDialog.parentNode) document.body.removeChild(confirmDialog);
                resolve(false);
            });
        });

        const confirmed = await dialogResult;
        if (!confirmed) return;
        // ... rest of delete logic ...

        setError(null); setSuccess(null);
        try {
            const session = (await supabase.auth.getSession()).data.session;
            if (!session) throw new Error("User session not found.");

            const response = await fetch(`/api/articles?id=${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` }
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to delete article');

            setArticles(articles.filter(a => a.id !== id));
            setSuccess(blogTranslations[language].admin.deleteSuccess);

            if (currentArticle.id === id) {
                handleCancel(); // Uses context setters
            } else {
                setViewMode('list'); // Use context setter
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : blogTranslations[language].admin.error;
            console.error('Error deleting article:', error);
            setError(message);
        }
    };

  const handleEdit = (article: Article) => {
    setError(null); setSuccess(null);
    setCurrentArticle({...article});
    setIsEditing(true); // Use context setter
    setEditorContent(article.content || '');
    if (article.image_url) {
      setPreviewUrl(article.image_url);
      setUploadError(null);
    } else {
      clearImage();
    }
    setViewMode('form'); // Use context setter
    window.scrollTo(0, 0);
  };

  const handleCreateNew = () => {
    setError(null); setSuccess(null);
    setCurrentArticle({});
    setIsEditing(false); // Use context setter
    setEditorContent('');
    clearImage();
    setViewMode('form'); // Use context setter
    window.scrollTo(0, 0);
  };

  const handleCancel = () => {
    setCurrentArticle({});
    setIsEditing(false); // Use context setter
    setEditorContent('');
    clearImage();
    setError(null);
    // setSuccess(null); // Optionally clear success message immediately
    setViewMode('list'); // Use context setter
  };

  // No need for the initial loading check for user here, layout handles it
  // if (!user && loading) { ... } // Remove this block


  // --- Render logic ---
  return (
    // Modifica il main container
    <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-7xl mx-auto w-full"> {/* Adjust padding if needed */}
      {/* Notifications */}
      {/* Modifica il container delle notifiche */}
      <div className="hidden md:block mb-4 md:mb-6 min-h-[40px]"> {/* Reserve space */}
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

      {/* Dynamic Content: List or Form based on CONTEXT viewMode */}
      {viewMode === 'list' && (
        // Modifica il container del form e della lista
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-md border border-gray-200 animate-fade-in">
          {/* List View Content... (Keep as is) */}
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {blogTranslations[language].admin.articlesList}
                </h1>
                 <button
                    onClick={handleCreateNew} // This uses context setter
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
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {blogTranslations[language].admin.articleTitle}
                          </th>
                          {/* Nascondi queste colonne su mobile */}
                          <th scope="col" className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Image
                          </th>
                          <th scope="col" className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {blogTranslations[language].publishedOn}
                          </th>
                          <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                              <td className="px-4 md:px-6 py-4">
                                {/* Titolo troncato su mobile */}
                                <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] md:max-w-none">
                                  {article.title}
                                </div>
                              </td>
                              {/* Nascondi queste celle su mobile */}
                              <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
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
                              <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{formattedDate}</div>
                              </td>
                              {/* Le azioni rimangono sempre visibili */}
                              <td className="px-4 md:px-6 py-4 text-right text-sm font-medium">
                                <div className="flex justify-end items-center gap-2">
                                  <Link
                                    href={`/blog/${article.id}`}
                                    className="p-1 text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    title="View"
                                  >
                                    <Eye size={16} className="md:size-18" />
                                    <span className="hidden md:inline">View</span>
                                  </Link>
                                  <button
                                    onClick={() => handleEdit(article)}
                                    className="p-1 text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                    title="Edit"
                                  >
                                    <Edit size={16} className="md:size-18" />
                                    <span className="hidden md:inline">Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(article.id)}
                                    className="p-1 text-red-600 hover:text-red-800 flex items-center gap-1"
                                    title="Delete"
                                  >
                                    <Trash size={16} className="md:size-18" />
                                    <span className="hidden md:inline">Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
        </div>
      )}

      {/* ----- Article Form based on CONTEXT viewMode ----- */}
      {viewMode === 'form' && (
        // Modifica il container del form e della lista
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-md border border-gray-200 animate-fade-in">
          {/* Form View Content... (Keep as is, button actions use context setters now) */}
            <div className="flex justify-between items-center mb-6"> {/* Use items-center */}
              <h1 className="text-2xl font-semibold text-gray-800">
                {isEditing // Use context state
                  ? blogTranslations[language].admin.editArticle
                  : blogTranslations[language].admin.newArticle}
              </h1>
              {/* Back to List button is now optional as it's in the header nav */}
               <button
                  type="button"
                  onClick={handleCancel} // Uses context setter
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
                >
                  <LayoutDashboard size={16} />
                  Back To List
                </button>
            </div>
             <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
  
  {/* Title Input */}
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      <Newspaper size={16} className="inline mr-1 mb-0.5" />
      {blogTranslations[language].admin.articleTitle}
      <span className="text-red-500 ml-1">*</span>
    </label>
    <input
      type="text"
      name="title"
      value={currentArticle.title || ''}
      onChange={handleInputChange}
      className=" text-black w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg"
      required
    />
  </div>

  {/* Editor */}
  <div data-color-mode="light" className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      <FileText size={16} className="inline mr-1 mb-0.5" />
      {blogTranslations[language].admin.articleContent}
      <span className="text-red-500 ml-1">*</span>
    </label>
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <MDEditor
        value={editorContent}
        onChange={handleEditorChange}
        height={300}
        preview="edit"
        className="w-full"
      />
    </div>
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
                 <p className="text-xs text-gray-500 mt-1">Describe the image for SEO purposes</p>
              </div>

  {/* Buttons */}
  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:space-x-4 pt-4 border-t border-gray-200">
    <button
      type="button"
      onClick={handleCancel}
      className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isUploading}
      className="w-full sm:w-auto px-4 py-2 text-sm bg-[#822433] text-white rounded-lg"
    >
      {isEditing ? 'Save Changes' : 'Publish Article'}
    </button>
  </div>
</form>
        </div>
      )}
    </main>
  );
}