import React, { useState } from 'react';
import { StoreSettings as StoreSettingsType } from '../../types';
import { Store, Save, CheckCircle2, Download, Database, FileJson, RefreshCw } from 'lucide-react';

interface StoreSettingsProps {
  settings: StoreSettingsType;
  onSaveSettings: (settings: Partial<StoreSettingsType>) => Promise<void>;
}

export const StoreSettings: React.FC<StoreSettingsProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [storeName, setStoreName] = useState(settings.storeName || 'Diwa Jajanan');
  const [description, setDescription] = useState(settings.description || '');
  const [address, setAddress] = useState(settings.address || '');
  const [openingHours, setOpeningHours] = useState(settings.openingHours || '13.00 - 21.00 WIB');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncDb = async () => {
    try {
      setIsSyncing(true);
      setSyncStatus(null);
      const res = await fetch('/api/sync-db-from-server');
      const data = await res.json();
      if (data.success) {
        setSyncStatus('db.json berhasil disinkronkan dari server.ts!');
        setTimeout(() => setSyncStatus(null), 4000);
      } else {
        setSyncStatus('Gagal menyinkronkan db.json');
      }
    } catch (err) {
      setSyncStatus('Error menyinkronkan db.json');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSaveSettings({
      storeName,
      description,
      address,
      openingHours,
      shippingFee: 0,
    });
    setIsSubmitting(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      <div>
        <h1 className="text-2xl font-black text-[#2D1B08]">Pengaturan Toko</h1>
        <p className="text-xs text-[#8C7B6B]">
          Ubah nama toko, deskripsi, alamat, dan jam operasional toko
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pengaturan toko berhasil diperbarui!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-[#E6DCCF] shadow-2xs space-y-4 text-xs">
        
        <div className="space-y-1">
          <label className="block font-bold text-[#4A3728]">Nama Toko *</label>
          <input
            type="text"
            required
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DCCF] font-bold text-sm text-[#2D1B08] focus:border-[#FF6321] bg-[#FFFBF5]"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-bold text-[#4A3728]">Slogan / Deskripsi Singkat</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DCCF] font-medium text-[#2D1B08] focus:border-[#FF6321] bg-[#FFFBF5]"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-bold text-[#4A3728]">Alamat Lengkap Toko</label>
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DCCF] font-medium text-[#2D1B08] focus:border-[#FF6321] bg-[#FFFBF5]"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-bold text-[#4A3728]">Jam Operasional / Buka</label>
          <input
            type="text"
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
            placeholder="Contoh: 13.00 - 21.00 WIB"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DCCF] font-semibold text-[#2D1B08] bg-[#FFFBF5]"
          />
        </div>

        <div className="pt-3 border-t border-[#E6DCCF] flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>

      </form>

      {/* Backup & Download db.json Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E6DCCF] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF3E0] text-[#FF6321] flex items-center justify-center border border-[#E6DCCF] shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D1B08]">Backup & Download Database (db.json)</h3>
              <p className="text-xs text-[#8C7B6B]">
                Unduh atau sinkronkan data produk, kategori, pesanan, dan pengaturan dalam format <code className="bg-[#FFF3E0] px-1.5 py-0.5 rounded text-[#FF6321] font-mono font-bold">db.json</code> langsung dari <code className="bg-[#FFF3E0] px-1.5 py-0.5 rounded text-[#2D1B08] font-mono font-bold">server.ts</code>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSyncDb}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan db.json dari server.ts'}</span>
          </button>
        </div>

        {syncStatus && (
          <div className="p-3 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="/api/download/db.json"
            download="db.json"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-[#2D1B08] hover:bg-[#4A3728] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer decoration-none"
          >
            <Download className="w-4 h-4 text-[#FF6321]" />
            <span>Download db.json</span>
          </a>

          <a
            href="/api/download/server.ts"
            download="server.ts"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-[#2D1B08] hover:bg-[#4A3728] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer decoration-none"
          >
            <Download className="w-4 h-4 text-[#FF6321]" />
            <span>Download server.ts</span>
          </a>

          <a
            href="/api/download/bun.lock"
            download="bun.lock"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer decoration-none"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download bun.lock</span>
          </a>

          <a
            href="/api/db.json"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-2xl border border-[#E6DCCF] bg-[#FFF3E0]/60 hover:bg-[#E6DCCF] text-[#2D1B08] font-bold text-xs transition-all flex items-center gap-2 cursor-pointer decoration-none"
          >
            <FileJson className="w-4 h-4 text-[#8C7B6B]" />
            <span>Lihat Data JSON Langsung</span>
          </a>
        </div>
      </div>

    </div>
  );
};
