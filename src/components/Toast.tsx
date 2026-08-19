import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#2D1B08] text-white shadow-2xl border border-[#4A3728] animate-in slide-in-from-bottom duration-300">
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
      )}
      <span className="text-xs font-bold">{message}</span>
      <button onClick={onClose} className="p-1 text-[#E6DCCF] hover:text-white cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
