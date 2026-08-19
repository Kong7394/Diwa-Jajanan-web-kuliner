import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { formatRupiah } from '../utils/formatters';
import { X, Plus, Minus, ShoppingBag, Flame, Check } from 'lucide-react';
import { useBackButtonSync } from '../hooks/useBackButtonSync';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    variant: ProductVariant | undefined,
    quantity: number,
    price: number,
    notes: string
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  useBackButtonSync(!!product, onClose);

  // Default to first variant if available
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedVariant(
        product.variants && product.variants.length > 0 ? product.variants[0] : undefined
      );
      setQuantity(1);
      setNotes('');
    }
  }, [product]);

  // Handle ESC key to close popup
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  // Calculate unit price dynamically based on selected variant or base price
  const unitPrice = React.useMemo(() => {
    if (!product) return 0;
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return product.basePrice;
  }, [selectedVariant, product]);

  if (!product) return null;

  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, quantity, unitPrice, notes);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#2D1B08]/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E6DCCF] my-8"
      >
        
        {/* Close / Exit Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-[#2D1B08]/70 hover:bg-[#FF6321] text-white backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-lg"
          aria-label="Keluar dari pop up menu"
        >
          <X className="w-4 h-4" />
          <span>Keluar</span>
        </button>

        {/* Modal Image Header */}
        <div className="relative h-64 sm:h-72 bg-[#2D1B08] overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B08]/85 via-[#2D1B08]/20 to-transparent"></div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {product.isBestSeller && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF6321] text-white text-xs font-black shadow-md">
                <Flame className="w-3.5 h-3.5" /> BEST SELLER
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black">{product.name}</h2>
              <p className="text-xs text-white/90 line-clamp-2 mt-1">{product.description}</p>
            </div>
            <div className="text-right shrink-0 bg-[#2D1B08]/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 shadow-md">
              <span className="text-[10px] text-white/80 block uppercase font-bold tracking-wider">Harga</span>
              <span className="text-lg font-black text-[#FF6321]">{formatRupiah(unitPrice)}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* Variants Selection (if product has variants) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#8C7B6B]">
                Pilih Varian
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.variants.map((variant, idx) => {
                  const isSelected = selectedVariant?.name === variant.name;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#FF6321] bg-[#FFF3E0] text-[#2D1B08] font-bold ring-2 ring-[#FF6321]/20'
                          : 'border-[#E6DCCF] bg-white hover:bg-[#FFFBF5] text-[#4A3728] font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#FF6321] bg-[#FF6321] text-white'
                              : 'border-[#E6DCCF]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-sm leading-snug">{variant.name}</span>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <span className="text-xs font-black text-[#FF6321] block">
                          {formatRupiah(variant.price)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E6DCCF]">
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-[#8C7B6B]">
                Jumlah
              </span>
              <span className="text-sm font-semibold text-[#2D1B08]">
                {quantity} Porsi
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[#FFF3E0] p-1.5 rounded-2xl border border-[#E6DCCF]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-white text-[#2D1B08] hover:bg-[#FF6321] hover:text-white font-bold flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer"
                aria-label="Kurangi jumlah"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-black text-base text-[#2D1B08]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl bg-[#FF6321] text-white font-bold flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
                aria-label="Tambah jumlah"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#8C7B6B]">
              Catatan Pesanan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pedas sedang, tanpa bawang goreng, dll."
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E6DCCF] text-sm text-[#2D1B08] focus:outline-hidden focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/20"
            />
          </div>

          {/* Footer Total & Buttons */}
          <div className="pt-4 border-t border-[#E6DCCF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#8C7B6B] font-medium block">Total Harga</span>
              <span className="text-2xl font-black text-[#FF6321]">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3.5 rounded-2xl border border-[#E6DCCF] bg-[#FFF3E0]/70 hover:bg-[#E6DCCF] text-[#2D1B08] font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4 text-[#8C7B6B]" />
                <span>Keluar</span>
              </button>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.isAvailable}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-sm shadow-md shadow-[#FF6321]/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tambah ke Keranjang</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
