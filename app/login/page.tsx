'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { authTranslations } from '../translations/auth';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

// Security constants
const MAX_ATTEMPTS = 3;
const BASE_LOCKOUT_TIME = 30000; // 30 seconds

export default function LoginPage() {
  const { language } = useLanguage();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Security State
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  // Check lockout status on mount and when it changes
  useEffect(() => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const timer = setTimeout(() => {
        setLockoutUntil(null);
        setAttempts(0); // Reset attempts after lockout expires
      }, lockoutUntil - Date.now());
      return () => clearTimeout(timer);
    }
  }, [lockoutUntil]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: ''
    };

    if (!email) {
      newErrors.email = authTranslations[language].requiredField;
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = authTranslations[language].invalidEmail;
      isValid = false;
    }

    if (!password) {
      newErrors.password = authTranslations[language].requiredField;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Pre-flight security check
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const waitTime = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(`Troppi tentativi. Riprova tra ${waitTime} secondi.`);
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Artificial delay to prevent timing attacks and slow down brute-force scripting
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Increment attempts on failure
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
          // Exponential backoff lockout: 30s -> 60s -> 120s ...
          const penaltyMultiplier = Math.pow(2, newAttempts - MAX_ATTEMPTS);
          const lockoutTime = Date.now() + (BASE_LOCKOUT_TIME * penaltyMultiplier);
          setLockoutUntil(lockoutTime);
        }
        console.error("Real Supabase Error:", signInError);
        throw new Error('Invalid credentials'); // Masking original error for security
      }

      // Successful login
      setAttempts(0);
      setLockoutUntil(null);
      router.push('/admin');

    } catch (err: unknown) {
      console.error("Login Error Catch:", err);
      // Generic error message to prevent account enumeration
      setError('Credenziali non valide. Verifica email e password e riprova.');
    } finally {
      setLoading(false);
    }
  };

  // Determine if form should be completely disabled
  const isLockedOut = lockoutUntil !== null && Date.now() < lockoutUntil;

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-brand to-brand-dark">
        <div className="absolute inset-0" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <Lock className="w-16 h-16 mb-4 mt-10" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Area Riservata
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-1 gap-12">
          <div className="bg-white w-full max-w-md mx-auto rounded-xl shadow-lg">
            <div className="border-b p-6">
              <h2 className="text-3xl font-bold text-gray-800">
                {authTranslations[language].loginTitle}
              </h2>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {authTranslations[language].email}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLockedOut || loading}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-brand focus:border-brand disabled:opacity-50 disabled:bg-gray-100`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {authTranslations[language].password}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLockedOut || loading}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-brand focus:border-brand disabled:opacity-50 disabled:bg-gray-100`}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLockedOut || loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Autenticazione in corso...
                      </span>
                    ) : (
                      authTranslations[language].loginButton
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm font-medium text-brand hover:text-brand-dark focus:outline-none transition-colors duration-300"
                >
                  {authTranslations[language].forgotPassword}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
