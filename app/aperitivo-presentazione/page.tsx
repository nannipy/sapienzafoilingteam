'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { presentationTranslations } from '../translations/presentation';
import PageLayout from '../components/PageLayout';
import PresentationForm from '../components/PresentationForm';
import { Calendar, MapPin, Info, Copy, Check, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PresentationAperitivoPage() {
    const { language } = useLanguage();
    const t = presentationTranslations[language];
    const [copied, setCopied] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('paypal');

    const iban = " IT46J0366901600114586258543 ";
    const holder = "Federico Romeo";
    const calendarUrl = "https://www.google.com/calendar/event?action=TEMPLATE&text=Presentazione+SFT+%26+Aperitivo&dates=20260509T150000Z/20260509T180000Z&details=Ti+aspettiamo+al+Centro+Velico+3V+per+scoprire+il+nostro+progetto+e+goderci+un+aperitivo+al+tramonto!&location=Centro+Velico+3V,+Trevignano+Romano";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(iban);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    // Scroll to top when registered
    useEffect(() => {
        if (isRegistered) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [isRegistered]);
    // Stagger config for smooth reveals
    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <PageLayout noBottomPadding noBackground>
            <main className="bg-void min-h-screen relative selection:bg-brand selection:text-white pb-24 lg:pb-0">

                {/* Subtle Noise Overlay for texture */}
                <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

                <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 pt-8 lg:pt-32 relative z-20 pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                        {/* Left Column - Poster */}
                        <div className="lg:col-span-6 relative lg:sticky lg:top-32">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center relative"
                            >
                                <picture className="w-full">
                                    <source media="(max-width: 768px)" srcSet="/evento.png" />
                                    <img
                                        src="/evento.png"
                                        alt="Locandina Aperitivo di Presentazione"
                                        className="w-full h-auto max-auto object-contain"
                                    />
                                </picture>
                            </motion.div>
                        </div>

                        {/* Right Column - Registration OR Payment */}
                        <div className="lg:col-span-6">
                            <AnimatePresence mode="wait">
                                {!isRegistered ? (
                                    <motion.div
                                        key="form-container"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                    >
                                        <div className="relative rounded-[2.5rem] bg-white/5 p-[1px] overflow-hidden shadow-2xl shadow-black/50 backdrop-blur-xl">
                                            {/* Subtle animated border effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5" />

                                            <div className="relative bg-void/90 rounded-[calc(2.5rem-1px)] p-8 sm:p-10 lg:p-12" id="registrazione">
                                                <div className="mb-10">
                                                    <h3 className="text-3xl font-syne font-black text-white uppercase tracking-tighter mb-3">Registrazione</h3>
                                                    <p className="text-white/60 font-geist font-medium text-sm sm:text-base">Riserva il tuo posto all'aperitivo in pochi istanti. I posti sono limitati.</p>
                                                </div>

                                                <div className="premium-form-theme text-white">
                                                    <PresentationForm onSuccess={(method) => {
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
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="space-y-8"
                                    >
                                        <div id="success-banner" className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
                                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/20 blur-3xl rounded-full" />
                                            <CheckCircle2 className="w-16 h-16 text-green-400 flex-shrink-0" />
                                            <div className="relative z-10">
                                                <h3 className="text-3xl font-syne font-black text-white uppercase tracking-tighter mb-2">Posto Prenotato!</h3>
                                                <p className="text-white/70 font-geist text-lg">Completa il pagamento qui sotto per finalizzare la tua iscrizione.</p>
                                            </div>
                                        </div>

                                        <div className="relative rounded-[2.5rem] bg-white/5 p-[1px] overflow-hidden shadow-2xl backdrop-blur-xl">
                                            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-transparent opacity-50" />
                                            <div className="relative bg-void/90 rounded-[calc(2.5rem-1px)] p-8 sm:p-10 lg:p-12">
                                                <h2 className="text-2xl md:text-3xl font-syne font-black text-white uppercase tracking-tighter flex items-center gap-4 mb-8">
                                                    <span className="w-6 h-1 bg-brand rounded-full" />
                                                    {paymentMethod === 'cash' ? 'Conferma' : 'Checkout'}
                                                </h2>

                                                <div className="space-y-6">
                                                    <div className="space-y-4">
                                                        {paymentMethod === 'paypal' && (
                                                            <a
                                                                href="https://www.paypal.me/FedericoRomeo766/15"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="group flex items-center justify-between px-8 py-5 bg-[#0070ba] hover:bg-[#003087] text-white rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 hover:-translate-y-1"
                                                            >
                                                                <span className="font-bold text-lg tracking-wide">Paga con PayPal</span>
                                                                <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                    <ArrowRight className="w-5 h-5" />
                                                                </span>
                                                            </a>
                                                        )}
                                                        {paymentMethod === 'revolut' && (
                                                            <a
                                                                href="https://revolut.me/fedrom"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="group flex items-center justify-between px-8 py-5 bg-white text-black hover:bg-gray-100 rounded-2xl transition-all duration-300 shadow-lg shadow-white/5 hover:shadow-white/10 hover:-translate-y-1"
                                                            >
                                                                <span className="font-bold text-lg tracking-wide">Paga con Revolut</span>
                                                                <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                                                    <ArrowRight className="w-5 h-5" />
                                                                </span>
                                                            </a>
                                                        )}
                                                        {paymentMethod === 'iban' && (
                                                            <div className="group relative rounded-3xl bg-white p-[1px] overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                                                                <div className="relative h-full w-full bg-[#f8f9fa] rounded-[calc(1.5rem-1px)] p-6 md:p-8">
                                                                    <div className="flex justify-between items-start mb-8">
                                                                        <div>
                                                                            <p className="text-[#6b7280] text-[11px] font-bold uppercase tracking-[0.2em] mb-2">Bonifico Bancario</p>
                                                                            <h3 className="text-xl md:text-2xl font-syne font-bold uppercase text-black">{holder}</h3>
                                                                        </div>
                                                                        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                                                                            <Info className="w-4 h-4 text-black/40" />
                                                                        </div>
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        onClick={copyToClipboard}
                                                                        aria-label="Copia IBAN negli appunti"
                                                                        className="w-full group/copy flex items-center justify-between bg-white border border-black/5 shadow-sm p-4 md:p-5 rounded-2xl cursor-pointer hover:border-black/20 hover:shadow-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                                                                    >
                                                                        <code className="text-sm md:text-lg font-mono font-medium tracking-tight text-black break-all text-left">
                                                                            {iban}
                                                                        </code>
                                                                        <div className="flex-shrink-0 ml-4 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover/copy:bg-black group-hover/copy:text-white transition-colors duration-300" aria-hidden="true">
                                                                            {copied ? <Check className="w-5 h-5 text-green-500 group-hover/copy:text-green-400" /> : <Copy className="w-5 h-5 text-black/60 group-hover/copy:text-white" />}
                                                                        </div>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <a
                                                            href={calendarUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group flex items-center justify-between px-8 py-5 bg-transparent border border-white/20 hover:border-brand hover:bg-brand/10 text-white rounded-2xl transition-all duration-300 hover:-translate-y-1"
                                                        >
                                                            <span className="font-bold text-lg tracking-wide">Salva Evento nel Calendario</span>
                                                            <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand/20 transition-all">
                                                                <Calendar className="w-5 h-5 text-white" />
                                                            </span>
                                                        </a>

                                                    </div>

                                                    <div className="pt-6 mt-6 border-t border-white/10">
                                                        <p className="text-white/40 text-sm mb-4 font-medium uppercase tracking-wider">{paymentMethod === 'cash' ? 'Oppure paga in anticipo' : 'Altre opzioni di pagamento'}</p>
                                                        <div className="space-y-4 opacity-70 hover:opacity-100 transition-opacity duration-300">
                                                            {paymentMethod !== 'paypal' && (
                                                                <a
                                                                    href="https://www.paypal.me/FedericoRomeo766/15"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="group flex items-center justify-between px-8 py-4 bg-white/5 border border-white/10 hover:bg-[#0070ba] hover:border-transparent text-white rounded-2xl transition-all duration-300"
                                                                >
                                                                    <span className="font-bold text-base tracking-wide">Paga con PayPal</span>
                                                                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                                                                        <ArrowRight className="w-4 h-4" />
                                                                    </span>
                                                                </a>
                                                            )}
                                                            {paymentMethod !== 'revolut' && (
                                                                <a
                                                                    href="https://revolut.me/fedrom"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="group flex items-center justify-between px-8 py-4 bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:border-transparent text-white rounded-2xl transition-all duration-300"
                                                                >
                                                                    <span className="font-bold text-base tracking-wide">Paga con Revolut</span>
                                                                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-black/5 transition-all">
                                                                        <ArrowRight className="w-4 h-4" />
                                                                    </span>
                                                                </a>
                                                            )}
                                                            {paymentMethod !== 'iban' && (
                                                                <div className="group relative rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6 transition-all duration-300 hover:bg-white/10">
                                                                    <div className="flex justify-between items-start mb-4">
                                                                        <div>
                                                                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Bonifico Bancario</p>
                                                                            <h3 className="text-lg font-syne font-bold uppercase text-white">{holder}</h3>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={copyToClipboard}
                                                                        aria-label="Copia IBAN negli appunti"
                                                                        className="w-full group/copy flex items-center justify-between bg-black/20 border border-white/5 p-3 rounded-xl cursor-pointer hover:bg-black/40 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                                                    >
                                                                        <code className="text-sm font-mono font-medium tracking-tight text-white/80 break-all text-left">
                                                                            {iban}
                                                                        </code>
                                                                        <div className="flex-shrink-0 ml-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/copy:bg-white group-hover/copy:text-black transition-colors duration-300">
                                                                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                                                        </div>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
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
                /* Radio buttons container override */
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
                /* Selected radio state */
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
                /* Helpers */
                .premium-form-theme .text-white\/60 { color: rgba(255, 255, 255, 0.5) !important; }
                .premium-form-theme .text-white\/40 { color: rgba(255, 255, 255, 0.3) !important; border-color: rgba(255, 255, 255, 0.1) !important; }
                .premium-form-theme .text-white { color: white !important; }
                /* Submit Button */
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
