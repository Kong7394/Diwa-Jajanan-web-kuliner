import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Product, CartItem, StoreSettings } from '../types';
import { formatRupiah, buildWhatsAppLink } from '../utils/formatters';
import { useBackButtonSync } from '../hooks/useBackButtonSync';
import {
  Search,
  X,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  PlusCircle,
  MessageSquare,
  RefreshCw,
  ShoppingBag,
  ChevronRight,
  ArrowLeft,
  Utensils,
} from 'lucide-react';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  settings?: StoreSettings;
  onAddToCart: (cartItems: CartItem[]) => void;
  onOpenMenu: () => void;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  isOpen,
  onClose,
  products,
  settings,
  onAddToCart,
  onOpenMenu,
}) => {
  useBackButtonSync(isOpen, onClose);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  // Cancel order state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ingin menambah/mengubah varian pesanan');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Load saved local orders on mount/open
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('my_orders');
        if (saved) {
          const parsed: Order[] = JSON.parse(saved);
          setLocalOrders(parsed);
          if (parsed.length > 0 && !selectedOrder) {
            // Auto select latest order
            setSelectedOrder(parsed[0]);
          }
        }
      } catch (err) {
        console.error('Failed reading local orders:', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Search API Call
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMsg('Masukkan kode pesanan atau nomor WhatsApp terlebih dahulu.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/orders/lookup?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Pesanan tidak ditemukan');
      }

      if (data.orders.length === 0) {
        setErrorMsg('Tidak ada pesanan yang sesuai dengan pencarian Anda.');
        setSearchResults([]);
      } else {
        setSearchResults(data.orders);
        setSelectedOrder(data.orders[0]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mencari pesanan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh current order
  const handleRefreshOrder = async () => {
    if (!selectedOrder) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/lookup?q=${encodeURIComponent(selectedOrder.orderNumber)}`);
      const data = await res.json();
      if (res.ok && data.success && data.orders.length > 0) {
        const updated = data.orders[0];
        setSelectedOrder(updated);

        // Update local storage if present
        const saved = localStorage.getItem('my_orders');
        if (saved) {
          const parsed: Order[] = JSON.parse(saved);
          const updatedLocal = parsed.map((o) => (o.orderNumber === updated.orderNumber ? updated : o));
          localStorage.setItem('my_orders', JSON.stringify(updatedLocal));
          setLocalOrders(updatedLocal);
        }
      }
    } catch (err) {
      console.error('Failed refreshing order:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Cancel Order
  const handleConfirmCancel = async () => {
    if (!selectedOrder) return;
    setCancelLoading(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.orderNumber}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal membatalkan pesanan.');
      }

      const updated = data.order;
      setSelectedOrder(updated);

      // Update local storage
      const saved = localStorage.getItem('my_orders');
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        const updatedLocal = parsed.map((o) => (o.orderNumber === updated.orderNumber ? updated : o));
        localStorage.setItem('my_orders', JSON.stringify(updatedLocal));
        setLocalOrders(updatedLocal);
      }

      setIsCancelModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Gagal membatalkan pesanan.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Handle "Tambah Pesanan" / Re-order items into active Cart
  const handleReorder = () => {
    if (!selectedOrder) return;

    const cartItemsToAdd: CartItem[] = [];

    selectedOrder.items.forEach((item) => {
      // Find matching product
      const matchingProduct = products.find(
        (p) => p.name.toLowerCase() === item.productName.toLowerCase() || p.id === item.productId
      );

      if (matchingProduct) {
        const matchingVariant = matchingProduct.variants.find(
          (v) => v.name.toLowerCase() === (item.variantName || '').toLowerCase()
        );

        const cartItemId = `${matchingProduct.id}-${matchingVariant ? matchingVariant.name : 'default'}`;

        cartItemsToAdd.push({
          id: cartItemId,
          product: matchingProduct,
          selectedVariant: matchingVariant,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes || '',
        });
      }
    });

    if (cartItemsToAdd.length > 0) {
      onAddToCart(cartItemsToAdd);
      onClose();
    } else {
      // Fallback open menu directly
      onOpenMenu();
      onClose();
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'MENUNGGU_KONFIRMASI':
        return {
          label: 'Menunggu Konfirmasi',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Clock,
        };
      case 'PEMBAYARAN_MENUNGGU':
        return {
          label: 'Menunggu Pembayaran',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Clock,
        };
      case 'PEMBAYARAN_DIKONFIRMASI':
        return {
          label: 'Pembayaran Dikonfirmasi',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
        };
      case 'DIPROSES':
        return {
          label: 'Sedang Diproses & Dimasak',
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: RefreshCw,
        };
      case 'SIAP_DIKIRIM':
        return {
          label: 'Siap Dikirim / Diambil',
          color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          icon: Package,
        };
      case 'DIKIRIM':
        return {
          label: 'Dalam Pengiriman',
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Truck,
        };
      case 'SELESAI':
        return {
          label: 'Pesanan Selesai',
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle2,
        };
      case 'DIBATALKAN':
        return {
          label: 'Pesanan Dibatalkan',
          color: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: XCircle,
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: Clock,
        };
    }
  };

  const statusList: OrderStatus[] = [
    'MENUNGGU_KONFIRMASI',
    'PEMBAYARAN_DIKONFIRMASI',
    'DIPROSES',
    'SIAP_DIKIRIM',
    'DIKIRIM',
    'SELESAI',
  ];

  const getStepProgress = (currentStatus: OrderStatus) => {
    if (currentStatus === 'DIBATALKAN') return -1;
    if (currentStatus === 'PEMBAYARAN_MENUNGGU') return 0;
    const index = statusList.indexOf(currentStatus);
    return index >= 0 ? index : 0;
  };

  const waAdminMessage = selectedOrder
    ? encodeURIComponent(
        `Halo Diwa Jajanan 👋\nSaya ingin menanyakan/menambah pesanan untuk Nomor Pesanan: *${selectedOrder.orderNumber}* (A/N ${selectedOrder.customerName}).`
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFBF5] text-[#2D1B08] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E6DCCF] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 bg-[#2D1B08] text-white flex items-center justify-between border-b border-[#3D2B18] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6321] flex items-center justify-center text-white shadow-md shadow-[#FF6321]/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">Status & Kelola Pesanan</h2>
              <p className="text-xs text-[#D0C2B4]">Cek status, batalkan, atau tambah pesanan Anda</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#D0C2B4] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-[#4A3728]">
              Cari Berdasarkan Kode Pesanan atau No. WhatsApp
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Contoh: DWJ-20260812-001 atau 0857xxx"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6DCCF] bg-white text-sm focus:outline-hidden focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]"
                />
                <Search className="w-4 h-4 text-[#8C7B6B] absolute left-3.5 top-3" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-[#FF6321]/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Cari</span>
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Local Order History Selector Chip Pills */}
          {localOrders.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#8C7B6B]">Pesanan Terakhir Anda:</span>
              <div className="flex flex-wrap gap-2">
                {localOrders.map((ord) => {
                  const isSelected = selectedOrder?.orderNumber === ord.orderNumber;
                  const badge = getStatusBadge(ord.orderStatus);
                  return (
                    <button
                      key={ord.orderNumber}
                      type="button"
                      onClick={() => {
                        setSelectedOrder(ord);
                        setErrorMsg('');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF6321] text-white border-[#FF6321] shadow-xs'
                          : 'bg-white text-[#4A3728] border-[#E6DCCF] hover:bg-[#FFF3E0]'
                      }`}
                    >
                      <span>{ord.orderNumber}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                          isSelected ? 'bg-white/20 text-white' : badge.color
                        }`}
                      >
                        {badge.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Order Details View */}
          {selectedOrder ? (
            <div className="bg-white rounded-2xl border border-[#E6DCCF] p-4 sm:p-5 space-y-5 shadow-xs">
              {/* Order Top Info & Status Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E6DCCF]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-[#2D1B08]">
                      {selectedOrder.orderNumber}
                    </span>
                    <button
                      onClick={handleRefreshOrder}
                      disabled={loading}
                      title="Perbarui status"
                      className="p-1 rounded-lg hover:bg-gray-100 text-[#8C7B6B] hover:text-[#FF6321] transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF6321]' : ''}`} />
                    </button>
                  </div>
                  <span className="text-[11px] text-[#8C7B6B]">
                    Dibuat: {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
                  </span>
                </div>

                {(() => {
                  const badge = getStatusBadge(selectedOrder.orderStatus);
                  const IconComp = badge.icon;
                  return (
                    <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${badge.color}`}>
                      <IconComp className="w-4 h-4" />
                      <span>{badge.label}</span>
                    </div>
                  );
                })()}
              </div>

              {/* Status Timeline Progress Bar */}
              {selectedOrder.orderStatus !== 'DIBATALKAN' && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-[#4A3728]">Progres Pesanan:</span>
                  <div className="relative flex items-center justify-between">
                    {/* Background line */}
                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                    {/* Active line */}
                    <div
                      className="absolute top-1/2 left-4 h-1 bg-[#FF6321] -translate-y-1/2 z-0 transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          (getStepProgress(selectedOrder.orderStatus) / (statusList.length - 1)) * 100
                        )}%`,
                      }}
                    />

                    {statusList.map((st, idx) => {
                      const currentIdx = getStepProgress(selectedOrder.orderStatus);
                      const isCompleted = idx <= currentIdx;
                      return (
                        <div key={st} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                              isCompleted
                                ? 'bg-[#FF6321] text-white shadow-xs scale-105'
                                : 'bg-white border-2 border-gray-300 text-gray-400'
                            }`}
                          >
                            {idx + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-[#8C7B6B] font-medium pt-1">
                    <span>Menunggu</span>
                    <span>Diproses</span>
                    <span>Pengiriman</span>
                    <span>Selesai</span>
                  </div>
                </div>
              )}

              {/* Order Item List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#4A3728]">Detail Item Dipesan:</span>
                <div className="space-y-2 bg-[#FFFBF5] rounded-xl p-3 border border-[#E6DCCF]">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs py-1 border-b border-[#E6DCCF]/50 last:border-0">
                      <div>
                        <span className="font-bold text-[#2D1B08]">{item.quantity}x {item.productName}</span>
                        {item.variantName && (
                          <span className="text-[11px] text-[#8C7B6B] block">Varian: {item.variantName}</span>
                        )}
                        {item.notes && (
                          <span className="text-[11px] text-amber-700 italic block">Catatan: {item.notes}</span>
                        )}
                      </div>
                      <span className="font-bold text-[#2D1B08]">{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}

                  <div className="pt-2 mt-1 border-t border-[#E6DCCF] flex justify-between items-center text-xs font-black text-[#2D1B08]">
                    <span>Total Pembayaran ({selectedOrder.paymentMethod})</span>
                    <span className="text-[#FF6321] text-sm">{formatRupiah(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="text-xs text-[#4A3728] space-y-1 bg-[#FFFBF5] rounded-xl p-3 border border-[#E6DCCF]">
                <div><span className="font-bold">Pemesan:</span> {selectedOrder.customerName} ({selectedOrder.phone})</div>
                <div><span className="font-bold">Alamat:</span> {selectedOrder.address}</div>
              </div>

              {/* ACTION BUTTONS: Batalkan, Tambah Pesanan, WhatsApp, Struk */}
              <div className="pt-2 space-y-2.5">

                {/* Row 1: Tambah Pesanan & Batalkan Pesanan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Button 1: Tambah Pesanan / Pesan Lagi */}
                  <button
                    type="button"
                    onClick={handleReorder}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#FFF3E0] hover:bg-[#FFE0B2] text-[#FF6321] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#FF6321]/30 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Tambah / Pesan Lagi Menu Ini</span>
                  </button>

                  {/* Button 2: Batalkan Pesanan (if eligible) */}
                  {selectedOrder.orderStatus !== 'DIBATALKAN' &&
                  selectedOrder.orderStatus !== 'SELESAI' &&
                  selectedOrder.orderStatus !== 'DIKIRIM' ? (
                    <button
                      type="button"
                      onClick={() => setIsCancelModalOpen(true)}
                      className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-rose-200 transition-all cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Batalkan Pesanan Ini</span>
                    </button>
                  ) : (
                    <div className="text-center py-2 text-[11px] text-[#8C7B6B]">
                      {selectedOrder.orderStatus === 'DIBATALKAN'
                        ? 'Pesanan ini telah dibatalkan'
                        : 'Pesanan tidak dapat dibatalkan karena sedang dikirim/selesai'}
                    </div>
                  )}
                </div>

                {/* Row 2: WhatsApp Chat */}
                <div>
                  <a
                    href={`https://wa.me/${(settings?.whatsappNumber || '6282117579041').replace(/[^0-9]/g, '')}?text=${waAdminMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat Admin via WA</span>
                  </a>
                </div>

              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3 bg-white rounded-2xl border border-[#E6DCCF] p-6">
              <Package className="w-12 h-12 text-[#8C7B6B]/40 mx-auto" />
              <h3 className="text-sm font-bold text-[#2D1B08]">Belum Ada Pesanan Terpilih</h3>
              <p className="text-xs text-[#8C7B6B] max-w-xs mx-auto">
                Cari berdasarkan kode pesanan Anda atau buat pesanan baru melalui menu jajanan.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenMenu();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF6321] text-white text-xs font-bold shadow-md shadow-[#FF6321]/20 hover:bg-[#E55315] transition-all cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>Lihat Daftar Menu</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CANCELLATION CONFIRMATION MODAL */}
      {isCancelModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#2D1B08] w-full max-w-md rounded-3xl p-5 shadow-2xl border border-[#E6DCCF] space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black">Batalkan Pesanan?</h3>
                <p className="text-xs text-[#8C7B6B]">{selectedOrder.orderNumber}</p>
              </div>
            </div>

            <p className="text-xs text-[#4A3728] leading-relaxed">
              Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini akan memperbarui status pesanan menjadi dibatalkan.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#4A3728]">Alasan Pembatalan:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E6DCCF] text-xs bg-[#FFFBF5]"
              >
                <option value="Ingin menambah/mengubah varian pesanan">Ingin menambah/mengubah varian pesanan</option>
                <option value="Salah mengisi alamat / nomor kontak">Salah mengisi alamat / nomor kontak</option>
                <option value="Ingin mengubah metode pembayaran">Ingin mengubah metode pembayaran</option>
                <option value="Batal membeli">Batal membeli</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={cancelLoading}
                className="flex-1 py-2.5 rounded-xl border border-[#E6DCCF] text-xs font-bold text-[#4A3728] hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                {cancelLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Ya, Batalkan Pesanan</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
