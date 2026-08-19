import React, { useState } from 'react';
import { BankAccount } from '../../types';
import { Plus, Trash2, Landmark, Check, X } from 'lucide-react';

interface BankAccountManagerProps {
  bankAccounts: BankAccount[];
  onAddBankAccount: (bank: Partial<BankAccount>) => Promise<void>;
  onUpdateBankAccount: (id: string, bank: Partial<BankAccount>) => Promise<void>;
  onDeleteBankAccount: (id: string) => Promise<void>;
}

export const BankAccountManager: React.FC<BankAccountManagerProps> = ({
  bankAccounts,
  onAddBankAccount,
  onUpdateBankAccount,
  onDeleteBankAccount,
}) => {
  const [bankName, setBankName] = useState('BCA Syariah');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) return;
    setIsSubmitting(true);
    await onAddBankAccount({
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountHolder: accountHolder.trim(),
      isActive: true,
    });
    setAccountNumber('');
    setAccountHolder('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      <div>
        <h1 className="text-2xl font-black text-[#2D1B08]">Rekening Pembayaran Bank</h1>
        <p className="text-xs text-[#8C7B6B]">
          Kelola nomor rekening bank untuk pembayaran Transfer Bank pelanggan
        </p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="bg-white p-5 rounded-3xl border border-[#E6DCCF] shadow-2xs space-y-4 text-xs">
        <h3 className="font-extrabold uppercase tracking-wider text-[#2D1B08] flex items-center gap-1.5">
          <Landmark className="w-4 h-4 text-[#FF6321]" /> + Tambah Rekening Bank Baru
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block font-bold text-[#4A3728]">Nama Bank *</label>
            <input
              type="text"
              required
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Contoh: BCA Syariah, Mandiri, BRI"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DCCF] font-semibold text-[#2D1B08] focus:border-[#FF6321] bg-[#FFFBF5]"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-[#4A3728]">Nomor Rekening *</label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Contoh: 0440014421"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DCCF] font-mono font-bold text-[#2D1B08] focus:border-[#FF6321] bg-[#FFFBF5]"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-[#4A3728]">Atas Nama Pemilik *</label>
            <input
              type="text"
              required
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="Contoh: Puput Fauziah"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DCCF] font-semibold text-[#2D1B08] focus:border-[#FF6321] bg-[#FFFBF5]"
            />
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold shadow-md cursor-pointer"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Rekening'}
          </button>
        </div>
      </form>

      {/* Account List */}
      <div className="space-y-3">
        {bankAccounts.map((b) => (
          <div
            key={b.id}
            className="bg-white p-4 rounded-3xl border border-[#E6DCCF] shadow-2xs flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF3E0] text-[#2D1B08] flex items-center justify-center shrink-0 border border-[#E6DCCF]">
                <Landmark className="w-5 h-5 text-[#FF6321]" />
              </div>
              <div>
                <h4 className="font-bold text-[#2D1B08]">{b.bankName}</h4>
                <div className="font-mono font-black text-[#FF6321] text-base">
                  {b.accountNumber}
                </div>
                <div className="text-[#8C7B6B]">a.n. {b.accountHolder}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateBankAccount(b.id, { isActive: !b.isActive })}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                  b.isActive
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-[#FFF3E0] text-[#8C7B6B] border border-[#E6DCCF]'
                }`}
              >
                {b.isActive ? 'Aktif' : 'Nonaktif'}
              </button>

              <button
                onClick={() => onDeleteBankAccount(b.id)}
                className="p-2 text-[#8C7B6B] hover:text-red-500 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
