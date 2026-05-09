'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { signatureTranslations } from '../translations/signature';
import { Loader2, CheckCircle, AlertCircle, Mail, User, CreditCard, Wallet, Smartphone, Banknote } from 'lucide-react';
import { submitSignature } from '../actions/signature';

interface SignatureFormProps {
    onSuccess?: (paymentMethod: string) => void;
}

export default function SignatureForm({ onSuccess }: SignatureFormProps) {
    const { language } = useLanguage();
    const t = signatureTranslations[language].form;

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        payment: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const result = await submitSignature(formData);

            if (result.success) {
                setStatus('success');
                if (onSuccess) onSuccess(formData.payment);
            } else {
                console.error(result.error);
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center"
            >
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-16 h-16 text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">{t.success}</h4>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 p-8 md:p-12 rounded-3xl">
            <div className="space-y-2">
                <p className="text-white/60 text-sm italic">{t.helpText}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email */}
                <div className="space-y-2">
                    <label htmlFor="email" className="flex items-center gap-2 text-white font-medium">
                        <Mail className="w-4 h-4 text-brand" aria-hidden="true" /> {t.email} *
                    </label>
                    <input
                        id="email"
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        maxLength={100}
                        autoComplete="email"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                        placeholder="email@esempio.com"
                    />
                </div>

                {/* Name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="flex items-center gap-2 text-white font-medium">
                        <User className="w-4 h-4 text-brand" aria-hidden="true" /> {t.name} *
                    </label>
                    <input
                        id="name"
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        maxLength={100}
                        autoComplete="name"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                        placeholder="Mario Rossi"
                    />
                </div>
            </div>

            {/* Payment */}
            <fieldset className="space-y-4">
                <legend className="flex items-center gap-2 text-white font-medium">
                    <CreditCard className="w-4 h-4 text-brand" aria-hidden="true" /> {t.payment.label} *
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { id: 'paypal', Icon: Wallet },
                        { id: 'revolut', Icon: Smartphone },
                        { id: 'cash', Icon: Banknote }
                    ].map(({ id: method, Icon }) => (
                        <label key={method} htmlFor={`payment-${method}`} className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 focus-within:ring-offset-void ${formData.payment === method ? 'bg-brand/20 border-brand text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                            <input
                                id={`payment-${method}`}
                                required
                                type="radio"
                                name="payment"
                                value={method}
                                checked={formData.payment === method}
                                onChange={handleChange}
                                className="sr-only"
                                aria-label={t.payment[method as keyof typeof t.payment]}
                            />
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.payment === method ? 'border-brand' : 'border-white/40'}`} aria-hidden="true">
                                {formData.payment === method && <div className="w-2.5 h-2.5 bg-brand rounded-full" />}
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon className={`w-5 h-5 flex-shrink-0 ${formData.payment === method ? 'text-brand' : 'text-white/60'}`} aria-hidden="true" />
                                <span className="text-sm break-words leading-tight">{t.payment[method as keyof typeof t.payment]}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </fieldset>

            <div aria-live="assertive">
                {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                        <AlertCircle className="w-5 h-5" aria-hidden="true" />
                        {t.error}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={status === 'submitting'}
                aria-busy={status === 'submitting'}
                className="w-full py-4 bg-brand hover:bg-brand-light text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-brand/20 uppercase tracking-wider"
            >
                {status === 'submitting' ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                        Invio in corso...
                    </>
                ) : t.submit}
            </button>
        </form>
    );
}
