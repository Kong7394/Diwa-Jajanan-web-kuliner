import React, { useState } from 'react';
import { Shield, Lock, KeyRound, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (pin: string) => Promise<{ success: boolean; error?: string }>;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBackToStore }) => {
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setErrorMsg('Masukkan PIN Admin');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await onLogin(pin);
    if (!res.success) {
      setErrorMsg(res.error || 'PIN Salah! Silakan coba lagi.');
      setPin('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#2D1B08] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6321]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFF3E0]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#FFFBF5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6DCCF] space-y-6 relative z-10">
        
        {/* Back Button */}
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C7B6B] hover:text-[#FF6321] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Toko
        </button>

        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6321] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#FF6321]/20">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-[#2D1B08]">Admin Login</h1>
          <p className="text-xs text-[#8C7B6B]">
            Diwa Jajanan Portal Manajemen Toko
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* PIN Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1 text-center">
            <label className="block text-xs font-extrabold text-[#4A3728] uppercase tracking-wider">
              Masukkan PIN Admin
            </label>
            <div className="relative max-w-xs mx-auto">
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="● ● ● ●"
                className="w-full text-center text-2xl font-black tracking-widest py-3 rounded-2xl border-2 border-[#E6DCCF] text-[#2D1B08] focus:outline-hidden focus:border-[#FF6321] focus:ring-4 focus:ring-[#FF6321]/15 bg-white transition-all"
                autoFocus
              />
            </div>
            {/* PIN default hint removed */}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-sm shadow-md shadow-[#FF6321]/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk Portal Admin'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
