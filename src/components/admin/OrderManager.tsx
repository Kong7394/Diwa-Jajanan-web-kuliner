import React, { useState } from 'react';
import { Order, OrderStatus, PaymentStatus, StoreSettings } from '../../types';
import { formatRupiah, buildWhatsAppLink } from '../../utils/formatters';
import { useBackButtonSync } from '../../hooks/useBackButtonSync';
import {
  ShoppingBag,
  Search,
  X,
  MessageSquare,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  FileImage,
} from 'lucide-react';

interface OrderManagerProps {
  orders: Order[];
  settings: StoreSettings;
  onUpdateOrderStatus: (
    orderId: string,
    orderStatus?: OrderStatus,
    paymentStatus?: PaymentStatus
  ) => Promise<void>;
}

export const OrderManager: React.FC<OrderManagerProps> = ({
  orders,
  settings,
  onUpdateOrderStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useBackButtonSync(!!selectedOrder, () => setSelectedOrder(null));

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === 'ALL' || order.orderStatus === selectedStatus;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (
    orderId: string,
    newOrderStatus?: OrderStatus,
    newPaymentStatus?: PaymentStatus
  ) => {
    setIsUpdating(true);
    await onUpdateOrderStatus(orderId, newOrderStatus, newPaymentStatus);
    setIsUpdating(false);

    // Update locally selected order view
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              orderStatus: newOrderStatus || prev.orderStatus,
              paymentStatus: newPaymentStatus || prev.paymentStatus,
            }
          : null
      );
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'MENUNGGU_KONFIRMASI':
        return <span className="px-2.5 py-1 rounded-full bg-[#FFF3E0] text-[#2D1B08] text-[11px] font-extrabold border border-[#E6DCCF]">MENUNGGU KONFIRMASI</span>;
      case 'PEMBAYARAN_DIKONFIRMASI':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-200">BAYAR DIKONFIRMASI</span>;
      case 'DIPROSES':
        return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-extrabold border border-blue-200">DIPROSES</span>;
      case 'SIAP_DIKIRIM':
      case 'DIKIRIM':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-extrabold border border-indigo-200">DIKIRIM</span>;
      case 'SELESAI':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold">SELESAI</span>;
      case 'DIBATALKAN':
        return <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-extrabold border border-red-200">DIBATALKAN</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-[#FFF3E0] text-[#4A3728] text-[11px] font-extrabold border border-[#E6DCCF]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D1B08]">Manajemen Pesanan</h1>
          <p className="text-xs text-[#8C7B6B]">
            Kelola dan pantau status pesanan pelanggan toko secara langsung
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3 bg-white p-4 rounded-3xl border border-[#E6DCCF] shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8C7B6B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari No. Pesanan atau Nama Pelanggan..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FFFBF5] border border-[#E6DCCF] text-xs font-medium text-[#2D1B08] focus:outline-hidden focus:border-[#FF6321]"
            />
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'Semua Pesanan' },
            { id: 'MENUNGGU_KONFIRMASI', label: 'Menunggu' },
            { id: 'DIPROSES', label: 'Diproses' },
            { id: 'DIKIRIM', label: 'Dikirim' },
            { id: 'SELESAI', label: 'Selesai' },
            { id: 'DIBATALKAN', label: 'Dibatalkan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === tab.id
                  ? 'bg-[#FF6321] text-white shadow-sm'
                  : 'bg-[#FFF3E0] text-[#4A3728] border border-[#E6DCCF] hover:bg-[#E6DCCF]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-3xl border border-[#E6DCCF] shadow-2xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-[#8C7B6B] space-y-2">
            <ShoppingBag className="w-8 h-8 mx-auto text-[#8C7B6B]/60" />
            <p className="text-sm font-semibold">Tidak ada pesanan ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF3E0] text-[#4A3728] font-extrabold uppercase border-b border-[#E6DCCF]">
                <tr>
                  <th className="p-4">No. Pesanan</th>
                  <th className="p-4">Pelanggan</th>
                  <th className="p-4">Total Biaya</th>
                  <th className="p-4">Metode Bayar</th>
                  <th className="p-4">Status Pesanan</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DCCF]/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FFFBF5] transition-colors">
                    <td className="p-4 font-mono font-black text-[#2D1B08]">
                      {order.orderNumber}
                      <span className="block text-[10px] text-[#8C7B6B] font-sans font-normal mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#2D1B08]">{order.customerName}</div>
                      <div className="text-[#8C7B6B]">{order.phone}</div>
                    </td>
                    <td className="p-4 font-black text-[#FF6321] text-sm">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-[#2D1B08] block">
                        {order.paymentMethod}
                      </span>
                      <span className="text-[10px] text-[#8C7B6B]">
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">{getStatusBadge(order.orderStatus)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-xl bg-[#FFF3E0] hover:bg-[#FF6321] text-[#FF6321] hover:text-white font-bold transition-all inline-flex items-center gap-1 border border-[#E6DCCF] cursor-pointer text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1B08]/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto border border-[#E6DCCF]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 border-[#E6DCCF]">
              <div>
                <span className="text-xs text-[#8C7B6B] font-semibold block">Detail Pesanan</span>
                <h3 className="text-xl font-black text-[#2D1B08] font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full text-[#8C7B6B] hover:text-[#2D1B08] hover:bg-[#FFF3E0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Delivery Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FFFBF5] p-4 rounded-2xl border border-[#E6DCCF]">
              <div>
                <span className="text-[#8C7B6B] font-bold uppercase block mb-1">Data Pembeli</span>
                <div className="font-bold text-[#2D1B08] text-sm">{selectedOrder.customerName}</div>
                <div className="text-[#8C7B6B] font-mono mt-0.5">{selectedOrder.phone}</div>
                
                {/* Chat WA Button */}
                <a
                  href={buildWhatsAppLink(selectedOrder.phone, `Halo kak ${selectedOrder.customerName}, mengenai pesanan ${selectedOrder.orderNumber} di Diwa Jajanan...`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Chat WA Pelanggan
                </a>
              </div>

              <div>
                <span className="text-[#8C7B6B] font-bold uppercase block mb-1">Alamat Pengiriman</span>
                <p className="text-[#4A3728] font-medium leading-relaxed">
                  {selectedOrder.address}
                </p>
                {selectedOrder.notes && (
                  <p className="text-[#2D1B08] italic mt-1 bg-[#FFF3E0] p-1.5 rounded-lg border border-[#E6DCCF]">
                    Catatan: "{selectedOrder.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Order List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#8C7B6B] uppercase">Daftar Item</span>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-2xl border border-[#E6DCCF] text-xs bg-[#FFFBF5]">
                    <div>
                      <div className="font-bold text-[#2D1B08]">{item.productName}</div>
                      {item.variantName && (
                        <div className="text-[#FF6321] font-semibold">Varian: {item.variantName}</div>
                      )}
                      <div className="text-[#8C7B6B]">{item.quantity} x {formatRupiah(item.price)}</div>
                    </div>
                    <div className="font-black text-[#2D1B08] text-sm">
                      {formatRupiah(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Proof Preview if Transfer */}
            {selectedOrder.paymentMethod === 'TRANSFER' && (
              <div className="space-y-2 border-t pt-4 border-[#E6DCCF]">
                <span className="text-xs font-bold text-[#8C7B6B] uppercase flex items-center gap-1">
                  <FileImage className="w-4 h-4 text-[#FF6321]" /> Bukti Transfer Bank
                </span>
                {selectedOrder.proofOfPaymentUrl ? (
                  <div className="rounded-2xl overflow-hidden border border-[#E6DCCF] max-h-60 bg-[#2D1B08] flex items-center justify-center">
                    <img
                      src={selectedOrder.proofOfPaymentUrl}
                      alt="Bukti Transfer"
                      className="max-h-60 object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-[#FFF3E0] text-[#2D1B08] rounded-xl text-xs font-medium border border-[#E6DCCF]">
                    Pelanggan belum mengunggah foto bukti transfer.
                  </div>
                )}
              </div>
            )}

            {/* Status Controllers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E6DCCF]">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#4A3728]">Ubah Status Pesanan</label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  disabled={isUpdating}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6DCCF] bg-white text-[#2D1B08] text-xs font-bold focus:border-[#FF6321]"
                >
                  <option value="MENUNGGU_KONFIRMASI">Menunggu Konfirmasi</option>
                  <option value="PEMBAYARAN_DIKONFIRMASI">Pembayaran Dikonfirmasi</option>
                  <option value="DIPROSES">Diproses</option>
                  <option value="SIAP_DIKIRIM">Siap Dikirim</option>
                  <option value="DIKIRIM">Dikirim</option>
                  <option value="SELESAI">Selesai</option>
                  <option value="DIBATALKAN">Dibatalkan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#4A3728]">Ubah Status Pembayaran</label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => handleStatusChange(selectedOrder.id, undefined, e.target.value as PaymentStatus)}
                  disabled={isUpdating}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6DCCF] bg-white text-[#2D1B08] text-xs font-bold focus:border-[#FF6321]"
                >
                  <option value="BELUM_DIBAYAR">Belum Dibayar</option>
                  <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi Bukti</option>
                  <option value="PEMBAYARAN_DIKONFIRMASI">Pembayaran Dikonfirmasi</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end border-t border-[#E6DCCF]">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-[#2D1B08] text-white font-bold text-xs cursor-pointer hover:bg-[#4A3728]"
              >
                Tutup Modal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
