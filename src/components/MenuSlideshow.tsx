import React, { useState, useEffect, useRef } from 'react';
import { Product, Category } from '../types';
import { formatRupiah } from '../utils/formatters';
import { ChevronLeft, ChevronRight, Flame, ShoppingBag, Sparkles } from 'lucide-react';

interface MenuSlideshowProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
}

export const MenuSlideshow: React.FC<MenuSlideshowProps> = ({
  products,
  categories,
  onSelectProduct,
}) => {
  // Only display available products
  const availableProducts = products.filter((p) => p.isAvailable);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = availableProducts.length;

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'Jajanan';
  };

  const handleNext = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, totalSlides]);

  if (availableProducts.length === 0) return null;

  const currentProduct = availableProducts[currentIndex];
  const minPrice =
    currentProduct.variants && currentProduct.variants.length > 0
      ? Math.min(...currentProduct.variants.map((v) => v.price))
      : currentProduct.basePrice;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FFF3E0] text-[#FF6321] flex items-center justify-center border border-[#E6DCCF]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#2D1B08]">Menu Pilihan Hari Ini</h2>
            <p className="text-xs text-[#8C7B6B]">Jelajahi kelezatan jajanan favorit di Diwa Jajanan</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C7B6B] bg-white/80 px-3 py-1.5 rounded-full border border-[#E6DCCF]">
          <span className="text-[#FF6321] font-black">{currentIndex + 1}</span> / {totalSlides} Menu
        </div>
      </div>

      {/* Main Banner Container */}
      <div
        className="relative overflow-hidden rounded-3xl bg-[#2D1B08] border border-[#4A3728] shadow-xl transition-all group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Image with Blur */}
        <div className="absolute inset-0 z-0 opacity-25 filter blur-xl scale-110">
          <img
            src={currentProduct.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-all duration-700"
          />
        </div>

        {/* Content Box */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] items-center p-6 sm:p-8 lg:p-10 gap-6">
          
          {/* Image Area */}
          <div className="md:col-span-5 flex justify-center items-center">
            <div
              onClick={() => onSelectProduct(currentProduct)}
              className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 cursor-pointer group/img transform hover:scale-102 transition-all duration-300"
            >
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              
              {currentProduct.isBestSeller && (
                <div className="absolute top-3 left-3 bg-[#FF6321] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> BEST SELLER
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/50 px-2.5 py-0.5 rounded-full border border-white/20">
                  {getCategoryName(currentProduct.categoryId)}
                </span>
              </div>
            </div>
          </div>

          {/* Text & Details Area */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-4 text-white">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#FF6321]/20 text-[#FF854D] border border-[#FF6321]/40 text-xs font-black uppercase tracking-wider">
                  {getCategoryName(currentProduct.categoryId)}
                </span>
                {currentProduct.variants && currentProduct.variants.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/20 text-xs font-semibold">
                    {currentProduct.variants.length} Varian Rasa
                  </span>
                )}
              </div>

              <h3
                onClick={() => onSelectProduct(currentProduct)}
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-white hover:text-[#FF854D] transition-colors cursor-pointer leading-tight"
              >
                {currentProduct.name}
              </h3>
            </div>

            <p className="text-sm text-amber-100/80 line-clamp-2 max-w-2xl leading-relaxed">
              {currentProduct.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
              <div>
                <span className="text-xs text-amber-200/70 block">Harga Terjangkau</span>
                <span className="text-2xl sm:text-3xl font-black text-[#FF854D]">
                  {formatRupiah(minPrice)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSelectProduct(currentProduct)}
                className="px-6 py-3.5 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] active:scale-95 text-white font-black text-sm shadow-xl shadow-[#FF6321]/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pesan Sekarang</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#FF6321] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer opacity-80 hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#FF6321] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer opacity-80 hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center items-center gap-1.5 px-4 overflow-x-auto py-1">
          {availableProducts.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 bg-[#FF6321]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
