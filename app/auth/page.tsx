'use client';

import React, { useState } from 'react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { authTranslations } from '../translations/auth';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form validation
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: ''
    };

    // Email validation
    if (!email) {
      newErrors.email = authTranslations[language].requiredField;
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = authTranslations[language].invalidEmail;
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = authTranslations[language].requiredField;
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = authTranslations[language].passwordRequirements;
      isValid = false;
    }

    // Confirm password validation (only for signup)
    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = authTranslations[language].requiredField;
        isValid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = authTranslations[language].passwordsDoNotMatch;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        setSuccess(authTranslations[language].loginSuccess);
        // Redirect to home page after successful login
        router.push('/blog/admin');
      } else {
        // Signup logic
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        setSuccess(authTranslations[language].signupSuccess);
        // Switch to login form after successful signup
        setTimeout(() => setIsLogin(true), 1500);
      }
    } catch (error: unknown) {
      console.error("Descrizione Errore:", error); 
      const errorMessage = 'Si è verificato un errore imprevisto';
      setError(errorMessage || authTranslations[language].errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setErrors({
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-[#822433] to-[#6d1f2b]">
        <div className="absolute inset-0" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <Lock className="w-16 h-16 mb-4 mt-10" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {authTranslations[language].title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-1 gap-12">
          <div className="bg-white w-full max-w-md mx-auto rounded-xl shadow-lg">
            <div className="border-b p-6">
              <h2 className="text-3xl font-bold text-gray-800">
                {isLogin
                  ? authTranslations[language].loginTitle
                  : authTranslations[language].signupTitle}
              </h2>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                  <span>{success}</span>
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
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#822433] focus:border-[#822433]`}
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
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#822433] focus:border-[#822433]`}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field (only for signup) */}
                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      {authTranslations[language].confirmPassword}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#822433] focus:border-[#822433]`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#822433] hover:bg-[#6d1f2b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#822433] transition-colors duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isLogin ? authTranslations[language].loginButton : authTranslations[language].signupButton}
                      </span>
                    ) : (
                      isLogin ? authTranslations[language].loginButton : authTranslations[language].signupButton
                    )}
                  </button>
                </div>
              </form>

              {/* Toggle between login and signup */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? authTranslations[language].noAccount : authTranslations[language].alreadyAccount}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="ml-1 font-medium text-[#822433] hover:text-[#6d1f2b] focus:outline-none transition-colors duration-300"
                  >
                    {isLogin ? authTranslations[language].signupNow : authTranslations[language].loginNow}
                  </button>
                </p>
              </div>

              {/* Forgot Password (only for login) */}
              {isLogin && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-sm font-medium text-[#822433] hover:text-[#6d1f2b] focus:outline-none transition-colors duration-300"
                  >
                    {authTranslations[language].forgotPassword}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;