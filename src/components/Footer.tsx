import React from 'react';
import { StoreSettings } from '../types';
import { Utensils, MessageSquare, MapPin, Clock, Heart } from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigateSection,
  onOpenAdmin,
}) => {
  return (
    <footer id="info" className="bg-[#2D1B08] text-[#E6DCCF] pt-16 pb-12 border-t border-[#4A3728]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6321] flex items-center justify-center text-white shadow-md">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-sans">
                {settings.storeName || 'Diwa Jajanan'}<span className="text-[#FF6321]">.</span>
              </span>
            </div>

            <p className="text-sm text-[#E6DCCF]/80 max-w-sm leading-relaxed">
              "Rasakan Sensasi Rasanya Disetiap Gigitannya." Jajanan kuliner nikmat, gurih, pedas, dan manis siap melengkapi momen santai Anda.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber || '6285710237271'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Us
              </a>
              <button
                onClick={onOpenAdmin}
                className="px-4 py-2 rounded-xl bg-[#4A3728] hover:bg-[#8C7B6B]/40 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Login Admin
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FF6321]">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigateSection('menu')}
                  className="hover:text-[#FF6321] transition-colors cursor-pointer"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('menu')}
                  className="hover:text-[#FF6321] transition-colors cursor-pointer"
                >
                  Daftar Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('location')}
                  className="hover:text-[#FF6321] transition-colors cursor-pointer"
                >
                  Lokasi Toko
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="md:col-span-4 space-y-3 text-xs sm:text-sm">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FF6321]">
              Kontak & Jam Buka
            </h4>
            <div className="space-y-2.5 text-[#E6DCCF]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF6321] shrink-0 mt-0.5" />
                <span>{settings.address || 'Kp Rawa Cangkudu RT 05 RW 04 Desa Dayeuh Kec Cileungsi Kab Bogor'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF6321] shrink-0" />
                <span>Buka: {settings.openingHours || '13.00 - 21.00 WIB'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#4A3728] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C7B6B] gap-2">
          <div>
            © 2026 {settings.storeName || 'Diwa Jajanan'}. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> untuk UMKM Indonesia
          </div>
        </div>

      </div>
    </footer>
  );
};
