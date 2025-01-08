'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Send,
  MessageSquare,
  
  CheckCircle2
} from 'lucide-react';
import {  MapPin, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';


const ContactPage = () => {
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setFormStatus('sending');
    // Simuliamo l'invio del form
    setTimeout(() => {
      setFormStatus('success');
    }, 1000);
  };

  const departments = [
    {
      name: "Ufficio Tecnico",
      email: "technical@teamname.it",
      description: "Per questioni tecniche e collaborazioni tecnologiche"
    },
    {
      name: "Marketing & PR",
      email: "marketing@teamname.it",
      description: "Per partnership, sponsorizzazioni e media"
    },
    {
      name: "Risorse Umane",
      email: "careers@teamname.it",
      description: "Per opportunità di lavoro e stage"
    }
  ];

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-blue-900 to-blue-700 ">
        <div className="absolute inset-0 " />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <MessageSquare className="w-16 h-16 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Contattaci</h1>
          <p className="text-xl text-center">Siamo qui per rispondere alle tue domande</p>
        </div>
      </div>

    

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Invia un messaggio</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oggetto</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Messaggio</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {formStatus === 'sending' ? (
                  'Invio in corso...'
                ) : formStatus === 'success' ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Messaggio Inviato
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Invia Messaggio
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Departments */}

          <div className="bg-white w-full max-w-2xl mx-auto rounded-xl shadow-lg">
            <div className="border-b p-6">
              <h2 className="text-3xl font-bold text-gray-800">I Nostri Contatti</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Email Section */}
                <div className="group">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Email</h3>
                  <a 
                    href="mailto:sapienzafoilingteam@gmail.com" 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Mail className="w-6 h-6 text-blue-600" />
                    <span className="text-blue-600 group-hover:underline">sapienzafoilingteam@gmail.com</span>
                  </a>
                </div>

                {/* Location Section */}
                <div className="group">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Sede</h3>
                  <a 
                    href="https://goo.gl/maps/YOUR_LOCATION" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <span className="text-blue-600 group-hover:underline">Via Eudossiana 18, 00184 Roma</span>
                  </a>
                </div>

                {/* Social Links */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Social</h3>
                  <div className="flex space-x-4">
                    <a 
                      href="#" 
                      className="p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-6 h-6 text-blue-600" />
                    </a>
                    <a 
                      href="#" 
                      className="p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-6 h-6 text-blue-600" />
                    </a>
                    <a 
                      href="#" 
                      className="p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-6 h-6 text-blue-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

 

      {/* FAQ Link Section */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Hai altre domande?</h2>
          <p className="text-gray-600 mb-6">
            Consulta la nostra sezione FAQ per trovare risposte alle domande più comuni
          </p>
          <a
            href="/faq"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Visita le FAQ
          </a>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;