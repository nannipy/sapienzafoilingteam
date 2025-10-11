'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';
import { supabase } from '@/app/lib/supabase';
import { Event } from '@/app/lib/types';
import { eventTranslations } from '@/app/translations/event';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { UploadCloud, Image as ImageIcon, XCircle, Loader2, LayoutDashboard, Newspaper, CalendarDays, MapPin, Tag } from 'lucide-react';

interface EventFormProps {
    initialData?: Partial<Event>;
    onSubmit: (event: Partial<Event>) => Promise<void>;
    isSubmitting: boolean;
    error: string | null;
    pageTitle: string;
    submitButtonText: string;
}

const BUCKET_NAME = 'images';

export default function EventForm({ initialData = {}, onSubmit, isSubmitting, error, pageTitle, submitButtonText }: EventFormProps) {
    const { language } = useLanguage();
    const router = useRouter();

    const [currentEvent, setCurrentEvent] = useState<Partial<Event>>(initialData);
    
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData.image_url || null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Revoke object URL on cleanup to prevent memory leaks
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: Date | null) => {
        setCurrentEvent(prev => ({ ...prev, date: date ? date.toISOString() : undefined }));
    };

    const handleFileSelected = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setUploadError(null);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            handleUpload(file);
        } else {
            setPreviewUrl(null);
            if (file) setUploadError('Invalid file type. Please upload an image.');
        }
    };

    const handleUpload = async (file: File) => {
        if (!file) return;
        setIsUploading(true);
        setUploadError(null);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { data, error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);

            if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
            if (!data) throw new Error('Upload successful but no data returned.');

            const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
            setCurrentEvent(prev => ({ ...prev, image_url: urlData.publicUrl }));
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred during upload.';
            console.error('Upload process error:', error);
            setUploadError(message);
        } finally {
            setIsUploading(false);
        }
    };

    const clearImage = useCallback(() => {
        if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setUploadError(null);
        setIsUploading(false);
        setCurrentEvent(prev => ({ ...prev, image_url: null }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [previewUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentEvent.title?.trim() || !currentEvent.title_en?.trim() || !currentEvent.date?.trim() || !currentEvent.location?.trim()) {
            // This basic validation can be improved with a more robust library if needed
            alert('Please fill all required fields.');
            return;
        }
        await onSubmit(currentEvent);
    };

    // Drag and Drop handlers
    const preventDefaults = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { preventDefaults(e); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { preventDefaults(e); if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { preventDefaults(e); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        preventDefaults(e);
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) handleFileSelected(files[0]);
    };
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) handleFileSelected(e.target.files[0]);
    };

    return (
        <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-4xl mx-auto w-full">
             <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-md border border-gray-200 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
                    <button type="button" onClick={() => router.push('/admin/events')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm">
                        <LayoutDashboard size={16} />
                        Back To List
                    </button>
                </div>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    {/* Title IT */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700"><Newspaper size={16} className="inline mr-1 mb-0.5" />{eventTranslations[language].admin.eventTitle} (IT)<span className="text-red-500 ml-1">*</span></label>
                        <input type="text" name="title" value={currentEvent.title || ''} onChange={handleInputChange} className="mt-1 text-black w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                    </div>
                    {/* Title EN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700"><Newspaper size={16} className="inline mr-1 mb-0.5" />{eventTranslations[language].admin.eventTitle} (EN)<span className="text-red-500 ml-1">*</span></label>
                        <input type="text" name="title_en" value={currentEvent.title_en || ''} onChange={handleInputChange} className="mt-1 text-black w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                    </div>
                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700"><CalendarDays size={16} className="inline mr-1 mb-0.5" />{eventTranslations[language].admin.eventDate}<span className="text-red-500 ml-1">*</span></label>
                        <DatePicker selected={currentEvent.date ? new Date(currentEvent.date) : null} onChange={handleDateChange} dateFormat="dd/MM/yyyy" className="mt-1 text-black w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                    </div>
                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700"><MapPin size={16} className="inline mr-1 mb-0.5" />{eventTranslations[language].admin.eventLocation}<span className="text-red-500 ml-1">*</span></label>
                        <input type="text" name="location" value={currentEvent.location || ''} onChange={handleInputChange} className="mt-1 text-black w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1"><ImageIcon size={16} className="inline mr-1 mb-0.5" />{eventTranslations[language].admin.eventImage} (Optional)</label>
                        <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => !isUploading && fileInputRef.current?.click()}
                            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center transition-colors group ${isDragging ? 'border-[#822433] bg-red-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'} ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" disabled={isUploading} />
                            {isUploading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-10"><Loader2 className="w-8 h-8 text-[#822433] animate-spin mb-2" /><p>Uploading...</p></div>
                            ) : previewUrl ? (
                                <div className="relative">
                                    <NextImage src={previewUrl} alt="Preview" width={240} height={160} className="mx-auto max-h-40 w-auto rounded-md object-contain" />
                                    <button type="button" onClick={(e) => { e.stopPropagation(); clearImage(); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 group-hover:opacity-100" title="Remove image"><XCircle className="w-5 h-5" /></button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-gray-500"><UploadCloud className="w-10 h-10 mb-2 text-gray-400" /><p className="font-semibold text-sm"><span className="text-[#822433]">Click to upload</span> or drag and drop</p><p className="text-xs mt-1">PNG, JPG, GIF</p></div>
                            )}
                        </div>
                        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
                    </div>

                    {/* Image Alt Text */}
                    <div>
                        <label htmlFor="image_alt" className="block text-sm font-medium text-gray-700 mb-1"><Tag size={16} className="inline mr-1 mb-0.5" />{eventTranslations[language].admin.eventImageAlt}</label>
                        <input type="text" id="image_alt" name="image_alt" value={currentEvent.image_alt || ''} onChange={handleInputChange} placeholder={eventTranslations[language].admin.imageAltPlaceholder} className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg" />
                        <p className="text-xs text-gray-500 mt-1">Describe the image for SEO and accessibility.</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                        <button type="button" onClick={() => router.back()} className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" disabled={isUploading || isSubmitting} className="w-full sm:w-auto px-4 py-2 text-sm bg-[#822433] text-white rounded-lg disabled:bg-gray-400">
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin inline" /> : submitButtonText}
                        </button>
                    </div>
                </form>
             </div>
        </main>
    );
}