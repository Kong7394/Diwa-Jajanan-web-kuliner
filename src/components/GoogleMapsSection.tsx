import React from 'react';
import { StoreSettings } from '../types';
import { getEmbeddableMapsUrl } from '../utils/formatters';
import { MapPin, ExternalLink, Clock, Phone } from 'lucide-react';

interface GoogleMapsSectionProps {
  settings: StoreSettings;
}

export const GoogleMapsSection: React.FC<GoogleMapsSectionProps> = ({ settings }) => {
  const embedUrl = getEmbeddableMapsUrl(settings.googleMapsUrl);

  return (
    <section id="location" className="py-16 bg-white border-t border-[#E6DCCF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E0] text-[#2D1B08] text-xs font-bold uppercase tracking-wider border border-[#E6DCCF]">
            <MapPin className="w-3.5 h-3.5 text-[#FF6321]" /> Lokasi & Petunjuk Toko
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2D1B08] tracking-tight">
            Temukan Diwa Jajanan
          </h2>
          <p className="text-sm text-[#8C7B6B]">
            Datang langsung atau pesan online via WhatsApp, kami siap menyajikan jajanan hangat dan segar untuk Anda!
          </p>
        </div>

        {/* Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-3xl overflow-hidden bg-[#FFFBF5] border border-[#E6DCCF] p-4 sm:p-6 shadow-sm">
          
          {/* Info Side */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6321] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF6321]/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2D1B08]">Alamat Lengkap</h3>
                  <p className="text-xs sm:text-sm text-[#4A3728] mt-1 leading-relaxed">
                    {settings.address || 'Kp Rawa Cangkudu RT 05 RW 04 Desa Dayeuh Kec Cileungsi Kab Bogor'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6321] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF6321]/20">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2D1B08]">Jam Operasional</h3>
                  <p className="text-xs sm:text-sm text-[#4A3728] mt-1">
                    {settings.openingHours || '13.00 - 21.00 WIB'} (Buka Setiap Hari)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2D1B08]">WhatsApp / Telepon</h3>
                  <p className="text-xs sm:text-sm text-[#4A3728] mt-1">
                    {settings.whatsappNumber || '6285710237271'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={settings.googleMapsUrl || 'https://maps.app.goo.gl/XnAAn7hkiV9V76rWA'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-[#2D1B08] hover:bg-[#4A3728] text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <span>📍 Buka di Google Maps</span>
                <ExternalLink className="w-4 h-4 text-[#FF6321]" />
              </a>
            </div>
          </div>

          {/* Map Preview Side */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden min-h-[280px] lg:min-h-[340px] bg-[#FFFBF5] relative shadow-inner border border-[#E6DCCF]">
            <iframe
              title="Google Maps Location"
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '280px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>

      </div>
    </section>
  );
};
