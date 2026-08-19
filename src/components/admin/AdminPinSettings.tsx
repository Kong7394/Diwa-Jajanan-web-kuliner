import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, Save } from 'lucide-react';

interface AdminPinSettingsProps {
  onChangePin: (newPin: string) => Promise<{ success: boolean; error?: string }>;
}

export const AdminPinSettings: React.FC<AdminPinSettingsProps> = ({ onChangePin }) => {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setErrorMsg('PIN minimal harus terdiri dari 4 angka.');
      return;
    }
    if (newPin !== confirmPin) {
      setErrorMsg('Konfirmasi PIN baru tidak cocok.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await onChangePin(newPin);
    if (res.success) {
      setSuccessMsg(true);
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => setSuccessMsg(false), 3000);
    } else {
      setErrorMsg(res.error || 'Gagal mengubah PIN');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-lg">
      
      <div>
        <h1 className="text-2xl font-black text-[#2D1B08]">Pengaturan PIN Admin</h1>
        <p className="text-xs text-[#8C7B6B]">
          Ubah PIN keamanan untuk mengakses portal manajemen toko Diwa Jajanan
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>PIN Admin berhasil diperbarui!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-[#E6DCCF] shadow-2xs space-y-4 text-xs">
        
        <div className="space-y-1">
          <label className="block font-bold text-[#4A3728]">Masukkan PIN Baru *</label>
          <input
            type="password"
            maxLength={8}
            required
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            placeholder="Minimal 4 angka"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCCF] font-mono font-black text-sm text-center text-[#2D1B08] focus:border-[#FF6321] bg-[#FFFBF5]"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-bold text-[#4A3728]">Konfirmasi PIN Baru *</label>
          <input
            type="password"
            maxLength={8}
            required
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            placeholder="Ulangi PIN baru"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCCF] font-mono font-black text-sm text-center text-[#2D1B08] focus:border-[#FF6321] bg-[#FFFBF5]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isSubmitting ? 'Memproses...' : 'Ubah PIN Sekarang'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
