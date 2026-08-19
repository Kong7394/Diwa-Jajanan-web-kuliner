import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tags,
  Percent,
  Landmark,
  Store,
  MessageSquare,
  MapPin,
  KeyRound,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'bank-accounts'
  | 'store-settings'
  | 'whatsapp-settings'
  | 'google-maps-settings'
  | 'pin-settings';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onGoToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  onGoToStore,
  children,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Pesanan Pelanggan', icon: ShoppingBag },
    { id: 'products', label: 'Manajemen Menu', icon: UtensilsCrossed },
    { id: 'categories', label: 'Kategori Menu', icon: Tags },
    { id: 'bank-accounts', label: 'Rekening Bank', icon: Landmark },
    { id: 'store-settings', label: 'Pengaturan Toko', icon: Store },
    { id: 'whatsapp-settings', label: 'WhatsApp Business', icon: MessageSquare },
    { id: 'google-maps-settings', label: 'Google Maps Location', icon: MapPin },
    { id: 'pin-settings', label: 'Pengaturan PIN Admin', icon: KeyRound },
  ];

  const handleNavClick = (tab: AdminTab) => {
    onSelectTab(tab);
    setMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#2D1B08] flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#2D1B08] text-[#E6DCCF] border-r border-[#4A3728] shrink-0 min-h-screen">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#4A3728] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF6321] text-white flex items-center justify-center font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-base font-black text-white">
                Admin Panel
              </span>
              <span className="block text-[10px] text-[#FF6321] font-bold uppercase tracking-wider">
                Diwa Jajanan
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as AdminTab)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-[#FF6321] text-white shadow-md shadow-[#FF6321]/20'
                    : 'text-[#E6DCCF]/80 hover:bg-[#4A3728] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#4A3728] space-y-2">
          <button
            onClick={onGoToStore}
            className="w-full px-3.5 py-2 rounded-xl bg-[#4A3728] hover:bg-[#8C7B6B]/40 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Lihat Website Toko</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FF6321]" />
          </button>

          <button
            onClick={onLogout}
            className="w-full px-3.5 py-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Admin</span>
          </button>
        </div>

      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#2D1B08] text-white px-4 py-3 border-b border-[#4A3728] flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-xl bg-[#4A3728] text-white hover:bg-[#8C7B6B]/40 cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm">Diwa Admin Portal</span>
        </div>

        <button
          onClick={onGoToStore}
          className="p-2 rounded-xl bg-[#FF6321] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>Toko</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-[#2D1B08]/80 backdrop-blur-xs">
          <div className="w-72 bg-[#2D1B08] text-[#E6DCCF] h-full p-4 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#4A3728]">
                <span className="font-black text-white text-base">Diwa Admin Panel</span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-[#E6DCCF] hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id as AdminTab)}
                      className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? 'bg-[#FF6321] text-white'
                          : 'text-[#E6DCCF]/80 hover:bg-[#4A3728] hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#4A3728] space-y-2">
              <button
                onClick={onLogout}
                className="w-full px-3.5 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
};
