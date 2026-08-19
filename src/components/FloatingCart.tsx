import React from 'react';
import { CartItem } from '../types';
import { formatRupiah } from '../utils/formatters';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface FloatingCartProps {
  cart: CartItem[];
  onOpenCart: () => void;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({ cart, onOpenCart }) => {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-30 animate-in slide-in-from-bottom-6 duration-300">
      <div
        onClick={onOpenCart}
        className="bg-[#2D1B08]/95 backdrop-blur-md text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl border border-[#FF6321]/40 flex items-center justify-between gap-3 cursor-pointer hover:border-[#FF6321] transition-all hover:scale-[1.01] active:scale-[0.99] group"
      >
        {/* Left Info: Icon & Total */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl bg-[#FF6321] flex items-center justify-center text-white shadow-md shadow-[#FF6321]/30 group-hover:scale-105 transition-transform shrink-0">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#FF6321] text-[10px] font-black px-1.5 py-0.2 rounded-full border border-[#FF6321] shadow-xs">
              {totalCount}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-[#D0C2B4]">
              {totalCount} Item di Keranjang
            </span>
            <span className="text-sm sm:text-base font-black text-white leading-tight">
              {formatRupiah(subtotal)}
            </span>
          </div>
        </div>

        {/* Right Action CTA */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCart();
          }}
          className="px-4 py-2.5 rounded-xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-[#FF6321]/20 transition-all cursor-pointer shrink-0"
        >
          <span>Keranjang</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
