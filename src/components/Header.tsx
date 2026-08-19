import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Shield, MapPin, Utensils, Home, Info, Search, PackageCheck } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenOrderStatus?: () => void;
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onNavigateSection,
  onOpenAdmin,
  onOpenOrderStatus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFBF5]/95 backdrop-blur-md border-b border-[#E6DCCF] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Brand Name */}
          <button
            id="header-brand-logo"
            onClick={() => handleNavClick('menu')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FF6321] flex items-center justify-center text-white shadow-md shadow-[#FF6321]/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black tracking-tight text-[#2D1B08] font-sans">
                Diwa Jajanan<span className="text-[#FF6321]">.</span>
              </span>
              <span className="block text-[10px] sm:text-xs font-medium text-[#8C7B6B] -mt-1 tracking-wider uppercase">
                Kuliner & Jajanan
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-home"
              onClick={() => handleNavClick('menu')}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#4A3728] hover:text-[#FF6321] hover:bg-[#FFF3E0] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-4 h-4" /> Home
            </button>
            <button
              id="nav-menu"
              onClick={() => handleNavClick('menu')}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#4A3728] hover:text-[#FF6321] hover:bg-[#FFF3E0] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Utensils className="w-4 h-4" /> Menu
            </button>
            <button
              id="nav-location"
              onClick={() => handleNavClick('location')}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#4A3728] hover:text-[#FF6321] hover:bg-[#FFF3E0] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4" /> Lokasi
            </button>
            <button
              id="nav-about"
              onClick={() => handleNavClick('info')}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#4A3728] hover:text-[#FF6321] hover:bg-[#FFF3E0] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Info className="w-4 h-4" /> Tentang Kami
            </button>
            {onOpenOrderStatus && (
              <button
                id="nav-order-status"
                onClick={onOpenOrderStatus}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-[#FF6321] bg-[#FFF3E0] hover:bg-[#FFE0B2] transition-colors flex items-center gap-1.5 cursor-pointer border border-[#FF6321]/30"
              >
                <PackageCheck className="w-4 h-4" /> Cek Status Pesanan
              </button>
            )}
          </nav>

          {/* Actions: Admin & Cart button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Cart Button */}
            <button
              id="open-cart-button"
              onClick={onOpenCart}
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-[#FF6321] hover:bg-[#E55315] text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-[#FF6321]/25 active:scale-95 transition-all cursor-pointer"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">Keranjang</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-black bg-white text-[#FF6321] shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            <button
              id="open-admin-portal"
              onClick={onOpenAdmin}
              className="p-2.5 rounded-2xl border border-[#E6DCCF] text-[#8C7B6B] hover:text-[#FF6321] hover:bg-[#FFF3E0] transition-colors cursor-pointer"
              title="Portal Admin"
            >
              <Shield className="w-5 h-5" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl text-[#4A3728] hover:bg-[#FFF3E0] md:hidden transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6DCCF] bg-[#FFFBF5]/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          <button
            onClick={() => handleNavClick('menu')}
            className="w-full px-4 py-3 rounded-xl text-left text-base font-semibold text-[#2D1B08] hover:bg-[#FFF3E0] hover:text-[#FF6321] flex items-center gap-3"
          >
            <Home className="w-5 h-5 text-[#FF6321]" /> Home
          </button>
          <button
            onClick={() => handleNavClick('menu')}
            className="w-full px-4 py-3 rounded-xl text-left text-base font-semibold text-[#2D1B08] hover:bg-[#FFF3E0] hover:text-[#FF6321] flex items-center gap-3"
          >
            <Utensils className="w-5 h-5 text-[#FF6321]" /> Daftar Menu
          </button>
          <button
            onClick={() => handleNavClick('location')}
            className="w-full px-4 py-3 rounded-xl text-left text-base font-semibold text-[#2D1B08] hover:bg-[#FFF3E0] hover:text-[#FF6321] flex items-center gap-3"
          >
            <MapPin className="w-5 h-5 text-[#FF6321]" /> Lokasi & Petunjuk
          </button>
          <button
            onClick={() => handleNavClick('info')}
            className="w-full px-4 py-3 rounded-xl text-left text-base font-semibold text-[#2D1B08] hover:bg-[#FFF3E0] hover:text-[#FF6321] flex items-center gap-3"
          >
            <Info className="w-5 h-5 text-[#FF6321]" /> Informasi Toko
          </button>
          {onOpenOrderStatus && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderStatus();
              }}
              className="w-full px-4 py-3 rounded-xl text-left text-base font-bold bg-[#FFF3E0] text-[#FF6321] border border-[#FF6321]/30 flex items-center gap-3"
            >
              <PackageCheck className="w-5 h-5 text-[#FF6321]" /> Cek Status / Batalkan Pesanan
            </button>
          )}
          <div className="pt-2 border-t border-[#E6DCCF]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full px-4 py-3 rounded-xl text-left text-sm font-semibold text-[#8C7B6B] hover:bg-[#FFF3E0] flex items-center gap-3"
            >
              <Shield className="w-5 h-5 text-[#8C7B6B]" /> Mode Admin Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
