import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Utensils } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onSelectProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  onSelectProduct,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-4 space-y-3 animate-pulse border border-slate-100">
            <div className="w-full aspect-4/3 bg-slate-200 rounded-2xl"></div>
            <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded-md w-full"></div>
            <div className="h-6 bg-slate-200 rounded-xl w-1/2 pt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-amber-200 p-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-orange-500 mx-auto mb-3">
          <Utensils className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Menu yang kamu cari belum tersedia
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Coba cari dengan kata kunci lain atau pilih kategori menu di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelectProduct={onSelectProduct}
        />
      ))}
    </div>
  );
};
