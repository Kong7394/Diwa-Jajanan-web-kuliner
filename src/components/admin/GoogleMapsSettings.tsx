import React, { useState } from 'react';
import { StoreSettings } from '../../types';
import { getEmbeddableMapsUrl } from '../../utils/formatters';
import { MapPin, Save, CheckCircle2, ExternalLink } from 'lucide-react';

interface GoogleMapsSettingsProps {
  settings: StoreSettings;
  onSaveSettings: (settings: Partial<StoreSettings>) => Promise<void>;
}

export const GoogleMapsSettings: React.FC<GoogleMapsSettingsProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [googleMapsUrl, setGoogleMapsUrl] = useState(
    settings.googleMapsUrl || 'https://maps.app.goo.gl/XnAAn7hkiV9V76rWA'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSaveSettings({ googleMapsUrl });
    setIsSubmitting(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const previewEmbedUrl = getEmbeddableMapsUrl(googleMapsUrl);

  return (
    <div className="space-y-6 max-w-3xl">
      
      <div>
        <h1 className="text-2xl font-black text-[#2D1B08]">Pengaturan Google Maps</h1>
        <p className="text-xs text-[#8C7B6B]">
          Tempelkan (paste) URL atau Link Bagikan Google Maps toko Anda untuk ditampilkan di halaman depan pelanggan
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>URL Google Maps berhasil disimpan!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-[#E6DCCF] shadow-2xs space-y-5 text-xs">
        
        <div className="space-y-1">
          <label className="block font-bold text-[#4A3728]">Google Maps Share / Embed URL *</label>
          <input
            type="url"
            required
            value={googleMapsUrl}
            onChange={(e) => setGoogleMapsUrl(e.target.value)}
            placeholder="https://maps.app.goo.gl/..."
            className="w-full px-4 py-3 rounded-2xl border border-[#E6DCCF] font-mono text-xs font-semibold text-[#2D1B08] focus:border-[#FF6321] bg-[#FFFBF5]"
          />
        </div>

        {/* Live Preview */}
        <div className="space-y-2">
          <label className="block font-bold text-[#4A3728]">Pratinjau Peta Google Maps</label>
          <div className="rounded-2xl overflow-hidden border border-[#E6DCCF] h-64 bg-[#FFFBF5]">
            <iframe
              title="Google Maps Preview"
              src={previewEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E6DCCF]">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#FFF3E0] hover:bg-[#E6DCCF]/50 text-[#2D1B08] font-bold transition-all flex items-center gap-1.5 border border-[#E6DCCF]"
          >
            <MapPin className="w-4 h-4 text-[#FF6321]" />
            <span>Uji Buka di Tab Baru</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C7B6B]" />
          </a>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan URL'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
