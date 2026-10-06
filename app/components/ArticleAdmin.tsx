'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { blogTranslations } from '../translations/blog';
import { supabase } from '../lib/supabase';
import {
  Edit, Trash, Eye, UploadCloud, Image as ImageIcon, XCircle, Loader2,
  LayoutDashboard, PlusCircle, FileText, Tag, Newspaper
} from 'lucide-react';
import dynamic from 'next/dynamic';
import NextImage from 'next/image';
import { useAdminContext } from '../context/AdminContext';
import { Article } from '../lib/types';
import { createArticle, updateArticleAction, deleteArticleAction, getArticles } from '@/app/actions/articles';

const MDEditor = dynamic(() => import("@uiw/react-md-editor").then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-8 w-8 text-brand" /></div>,
});

export default function ArticleAdmin({ section = 'published' }: { section?: 'draft' | 'published' }) {
  const router = useRouter();
  const { language } = useLanguage();
  const en = language === 'en';
  const { user, viewMode, setViewMode, isEditing, setIsEditing } = useAdminContext();

  const [articles, setArticles] = useState<Article[]>([]);
  const visibleArticles = articles.filter(article => (article.status ?? 'published') === section);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- State for Image Dropzone ---
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const BUCKET_NAME = 'images';
  const [editorContent, setEditorContent] = useState('');
  const [editorContent_en, setEditorContent_en] = useState('');


  // --- useEffects and Handlers ---

  useEffect(() => {
    // Cleanup for blob URLs
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
      if (!data) throw new Error('Upload successful but no data returned.');

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

  useEffect(() => {
    const fetchArticles = async () => {
      if (!user) {
        setLoading(false);
        setArticles([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getArticles();
        setArticles(data || []);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load articles';
        console.error('Error fetching articles:', error);
        setError(message);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentArticle(prev => ({ ...prev, [name]: value }));
  };
  const handleInputChange_en = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || isUploading || uploadError) return;
    setError(null); setSuccess(null);
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const status: 'draft' | 'published' = submitter?.value === 'published' ? 'published' : submitter?.value === 'draft' ? 'draft' : currentArticle.status ?? 'draft';
    try {
      if (!currentArticle.title?.trim() || (status === 'published' && (!currentArticle.title_en?.trim() || !editorContent.trim() || !editorContent_en.trim()))) {
        setError(en ? 'Enter a title. Publishing requires title and content in both languages.' : 'Inserisci un titolo. Per pubblicare, completa titolo e contenuto in entrambe le lingue.');
        return;
      }
      setIsSaving(true);
      const articleDataToSave = {
        ...currentArticle,
        status,
        title: currentArticle.title,
        title_en: currentArticle.title_en,
        content: editorContent,
        content_en: editorContent_en
      };

      let savedArticle: Article;

      if (articleDataToSave.id) {
        // Update
        savedArticle = await updateArticleAction(articleDataToSave.id, articleDataToSave);
      } else {
        // Create
        savedArticle = await createArticle(articleDataToSave);
      }

      if (!savedArticle || !savedArticle.id) throw new Error("Invalid data received after saving.");

      if (isEditing) {
        setArticles(prev => prev.map(a => a.id === savedArticle.id ? savedArticle : a));
      } else {
        setArticles(prev => [savedArticle, ...prev]);
      }
      handleCancel();
      setSuccess(status === 'draft' ? (en ? 'Draft saved' : 'Bozza salvata') : blogTranslations[language].admin.saveSuccess);
      if (status !== section) router.push(status === 'draft' ? '/admin/drafts' : '/admin');

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : blogTranslations[language].admin.error;
      console.error('Error saving article:', error);
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(en ? 'Delete this article permanently?' : 'Eliminare definitivamente questo articolo?')) return;

    setError(null); setSuccess(null);
    try {
      await deleteArticleAction(id);

      setArticles(prev => prev.filter(a => a.id !== id));
      setSuccess(blogTranslations[language].admin.deleteSuccess);

      if (currentArticle.id === id) {
        handleCancel();
      } else {
        setViewMode('list');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : blogTranslations[language].admin.error;
      console.error('Error deleting article:', error);
      setError(message);
    }
  };

  const handleEdit = (article: Article) => {
    setError(null); setSuccess(null);
    setCurrentArticle({ ...article });
    setEditorContent(article.content || '');
    setEditorContent_en(article.content_en || '');
    setIsEditing(true);
    if (article.image_url) {
      setPreviewUrl(article.image_url);
      setUploadError(null);
    } else {
      clearImage();
    }
    setViewMode('form');
    window.scrollTo(0, 0);
  };

  const handleCreateNew = () => {
    setError(null); setSuccess(null);
    setCurrentArticle({ status: 'draft' });
    setEditorContent('');
    setEditorContent_en('');
    setIsEditing(false);
    clearImage();
    setViewMode('form');
    window.scrollTo(0, 0);
  };

  const handleCancel = () => {
    setCurrentArticle({ status: 'draft' });
    setEditorContent('');
    setEditorContent_en('');
    setIsEditing(false);
    clearImage();
    setError(null);

    setViewMode('list');
  };


  // --- Render logic ---
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-4 md:mb-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm flex items-center justify-between">
            <span role="alert">{error}</span>
            <button aria-label={en ? "Dismiss error" : "Chiudi errore"} onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <XCircle size={16} />
            </button>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm flex items-center justify-between">
            <span role="status">{success}</span>
            <button aria-label={en ? "Dismiss message" : "Chiudi messaggio"} onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
              <XCircle size={16} />
            </button>
          </div>
        )}
      </div>

      {viewMode === 'list' && (
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-md border border-gray-200 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
            <h1 className="text-2xl font-semibold text-gray-800">
              {section === 'draft' ? (en ? 'Drafts' : 'Bozze') : (en ? 'Published articles' : 'Articoli pubblicati')}
            </h1>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
            >
              <PlusCircle size={18} />
              {en ? 'New article' : 'Nuovo articolo'}
            </button>
          </div>
          <p className="mb-6 text-sm text-gray-500">{section === 'draft' ? (en ? 'Articles in preparation, visible only in administration.' : 'Articoli in preparazione, visibili solo in amministrazione.') : (en ? 'Manage the articles visible on the blog.' : 'Gestisci gli articoli visibili nel blog.')} · {visibleArticles.length}</p>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-brand" />
            </div>
          ) : visibleArticles.length === 0 ? (
            <p className="text-center text-gray-500 py-12">{section === 'draft' ? (en ? 'No drafts yet. Create an article and save it as a draft.' : 'Nessuna bozza. Crea un articolo e salvalo come bozza.') : blogTranslations[language].noArticles}</p>
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
                        <th scope="col" className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {blogTranslations[language].admin.image}
                        </th>
                        <th scope="col" className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {en ? 'Created on' : 'Creato il'}
                        </th>
                        <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {blogTranslations[language].admin.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {visibleArticles.map((article) => {
                        const date = new Date(article.created_at);
                        const formattedDate = date.toLocaleDateString(language === 'en' ? 'en-US' : 'it-IT', { year: 'numeric', month: 'short', day: 'numeric' });
                        return (
                          <tr key={article.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 md:px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 break-words">
                                {language === 'en' ? article.title_en || article.title : article.title}
                              </div>
                            </td>
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
                            <td className="px-4 md:px-6 py-4 text-right text-sm font-medium">
                              <div className="flex justify-end items-center gap-2">
                                {article.status !== 'draft' && <Link
                                  href={`/blog/${article.id}`}
                                  className="p-1 text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                  title={blogTranslations[language].admin.view}
                                >
                                  <Eye size={16} className="md:size-18" />
                                  <span className="hidden md:inline">{blogTranslations[language].admin.view}</span>
                                </Link>}
                                <button
                                  onClick={() => handleEdit(article)}
                                  className="p-1 text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                  title={blogTranslations[language].admin.edit}
                                >
                                  <Edit size={16} className="md:size-18" />
                                  <span className="hidden md:inline">{blogTranslations[language].admin.edit}</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(article.id)}
                                  className="p-1 text-red-600 hover:text-red-800 flex items-center gap-1"
                                  title={blogTranslations[language].admin.delete}
                                >
                                  <Trash size={16} className="md:size-18" />
                                  <span className="hidden md:inline">{blogTranslations[language].admin.delete}</span>
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

      {viewMode === 'form' && (
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-md border border-gray-200 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              {isEditing
                ? blogTranslations[language].admin.editArticle
                : blogTranslations[language].admin.newArticle}
            </h1>
            <button
              type="button"
              disabled={isSaving || isUploading}
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
            >
              <LayoutDashboard size={16} />
              {en ? 'Back to list' : 'Torna alla lista'}
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{en ? "Save a draft at any time with a title. Complete both languages before publishing." : "Salva una bozza inserendo il titolo. Completa entrambe le lingue prima di pubblicare."}</p>
            <fieldset disabled={isSaving} className="min-w-0 space-y-4 md:space-y-6">

            {/* Title Input */}
            <div className="space-y-1">
              <label htmlFor="article-title" className="block text-sm font-medium text-gray-700">
                <Newspaper size={16} className="inline mr-1 mb-0.5" />
                {blogTranslations[language].admin.articleTitle} (IT)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="article-title"
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
                {blogTranslations[language].admin.articleContent} (IT)
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <MDEditor
                  value={editorContent}
                  onChange={value => setEditorContent(value || '')}
                  textareaProps={{ "aria-label": en ? "Article content in Italian" : "Contenuto articolo in italiano" }}
                  height={300}
                  preview="edit"
                  className="w-full"
                />
              </div>
            </div>

            {/* Title Input EN */}
            <div className="space-y-1">
              <label htmlFor="article-title-en" className="block text-sm font-medium text-gray-700">
                <Newspaper size={16} className="inline mr-1 mb-0.5" />
                {blogTranslations[language].admin.articleTitle} (EN)
                <span className="ml-1 text-xs text-gray-500">({en ? "for publication" : "per pubblicare"})</span>
              </label>
              <input
                type="text"
                id="article-title-en"
                name="title_en"
                value={currentArticle.title_en || ''}
                onChange={handleInputChange_en}
                className=" text-black w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg"
              />
            </div>


            {/* Editor EN */}
            <div data-color-mode="light" className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                <FileText size={16} className="inline mr-1 mb-0.5" />
                {blogTranslations[language].admin.articleContent} (EN)
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <MDEditor
                  value={editorContent_en}
                  onChange={value => setEditorContent_en(value || '')}
                  textareaProps={{ "aria-label": en ? "Article content in English" : "Contenuto articolo in inglese" }}
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
                {en ? 'Cover image' : 'Immagine di copertina'} ({en ? 'optional' : 'facoltativa'})
              </label>
              <div
                role="button"
                tabIndex={isUploading ? -1 : 0}
                aria-label={en ? "Choose article image" : "Scegli immagine articolo"}
                onKeyDown={e => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); if (!isUploading) fileInputRef.current?.click(); } }}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ease-in-out group ${isDragging
                  ? 'border-brand bg-red-50'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                  } ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ minHeight: '150px' }}
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" disabled={isUploading} />

                {isUploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 rounded-lg z-10">
                    <Loader2 className="w-8 h-8 text-brand animate-spin mb-2" />
<p className="text-sm text-gray-600">{en ? "Uploading…" : "Caricamento…"}</p>
                  </div>
                )}

                {!isUploading && (
                  previewUrl ? (
                    <div className="relative">
                      <NextImage
                        src={previewUrl}
                        alt="Image preview"
                        width={240}
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
                    <div className="flex flex-col items-center text-gray-500 pointer-events-none">
                      <UploadCloud className="w-10 h-10 mb-2 text-gray-400" />
                      <p className="font-semibold text-sm">
                        <span className="text-brand">{en ? "Choose an image" : "Scegli un’immagine"}</span> {en ? "or drag it here" : "o trascinala qui"}
                      </p>
                      <p className="text-xs mt-1">PNG, JPG, GIF ({en ? 'max 5 MB recommended' : 'max 5 MB consigliati'})</p>
                    </div>
                  )
                )}
              </div>
              {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
              <input type="hidden" name="image_url" value={currentArticle.image_url || ''} />
            </div>

            {/* Image Alt Text */}
            <div>
              <label htmlFor="image_alt" className="block text-sm font-medium text-gray-700 mb-1">
                <Tag size={16} className="inline mr-1 mb-0.5" />
                {blogTranslations[language].admin.articleImageAlt} ({en ? 'accessibility' : 'accessibilità'})
              </label>
              <input
                type="text"
                id="image_alt"
                name="image_alt"
                value={currentArticle.image_alt || ''}
                onChange={handleInputChange}
                placeholder={blogTranslations[language].admin.imageAltPlaceholder}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 mt-1">{en ? "Describe the image for people using screen readers." : "Descrivi l’immagine per chi usa un lettore di schermo."}</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                disabled={isSaving || isUploading}
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg"
              >
                {blogTranslations[language].admin.cancel}
              </button>
              <button type="submit" name="intent" value="draft" disabled={isSaving || isUploading || !!uploadError} className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg">
                {isSaving ? (en ? 'Saving…' : 'Salvataggio…') : (en ? 'Save draft' : 'Salva bozza')}
              </button>
              <button type="submit" name="intent" value="published" disabled={isSaving || isUploading || !!uploadError} className="w-full sm:w-auto px-4 py-2 text-sm bg-brand text-white rounded-lg">
                {isSaving ? (en ? 'Saving…' : 'Salvataggio…') : currentArticle.status === 'published' ? (en ? 'Save changes' : 'Salva modifiche') : (en ? 'Publish article' : 'Pubblica articolo')}
              </button>
            </div>
            </fieldset>
          </form>
        </div>
      )}
    </main>
  );
}