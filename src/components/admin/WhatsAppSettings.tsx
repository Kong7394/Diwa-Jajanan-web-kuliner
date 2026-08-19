import React, { useState } from 'react';
import { StoreSettings } from '../../types';
import { buildWhatsAppLink, cleanWhatsAppNumber } from '../../utils/formatters';
import { MessageSquare, Save, CheckCircle2, ExternalLink } from 'lucide-react';

interface WhatsAppSettingsProps {
  settings: StoreSettings;
  onSaveSettings: (settings: Partial<StoreSettings>) => Promise<void>;
}

export const WhatsAppSettings: React.FC<WhatsAppSettingsProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [whatsappNumber, setWhatsappNumber] = useState(
    settings.whatsappNumber || '6285710237271'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const cleaned = cleanWhatsAppNumber(whatsappNumber);
    await onSaveSettings({ whatsappNumber: cleaned });
    setWhatsappNumber(cleaned);
    setIsSubmitting(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const testWaLink = buildWhatsAppLink(
    whatsappNumber,
    'Halo Diwa Jajanan, ini pesan tes dari Pengaturan Admin.'
  );

  return (
    <div className="space-y-6 max-w-3xl">
      
      <div>
        <h1 className="text-2xl font-black text-[#2D1B08]">Pengaturan WhatsApp Business</h1>
        <p className="text-xs text-[#8C7B6B]">
          Atur nomor WhatsApp Business tempat menerima langsung rincian pesanan checkout pelanggan
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Nomor WhatsApp berhasil disimpan!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-[#E6DCCF] shadow-2xs space-y-5 text-xs">
        
        <div className="space-y-1">
          <label className="block font-bold text-[#4A3728]">Nomor WhatsApp Business Toko *</label>
          <input
            type="text"
            required
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="Contoh: 6285710237271"
            className="w-full px-4 py-3 rounded-2xl border border-[#E6DCCF] font-mono font-black text-base text-[#2D1B08] focus:border-[#FF6321] bg-[#FFFBF5]"
          />
        </div>

        <div className="p-4 bg-[#FFF3E0] rounded-2xl border border-[#E6DCCF] text-[#4A3728] leading-relaxed text-xs">
          💡 <strong>Catatan Format Nomor:</strong> Gunakan kode negara internasional (misalnya <code className="bg-white px-1.5 py-0.5 rounded font-bold border border-[#E6DCCF]">62857...</code>). Jika memasukkan <code className="bg-white px-1.5 py-0.5 rounded font-bold border border-[#E6DCCF]">0857...</code>, sistem akan otomatis mengubahnya menjadi <code className="bg-white px-1.5 py-0.5 rounded font-bold border border-[#E6DCCF]">62857...</code> agar fitur WhatsApp Click-to-Chat berfungsi lancar.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E6DCCF]">
          <a
            href={testWaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#FFF3E0] hover:bg-[#E6DCCF]/50 text-[#2D1B08] font-bold transition-all flex items-center gap-1.5 border border-[#E6DCCF]"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Tes Link WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C7B6B]" />
          </a>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
