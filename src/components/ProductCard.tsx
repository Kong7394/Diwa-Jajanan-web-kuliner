import React from 'react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';
import { Flame, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
}) => {
  return (
    <div 
      onClick={() => product.isAvailable && onSelectProduct(product)}
      className={`group bg-white rounded-3xl border border-[#E6DCCF] shadow-xs hover:shadow-lg hover:border-[#FF6321]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
        product.isAvailable ? 'cursor-pointer' : 'opacity-80 cursor-not-allowed'
      }`}
    >
      
      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full bg-[#FFF3E0]/50 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap gap-1.5">
            {product.isBestSeller && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF6321] text-white text-[10px] font-black shadow-md">
                <Flame className="w-3 h-3" /> BEST SELLER
              </span>
            )}
          </div>

          {!product.isAvailable && (
            <span className="px-2.5 py-1 rounded-full bg-[#2D1B08]/90 text-white text-[10px] font-extrabold backdrop-blur-xs shadow-md">
              HABIS
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-[#2D1B08] group-hover:text-[#FF6321] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-[#8C7B6B] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#E6DCCF]">
          <div>
            <span className="text-[10px] text-[#8C7B6B] font-medium block">
              {product.variants && product.variants.length > 1 ? 'Mulai dari' : 'Harga'}
            </span>
            <span className="text-base sm:text-lg font-black text-[#2D1B08]">
              {formatRupiah(
                product.variants && product.variants.length > 0
                  ? Math.min(...product.variants.map((v) => v.price))
                  : product.basePrice
              )}
            </span>
          </div>

          <button
            onClick={() => onSelectProduct(product)}
            disabled={!product.isAvailable}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              product.isAvailable
                ? 'bg-[#FFF3E0] hover:bg-[#FF6321] text-[#2D1B08] hover:text-white active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{product.isAvailable ? 'Pilih' : 'Habis'}</span>
            {product.isAvailable && <Plus className="w-4 h-4" />}
          </button>
        </div>

      </div>

    </div>
  );
};
