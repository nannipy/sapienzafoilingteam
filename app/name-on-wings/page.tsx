'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { signatureTranslations } from '../translations/signature';
import PageLayout from '../components/PageLayout';
import SignatureForm from '../components/SignatureForm';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NameOnWingsPage() {
    const { language } = useLanguage();
    const t = signatureTranslations[language];
    const [isRegistered, setIsRegistered] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('paypal');

    // Scroll to top when registered
    useEffect(() => {
        if (isRegistered) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [isRegistered]);

    return (
        <PageLayout noBottomPadding noBackground>
            <main className="bg-void min-h-screen relative selection:bg-brand selection:text-white pb-24 lg:pb-0">

                {/* Subtle Noise Overlay for texture */}
                <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

                <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 pt-8 lg:pt-32 relative z-20 pb-32">
                    <div className="flex flex-col items-center text-center space-y-12">

                        {/* Content Section */}
                        <div className="w-full space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h1 className="text-5xl md:text-7xl font-syne font-black text-white uppercase tracking-tighter mb-6">
                                    {t.title}
                                </h1>
                                <p className="text-xl md:text-2xl font-geist font-medium text-brand mb-8">
                                    {t.subtitle}
                                </p>
                                <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
                                    {t.description}
                                </p>
                            </motion.div>
                        </div>

                        {/* Registration OR Payment */}
                        <div className="w-full max-w-2xl">
                            <AnimatePresence mode="wait">
                                {!isRegistered ? (
                                    <motion.div
                                        key="form-container"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                    >
                                        <div className="relative rounded-[2.5rem] bg-white/5 p-[1px] overflow-hidden shadow-2xl shadow-black/50 backdrop-blur-xl text-left">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5" />

                                            <div className="relative bg-void/90 rounded-[calc(2.5rem-1px)] p-8 sm:p-10 lg:p-12" id="registrazione">
                                                <div className="mb-10 text-center">
                                                    <h3 className="text-3xl font-syne font-black text-white uppercase tracking-tighter mb-3">Registrazione</h3>
                                                    <p className="text-white/60 font-geist font-medium text-sm sm:text-base">Inserisci i tuoi dati e scegli il metodo di pagamento.</p>
                                                </div>

                                                <div className="premium-form-theme text-white">
                                                    <SignatureForm onSuccess={(method) => {
                                                        setPaymentMethod(method);
                                                        setIsRegistered(true);
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="payment-container"
                                        id="payment-start"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="space-y-8 text-left"
                                    >
                                        <div id="success-banner" className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
                                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/20 blur-3xl rounded-full" />
                                            <CheckCircle2 className="w-16 h-16 text-green-400 flex-shrink-0" />
                                            <div className="relative z-10 text-center sm:text-left w-full">
                                                <h3 className="text-3xl font-syne font-black text-white uppercase tracking-tighter mb-2">{t.successBanner.title}</h3>
                                                <p className="text-white/70 font-geist text-lg">{t.successBanner.subtitle}</p>
                                            </div>
                                        </div>

                                        <div className="relative rounded-[2.5rem] bg-white/5 p-[1px] overflow-hidden shadow-2xl backdrop-blur-xl">
                                            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-transparent opacity-50" />
                                            <div className="relative bg-void/90 rounded-[calc(2.5rem-1px)] p-8 sm:p-10 lg:p-12">
                                                <h2 className="text-2xl md:text-3xl font-syne font-black text-white uppercase tracking-tighter flex items-center justify-center gap-4 mb-8">
                                                    <span className="w-6 h-1 bg-brand rounded-full" />
                                                    {paymentMethod === 'cash' ? 'Conferma' : 'Checkout'}
                                                    <span className="w-6 h-1 bg-brand rounded-full" />
                                                </h2>

                                                <div className="space-y-6">
                                                    <div className="space-y-4">
                                                        {paymentMethod === 'paypal' && (
                                                            <a
                                                                href="https://www.paypal.me/FedericoRomeo766/2"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="group flex items-center justify-between px-8 py-5 bg-[#0070ba] hover:bg-[#003087] text-white rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 hover:-translate-y-1"
                                                            >
                                                                <span className="font-bold text-lg tracking-wide">{t.paymentButtons.payWithPaypal}</span>
                                                                <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                    <ArrowRight className="w-5 h-5" />
                                                                </span>
                                                            </a>
                                                        )}
                                                        {paymentMethod === 'revolut' && (
                                                            <a
                                                                href="https://revolut.me/fedrom/2"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="group flex items-center justify-between px-8 py-5 bg-white text-black hover:bg-gray-100 rounded-2xl transition-all duration-300 shadow-lg shadow-white/5 hover:shadow-white/10 hover:-translate-y-1"
                                                            >
                                                                <span className="font-bold text-lg tracking-wide">{t.paymentButtons.payWithRevolut}</span>
                                                                <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                                                    <ArrowRight className="w-5 h-5" />
                                                                </span>
                                                            </a>
                                                        )}
                                                        {paymentMethod === 'cash' && (
                                                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                                                    <p className="text-white font-medium text-center">
                                                                        Contatta uno dei membri del team per consegnare la tua quota!
                                                                    </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

            </main>

            {/* Refined Form Styling inside the dark container */}
            <style jsx global>{`
                .premium-form-theme input, 
                .premium-form-theme select {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                    font-family: var(--font-geist) !important;
                    border-radius: 1rem !important;
                    padding: 1rem 1.25rem !important;
                    transition: all 0.3s ease !important;
                }
                .premium-form-theme input:focus, 
                .premium-form-theme select:focus {
                    border-color: rgba(255, 255, 255, 0.3) !important;
                    background-color: rgba(255, 255, 255, 0.08) !important;
                    outline: none !important;
                    box-shadow: none !important;
                }
                .premium-form-theme label {
                    color: rgba(255, 255, 255, 0.8) !important;
                    font-weight: 600 !important;
                    font-family: var(--font-geist) !important;
                    font-size: 0.875rem !important;
                    text-transform: none !important;
                    letter-spacing: normal !important;
                    margin-bottom: 0.5rem !important;
                    display: flex !important;
                }
                .premium-form-theme .bg-white\/5 {
                    background-color: rgba(255, 255, 255, 0.03) !important;
                    border-color: rgba(255, 255, 255, 0.08) !important;
                    color: rgba(255, 255, 255, 0.6) !important;
                    border-radius: 1rem !important;
                }
                .premium-form-theme .bg-white\/5:hover {
                    border-color: rgba(255, 255, 255, 0.2) !important;
                    background-color: rgba(255, 255, 255, 0.06) !important;
                }
                .premium-form-theme .bg-brand\/20 {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                    border-color: rgba(255, 255, 255, 0.3) !important;
                    color: white !important;
                    border-radius: 1rem !important;
                }
                .premium-form-theme .border-brand {
                    border-color: white !important;
                }
                .premium-form-theme .bg-brand {
                    background-color: white !important;
                }
                .premium-form-theme .text-white\/60 { color: rgba(255, 255, 255, 0.5) !important; }
                .premium-form-theme .text-white\/40 { color: rgba(255, 255, 255, 0.3) !important; border-color: rgba(255, 255, 255, 0.1) !important; }
                .premium-form-theme .text-white { color: white !important; }
                .premium-form-theme button[type="submit"] {
                    background-color: white !important;
                    color: black !important;
                    border-radius: 1rem !important;
                    font-family: var(--font-syne) !important;
                    font-weight: 800 !important;
                    letter-spacing: 0.05em !important;
                    text-transform: uppercase !important;
                    padding: 1.25rem !important;
                    transform: translateY(0);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    box-shadow: 0 0 0 0 rgba(255,255,255,0) !important;
                }
                .premium-form-theme button[type="submit"]:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px -5px rgba(255, 255, 255, 0.2) !important;
                }
                .premium-form-theme button[type="submit"]:disabled {
                    background-color: rgba(255, 255, 255, 0.2) !important;
                    color: rgba(255, 255, 255, 0.5) !important;
                }
                .premium-form-theme .bg-void { background-color: #050505 !important; }
            `}</style>
        </PageLayout>
    );
}
