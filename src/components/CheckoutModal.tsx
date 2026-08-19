import React, { useState } from 'react';
import { CartItem, BankAccount, PaymentMethod, Order } from '../types';
import { formatRupiah } from '../utils/formatters';
import { X, CreditCard, Banknote, Copy, Upload, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import { useBackButtonSync } from '../hooks/useBackButtonSync';

interface CheckoutModalProps {
  isOpen: boolean;
  cart: CartItem[];
  bankAccounts: BankAccount[];
  shippingFee?: number;
  onClose: () => void;
  onSubmitOrder: (orderData: {
    customerName: string;
    phone: string;
    address: string;
    notes: string;
    paymentMethod: PaymentMethod;
    proofOfPaymentUrl: string;
    subtotal: number;
    shippingCost: number;
    total: number;
  }) => Promise<Order | null>;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cart,
  bankAccounts,
  onClose,
  onSubmitOrder,
}) => {
  useBackButtonSync(isOpen, onClose);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [proofOfPaymentUrl, setProofOfPaymentUrl] = useState('');
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  // Bank Copy Handler
  const handleCopyAccount = (accNumber: string, bankId: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedBankId(bankId);
    setTimeout(() => setCopiedBankId(null), 2000);
  };

  // Proof of payment image upload preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Ukuran file bukti transfer maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofOfPaymentUrl(reader.result as string);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Mohon isi Nama Lengkap, Nomor WhatsApp, dan Alamat Pengiriman.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await onSubmitOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        paymentMethod,
        proofOfPaymentUrl,
        subtotal,
        shippingCost: 0,
        total,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses checkout pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#2D1B08]/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E6DCCF] my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#FFF3E0]/70 border-b border-[#E6DCCF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF6321]" />
            <h2 className="text-lg font-black text-[#2D1B08]">Checkout Pesanan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8C7B6B] hover:text-[#2D1B08] hover:bg-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#2D1B08] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2 border-[#E6DCCF]">
              Data Pelanggan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#4A3728]">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCCF] text-sm text-[#2D1B08] focus:outline-hidden focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#4A3728]">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCCF] text-sm text-[#2D1B08] focus:outline-hidden focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#4A3728]">Alamat Lengkap Pengiriman *</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Tuliskan jalan, nomor rumah, RT/RW, atau patokan lokasi..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCCF] text-sm text-[#2D1B08] focus:outline-hidden focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/20"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#4A3728]">Catatan Pesanan Tambahan (Opsional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan tambahan untuk penjual / driver..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCCF] text-sm text-[#2D1B08] focus:outline-hidden focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/20"
              />
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#2D1B08] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2 border-[#E6DCCF]">
              Metode Pembayaran
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  paymentMethod === 'COD'
                    ? 'border-[#FF6321] bg-[#FFF3E0] ring-2 ring-[#FF6321]/20'
                    : 'border-[#E6DCCF] hover:bg-[#FFFBF5]'
                }`}
              >
                <div className={`p-2 rounded-xl ${paymentMethod === 'COD' ? 'bg-[#FF6321] text-white' : 'bg-[#FFF3E0] text-[#4A3728]'}`}>
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2D1B08]">COD (Tunai)</div>
                  <div className="text-[11px] text-[#8C7B6B]">Bayar saat pesan tiba</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('TRANSFER')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  paymentMethod === 'TRANSFER'
                    ? 'border-[#FF6321] bg-[#FFF3E0] ring-2 ring-[#FF6321]/20'
                    : 'border-[#E6DCCF] hover:bg-[#FFFBF5]'
                }`}
              >
                <div className={`p-2 rounded-xl ${paymentMethod === 'TRANSFER' ? 'bg-[#FF6321] text-white' : 'bg-[#FFF3E0] text-[#4A3728]'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2D1B08]">Transfer Bank</div>
                  <div className="text-[11px] text-[#8C7B6B]">Transfer via ATM/MBanking</div>
                </div>
              </button>
            </div>

            {/* Bank Transfer Details */}
            {paymentMethod === 'TRANSFER' && (
              <div className="p-4 bg-[#FFF3E0]/70 rounded-2xl border border-[#E6DCCF] space-y-3">
                <div className="text-xs font-bold text-[#2D1B08]">
                  Rekening Tujuan Transfer:
                </div>

                {bankAccounts.length === 0 ? (
                  <p className="text-xs text-[#8C7B6B] italic">Belum ada rekening aktif.</p>
                ) : (
                  bankAccounts.map((bank) => (
                    <div
                      key={bank.id}
                      className="p-3 bg-white rounded-xl border border-[#E6DCCF] flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#2D1B08]">{bank.bankName}</div>
                        <div className="text-sm font-mono font-black text-[#FF6321]">
                          {bank.accountNumber}
                        </div>
                        <div className="text-[11px] text-[#8C7B6B]">a.n. {bank.accountHolder}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyAccount(bank.accountNumber, bank.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#FFF3E0] hover:bg-[#FF6321] text-[#2D1B08] hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-[#E6DCCF]"
                      >
                        {copiedBankId === bank.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Salin No. Rek
                          </>
                        )}
                      </button>
                    </div>
                  ))
                )}

                {/* Upload Bukti Transfer */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-[#4A3728] mb-1">
                    Upload Bukti Transfer (Opsional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 rounded-xl bg-white border border-[#E6DCCF] text-xs font-bold text-[#2D1B08] hover:bg-[#FFFBF5] cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-[#FF6321]" />
                      <span>Pilih Foto Bukti</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {proofOfPaymentUrl && (
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                        <Check className="w-4 h-4" /> Bukti Ter-upload
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="p-3.5 bg-[#FFF3E0] rounded-2xl border border-[#E6DCCF] text-xs text-[#2D1B08] font-medium">
                💡 <strong>Info COD:</strong> Pembayaran dilakukan secara tunai saat pesanan diterima di alamat pengiriman.
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="p-4 bg-[#FFFBF5] rounded-2xl border border-[#E6DCCF] space-y-2 text-xs">
            <div className="flex justify-between text-sm font-black text-[#2D1B08]">
              <span>Total Pesanan ({cart.length} item)</span>
              <span className="text-base text-[#FF6321]">{formatRupiah(total)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-sm shadow-lg shadow-[#FF6321]/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Memproses Pesanan...</span>
              ) : (
                <span>Konfirmasi & Buat Pesanan</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
