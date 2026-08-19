import React, { useState } from 'react';
import { Order, StoreSettings } from '../types';
import { formatRupiah, buildWhatsAppLink } from '../utils/formatters';
import {
  CheckCircle2,
  MessageSquare,
  Copy,
  Check,
  PackageCheck,
  PartyPopper,
  Sparkles,
  ShoppingBag,
  Clock,
  MapPin,
  CreditCard,
  FileCheck,
} from 'lucide-react';
import { useBackButtonSync } from '../hooks/useBackButtonSync';

interface OrderConfirmationModalProps {
  order: Order | null;
  settings: StoreSettings;
  onClose: () => void;
  onOpenOrderStatus?: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  settings,
  onClose,
  onOpenOrderStatus,
}) => {
  useBackButtonSync(!!order, onClose);

  const [copiedOrderNum, setCopiedOrderNum] = useState(false);

  if (!order) return null;

  // Build formatted WhatsApp message
  const buildWAMessage = () => {
    const itemDetails = order.items
      .map((item, idx) => {
        let str = `${idx + 1}. *${item.productName}*\n`;
        if (item.variantName) str += `   Varian: ${item.variantName}\n`;
        str += `   Qty: ${item.quantity}\n`;
        str += `   Harga: ${formatRupiah(item.price)}\n`;
        str += `   Subtotal: ${formatRupiah(item.subtotal)}`;
        if (item.notes) str += `\n   Catatan: ${item.notes}`;
        return str;
      })
      .join('\n\n');

    const paymentInfo =
      order.paymentMethod === 'TRANSFER'
        ? `Transfer Bank ${order.proofOfPaymentUrl ? '(Bukti Pembayaran Sudah Di-upload)' : '(Bukti Pembayaran Akan Dikirim via Chat)'}`
        : 'COD (Tunai saat pesanan diterima)';

    return `Halo *${settings.storeName || 'Diwa Jajanan'}* 👋

Saya ingin mengonfirmasi pesanan saya:
📋 *KODE PESANAN:* *${order.orderNumber}*
⏰ *Waktu:* ${new Date(order.createdAt).toLocaleString('id-ID')}

━━━━━━━━━━━━━━━━━
*DETAIL PESANAN:*
━━━━━━━━━━━━━━━━━
${itemDetails}

━━━━━━━━━━━━━━━━━
*RINGKASAN PEMBAYARAN:*
━━━━━━━━━━━━━━━━━
Subtotal: ${formatRupiah(order.subtotal)}
Ongkos Kirim: ${order.shippingCost > 0 ? formatRupiah(order.shippingCost) : 'Gratis'}
*TOTAL BAYAR: ${formatRupiah(order.total)}*

━━━━━━━━━━━━━━━━━
*DATA PENERIMA & ALAMAT:*
━━━━━━━━━━━━━━━━━
Nama: *${order.customerName}*
No. WhatsApp: ${order.phone}
Alamat Pengiriman:
${order.address}

Metode Pembayaran: *${paymentInfo}*
Catatan Khusus: ${order.notes || '-'}

Mohon konfirmasi pesanan saya agar dapat segera diproses. Terima kasih! 🙏✨`;
  };

  const waMessageText = buildWAMessage();
  const waTargetNumber = settings.whatsappNumber || '6282117579041';
  const waLink = buildWhatsAppLink(waTargetNumber, waMessageText);

  const handleCopyOrderNum = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopiedOrderNum(true);
    setTimeout(() => setCopiedOrderNum(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#2D1B08]/75 backdrop-blur-xs animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E6DCCF] my-6 text-center p-5 sm:p-7 space-y-5">
        
        {/* Celebration Header Icon */}
        <div className="relative pt-2 pb-1">
          <div className="w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 border-4 border-white animate-bounce duration-1000">
            <PartyPopper className="w-9 h-9 sm:w-10 sm:h-10" />
          </div>
          <div className="absolute top-0 right-1/4 text-amber-400 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute bottom-2 left-1/4 text-emerald-500 animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Congratulatory Title */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pesanan Berhasil Dibuat</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D1B08] tracking-tight">
            🎉 Pesanan Anda Berhasil!
          </h2>
          <p className="text-xs sm:text-sm text-[#8C7B6B] leading-relaxed max-w-md mx-auto">
            Terima kasih <strong className="text-[#2D1B08]">{order.customerName}</strong>! Pesanan Anda telah tersimpan di sistem Diwa Jajanan.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 rounded-2xl bg-[#FFFBF5] border border-[#E6DCCF] text-left space-y-3 text-xs">
          
          {/* Order Number Header */}
          <div className="flex justify-between items-center pb-2.5 border-b border-[#E6DCCF]">
            <span className="text-[#8C7B6B] font-bold">
              Kode Pesanan:
            </span>
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#E6DCCF] shadow-xs">
              <span className="font-mono font-black text-[#FF6321] text-sm sm:text-base">{order.orderNumber}</span>
              <button
                onClick={handleCopyOrderNum}
                className="p-1 text-[#8C7B6B] hover:text-[#2D1B08] transition-colors cursor-pointer"
                title="Salin Kode Pesanan"
                type="button"
              >
                {copiedOrderNum ? (
                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-bold">
                    <Check className="w-3.5 h-3.5" /> Tersalin
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-1.5 py-1 border-b border-[#E6DCCF]">
            <span className="text-[#8C7B6B] font-bold block">Menu yang Dipesan:</span>
            <div className="space-y-1.5 pl-1 max-h-36 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[#2D1B08] text-xs">
                  <div>
                    <span className="font-bold">{item.quantity}x</span> {item.productName}
                    {item.variantName && (
                      <span className="text-[11px] text-[#8C7B6B] block pl-4">Varian: {item.variantName}</span>
                    )}
                    {item.notes && (
                      <span className="text-[11px] text-[#8C7B6B] italic block pl-4">Ket: {item.notes}</span>
                    )}
                  </div>
                  <span className="font-semibold text-right shrink-0">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Address & Payment Info */}
          <div className="space-y-2 py-1 border-b border-[#E6DCCF] text-[11px]">
            <div className="flex items-start gap-1.5 text-[#4A3728]">
              <MapPin className="w-3.5 h-3.5 text-[#FF6321] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Alamat Kirim: </span>
                <span className="text-[#6B5A4D]">{order.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[#4A3728]">
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#FF6321]" />
                <span className="font-bold">Metode Bayar:</span>
              </div>
              <span className="font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                {order.paymentMethod === 'TRANSFER' ? 'Transfer Bank' : 'COD (Tunai saat tiba)'}
              </span>
            </div>

            {/* If transfer proof uploaded */}
            {order.proofOfPaymentUrl && (
              <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-bold">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Foto bukti transfer telah dilampirkan</span>
              </div>
            )}
          </div>

          {/* Total Price */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-[#4A3728] font-bold text-xs">Total Pembayaran:</span>
            <span className="font-black text-[#FF6321] text-base sm:text-lg">{formatRupiah(order.total)}</span>
          </div>
        </div>

        {/* WhatsApp Callout Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400/80 text-left space-y-2 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-emerald-600 text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-emerald-900 text-xs sm:text-sm">
              Langkah Terakhir: Konfirmasi ke WhatsApp
            </h4>
          </div>
          <p className="text-[11px] sm:text-xs text-emerald-800 leading-relaxed">
            Kirimkan detail & bukti pesanan ini ke WhatsApp Admin Dapur Diwa Jajanan (<strong>+{waTargetNumber}</strong>) agar pesanan Anda dapat langsung digoreng dan disiapkan!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Primary WhatsApp Button */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 fill-white text-emerald-600" />
            <span>Kirim Bukti & Pesanan ke WhatsApp</span>
          </a>

          {/* Secondary Action: Track Order Status */}
          {onOpenOrderStatus && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOrderStatus();
              }}
              className="w-full py-3 px-6 rounded-2xl bg-[#FFF3E0] hover:bg-[#FFE0B2] text-[#FF6321] font-bold text-xs border border-[#FF6321]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PackageCheck className="w-4 h-4 text-[#FF6321]" />
              <span>Pantau Status Pesanan</span>
            </button>
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-6 rounded-2xl bg-white hover:bg-[#FFFBF5] text-[#8C7B6B] hover:text-[#2D1B08] font-bold text-xs border border-[#E6DCCF] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Selesai & Kembali ke Menu</span>
          </button>
        </div>

      </div>
    </div>
  );
};

