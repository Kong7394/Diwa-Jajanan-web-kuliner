import React, { useState, useEffect } from 'react';
import { Product, Category, ProductVariant } from '../../types';
import { X, Plus, Trash2, Upload, Flame, Check, AlertCircle } from 'lucide-react';
import { useBackButtonSync } from '../../hooks/useBackButtonSync';

interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  categories,
  onClose,
  onSave,
}) => {
  useBackButtonSync(true, onClose);

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || 'cat-1');
  const [basePrice, setBasePrice] = useState(product?.basePrice || 15000);
  const [imageUrl, setImageUrl] = useState(
    product?.imageUrl ||
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80'
  );
  const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants || [{ name: 'Original', price: 15000 }]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle dynamic variants
  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { name: 'Varian Baru', price: basePrice }]);
  };

  const handleUpdateVariant = (index: number, field: 'name' | 'price', value: any) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle file image upload from phone/computer
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Ukuran file gambar maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama menu wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        categoryId,
        basePrice: Number(basePrice) || 0,
        imageUrl,
        isAvailable,
        isBestSeller,
        variants,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan menu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1B08]/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E6DCCF] my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#FFF3E0] border-b border-[#E6DCCF] flex items-center justify-between">
          <h2 className="text-lg font-black text-[#2D1B08]">
            {product ? 'Edit Menu Jajanan' : '+ Tambah Menu Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8C7B6B] hover:text-[#2D1B08] hover:bg-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-bold text-[#4A3728]">Nama Menu *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Seblak Diwa Komplit"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DCCF] text-xs font-semibold text-[#2D1B08] focus:border-[#FF6321] bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-[#4A3728]">Kategori Menu *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DCCF] text-xs font-semibold text-[#2D1B08] focus:border-[#FF6321] bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block font-bold text-[#4A3728]">Deskripsi Singkat</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan rasa, tekstur, atau keunikan menu ini..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DCCF] text-xs text-[#2D1B08] focus:border-[#FF6321] bg-white"
            />
          </div>

          {/* Image Upload & Base Price */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            
            <div className="sm:col-span-7 space-y-2">
              <label className="block font-bold text-[#4A3728]">Foto Menu</label>
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-[#FFFBF5] overflow-hidden shrink-0 border border-[#E6DCCF]">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <label className="px-4 py-2.5 rounded-xl bg-[#FFF3E0] text-[#FF6321] hover:bg-[#FF6321] hover:text-white font-bold transition-all cursor-pointer flex items-center gap-2 border border-[#E6DCCF]">
                  <Upload className="w-4 h-4" />
                  <span>Upload Foto dari Device</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="sm:col-span-5 space-y-1">
              <label className="block font-bold text-[#4A3728]">Harga Dasar (Rp) *</label>
              <input
                type="number"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DCCF] text-xs font-black text-[#FF6321] focus:border-[#FF6321] bg-white"
              />
            </div>

          </div>

          {/* Dynamic Variants Section */}
          <div className="space-y-3 pt-2 border-t border-[#E6DCCF]">
            <div className="flex items-center justify-between">
              <label className="font-extrabold uppercase tracking-wider text-[#4A3728]">
                Varian Menu (Dynamic Variants)
              </label>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1 rounded-lg bg-[#FFF3E0] text-[#FF6321] hover:bg-[#FF6321] hover:text-white font-bold transition-all flex items-center gap-1 border border-[#E6DCCF] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> + Tambah Varian
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {variants.map((v, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#FFFBF5] p-2 rounded-xl border border-[#E6DCCF]">
                  <input
                    type="text"
                    value={v.name}
                    onChange={(e) => handleUpdateVariant(idx, 'name', e.target.value)}
                    placeholder="Nama Varian (misal: Original, Komplit)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#E6DCCF] bg-white font-semibold text-[#2D1B08]"
                  />
                  <div className="flex items-center gap-1 w-32">
                    <span className="font-bold text-[#8C7B6B]">Rp</span>
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-[#E6DCCF] bg-white font-black text-[#FF6321]"
                    />
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-1.5 text-[#8C7B6B] hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status & Best Seller Toggles */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E6DCCF]">
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-2xl border border-[#E6DCCF] bg-[#FFFBF5] hover:bg-[#FFF3E0]">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 text-[#FF6321] rounded border-[#E6DCCF]"
              />
              <span className="font-bold text-[#2D1B08]">Status Tersedia</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-2xl border border-[#E6DCCF] bg-[#FFF3E0] hover:bg-[#FFF3E0]/80">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 text-[#FF6321] rounded border-[#E6DCCF]"
              />
              <span className="font-black text-[#2D1B08] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#FF6321]" /> Best Seller
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-[#E6DCCF] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E6DCCF] text-[#4A3728] font-bold hover:bg-[#FFFBF5] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold shadow-md cursor-pointer"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Menu'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
