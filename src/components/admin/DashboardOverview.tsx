import React, { useState } from 'react';
import { DashboardStats } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  DollarSign,
  Utensils,
  Flame,
  AlertCircle,
  TrendingUp,
  Download,
  Database,
  RefreshCw,
} from 'lucide-react';

interface DashboardOverviewProps {
  stats: DashboardStats;
  onNavigateTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  onNavigateTab,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

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
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2D1B08] tracking-tight">
          Ringkasan Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#8C7B6B]">
          Statistik performa penjualan dan pesanan toko Diwa Jajanan
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Pesanan Hari Ini */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-4 rounded-3xl border border-[#E6DCCF] shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#FFF3E0] text-[#2D1B08] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-[#E6DCCF]">
            <Clock className="w-5 h-5 text-[#FF6321]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2D1B08]">
            {stats.todayOrdersCount}
          </div>
          <div className="text-[11px] font-semibold text-[#8C7B6B]">Pesanan Hari Ini</div>
        </div>

        {/* Pesanan Baru */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-[#FFF3E0] p-4 rounded-3xl border border-[#FF6321]/40 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#FF6321] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#FF6321]">
            {stats.newOrdersCount}
          </div>
          <div className="text-[11px] font-bold text-[#2D1B08]">Pesanan Baru</div>
        </div>

        {/* Pesanan Diproses */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-4 rounded-3xl border border-[#E6DCCF] shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-blue-200">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2D1B08]">
            {stats.processingOrdersCount}
          </div>
          <div className="text-[11px] font-semibold text-[#8C7B6B]">Diproses / Dikirim</div>
        </div>

        {/* Pesanan Selesai */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-4 rounded-3xl border border-[#E6DCCF] shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2D1B08]">
            {stats.completedOrdersCount}
          </div>
          <div className="text-[11px] font-semibold text-[#8C7B6B]">Selesai</div>
        </div>

        {/* Total Pendapatan */}
        <div className="bg-white p-4 rounded-3xl border border-[#E6DCCF] shadow-2xs col-span-2 sm:col-span-1 lg:col-span-1">
          <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-700 truncate">
            {formatRupiah(stats.totalRevenue)}
          </div>
          <div className="text-[11px] font-semibold text-[#8C7B6B]">Pendapatan Selesai</div>
        </div>

        {/* Total Menu */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-4 rounded-3xl border border-[#E6DCCF] shadow-2xs hover:shadow-md transition-all cursor-pointer group col-span-2 sm:col-span-1 lg:col-span-1"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#FF6321] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2D1B08]">
            {stats.totalProductsCount}
          </div>
          <div className="text-[11px] font-semibold text-[#8C7B6B]">Jumlah Menu</div>
        </div>

      </div>

      {/* Middle Section: Top Products & Quick Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Product Sales List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E6DCCF] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-[#E6DCCF]">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FF6321]" />
              <h3 className="text-base font-bold text-[#2D1B08]">Menu Terlaris (Top Sales)</h3>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-[#FF6321] hover:underline cursor-pointer"
            >
              Kelola Menu
            </button>
          </div>

          {stats.topProductNames && stats.topProductNames.length > 0 ? (
            <div className="space-y-3">
              {stats.topProductNames.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFBF5] border border-[#E6DCCF] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFF3E0] text-[#FF6321] font-extrabold flex items-center justify-center border border-[#E6DCCF]">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-[#2D1B08]">{item.name}</span>
                  </div>
                  <span className="font-mono font-black text-[#FF6321] bg-[#FFF3E0] px-2.5 py-1 rounded-full border border-[#E6DCCF]">
                    {item.sales} Terjual
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8C7B6B] py-6 text-center italic">
              Belum ada data porsi terjual dari pesanan yang berstatus selesai.
            </p>
          )}
        </div>

        {/* Quick Tips / Performance Card */}
        <div className="lg:col-span-5 bg-[#2D1B08] text-[#E6DCCF] p-6 rounded-3xl shadow-lg border border-[#4A3728] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6321]/20 text-[#FF6321] text-xs font-bold border border-[#FF6321]/30">
              <TrendingUp className="w-4 h-4" /> Tips Kelola Toko
            </div>
            <h3 className="text-xl font-black text-white">Pantau Pesanan Masuk</h3>
            <p className="text-xs text-[#E6DCCF]/80 leading-relaxed">
              Pastikan Anda mengonfirmasi pesanan baru secara berkala dan menghubungi pelanggan via WhatsApp untuk memproses pesanan lebih cepat!
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="w-full py-3 px-4 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Buka Daftar Pesanan Pelanggan →
          </button>
        </div>

      </div>

      {/* Download db.json Banner */}
      <div className="bg-white p-5 rounded-3xl border border-[#E6DCCF] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF3E0] text-[#FF6321] flex items-center justify-center border border-[#E6DCCF] shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#2D1B08]">File Database Aplikasi (db.json)</h4>
              <p className="text-xs text-[#8C7B6B]">
                Klik tombol untuk mengunduh seluruh file data aplikasi <code className="bg-[#FFF3E0] px-1 py-0.5 rounded text-[#FF6321] font-mono font-bold">db.json</code> atau sinkronkan dari <code className="bg-[#FFF3E0] px-1 py-0.5 rounded text-[#2D1B08] font-mono font-bold">server.ts</code>
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

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <a
            href="/api/download/db.json"
            download="db.json"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-[#2D1B08] hover:bg-[#4A3728] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer text-decoration-none"
          >
            <Download className="w-4 h-4 text-[#FF6321]" />
            <span>Download db.json</span>
          </a>

          <a
            href="/api/download/server.ts"
            download="server.ts"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-[#FFF3E0] hover:bg-[#E6DCCF] text-[#2D1B08] font-bold text-xs border border-[#E6DCCF] transition-all flex items-center gap-2 cursor-pointer text-decoration-none"
          >
            <Download className="w-4 h-4 text-[#FF6321]" />
            <span>Download server.ts</span>
          </a>

          <a
            href="/api/download/bun.lock"
            download="bun.lock"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer text-decoration-none"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download bun.lock</span>
          </a>
        </div>
      </div>

    </div>
  );
};
