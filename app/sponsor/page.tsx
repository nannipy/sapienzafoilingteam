'use client';

import React from 'react';
import { HandshakeIcon, MessageCircle} from 'lucide-react';

const SponsorPage = () => {

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="relative h-full  bg-blue-900">
        <div className="absolute h-96 inset-0 bg-blue-900 opacity-90" />
        <div className="relative z-10 h-full p-44 flex flex-col items-center justify-center text-white px-4">
          <HandshakeIcon className="w-20 h-20 mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">Diventa Nostro Partner</h1>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-3xl">
            Unisciti a noi nel percorso verso l&apos; eccellenza nella vela tecnologica e nell&apos; innovazione sostenibile
          </p>
          <a href="#contact" className="bg-white text-blue-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors">
            Contattaci
          </a>
        </div>
      </div>
      
      {/* Contact Section */}
      <div id="contact" className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Parliamo del Tuo Coinvolgimento</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <MessageCircle className="w-6 h-6 text-blue-500" />
                <span className="text-lg">Compila il form per ricevere la nostra brochure sponsor</span>
              </div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Nome e Cognome"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email Aziendale"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Azienda"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Il tuo messaggio"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Invia Richiesta
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SponsorPage;