import React from 'react';
import { CartItem } from '../types';
import { formatRupiah } from '../utils/formatters';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useBackButtonSync } from '../hooks/useBackButtonSync';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  shippingFee?: number;
  onClose: () => void;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedCheckout: () => void;
  onSeeMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  onSeeMenu,
}) => {
  useBackButtonSync(isOpen, onClose);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#2D1B08]/50 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Backdrop overlay click */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6DCCF] flex items-center justify-between bg-[#FFF3E0]/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF6321]" />
            <h2 className="text-lg font-black text-[#2D1B08]">Keranjang Belanja</h2>
            <span className="text-xs font-bold text-[#FF6321] bg-[#FFF3E0] border border-[#E6DCCF] px-2 py-0.5 rounded-full">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} item
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8C7B6B] hover:text-[#2D1B08] hover:bg-[#FFF3E0] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-[#E6DCCF]">
          {cart.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#FF6321] mx-auto border border-[#E6DCCF]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#2D1B08]">
                  Keranjang Anda masih kosong.
                </h3>
                <p className="text-xs text-[#8C7B6B]">
                  Pilih jajanan favoritmu dan masukkan ke dalam keranjang.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onSeeMenu();
                }}
                className="mt-2 px-5 py-2.5 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-xs shadow-md shadow-[#FF6321]/20 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Lihat Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-3">
                
                {/* Item Thumbnail */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-[#FFF3E0] shrink-0 border border-[#E6DCCF]"
                />

                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h4 className="text-sm font-bold text-[#2D1B08] leading-snug">
                        {item.product.name}
                      </h4>
                      {item.selectedVariant && (
                        <span className="text-[11px] font-semibold text-[#FF6321] bg-[#FFF3E0] border border-[#E6DCCF] px-2 py-0.5 rounded-md inline-block mt-0.5">
                          Varian: {item.selectedVariant.name}
                        </span>
                      )}
                      {item.notes && (
                        <p className="text-[11px] text-[#8C7B6B] italic mt-0.5">
                          "{item.notes}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#8C7B6B] hover:text-red-600 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Hapus dari keranjang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-black text-[#2D1B08]">
                      {formatRupiah(item.price * item.quantity)}
                    </span>

                    <div className="flex items-center gap-2 bg-[#FFF3E0] px-2 py-1 rounded-xl border border-[#E6DCCF]">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white text-[#2D1B08] font-bold flex items-center justify-center hover:bg-[#FF6321] hover:text-white active:scale-90 transition-all text-xs cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-[#2D1B08]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-[#FF6321] text-white font-bold flex items-center justify-center hover:bg-[#E55315] active:scale-90 transition-all text-xs cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#FFFBF5] border-t border-[#E6DCCF] space-y-4">
            <div className="space-y-1.5 text-xs text-[#4A3728]">
              <div className="flex justify-between text-sm font-black text-[#2D1B08]">
                <span>Total Biaya</span>
                <span className="text-base text-[#FF6321]">{formatRupiah(total)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedCheckout();
              }}
              className="w-full py-4 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-sm shadow-md shadow-[#FF6321]/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjut Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
