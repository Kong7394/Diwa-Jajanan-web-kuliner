import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  Category,
  Promotion,
  BankAccount,
  StoreSettings,
  CartItem,
  ProductVariant,
  Order,
  OrderStatus,
  PaymentStatus,
  DashboardStats,
} from './types';
import { Header } from './components/Header';
import { MenuSlideshow } from './components/MenuSlideshow';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchBar } from './components/SearchBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { FloatingCart } from './components/FloatingCart';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import { GoogleMapsSection } from './components/GoogleMapsSection';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { useBackButtonSync } from './hooks/useBackButtonSync';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { OrderManager } from './components/admin/OrderManager';
import { ProductManager } from './components/admin/ProductManager';
import { CategoryManager } from './components/admin/CategoryManager';
import { BankAccountManager } from './components/admin/BankAccountManager';
import { StoreSettings as StoreSettingsComp } from './components/admin/StoreSettings';
import { WhatsAppSettings } from './components/admin/WhatsAppSettings';
import { GoogleMapsSettings } from './components/admin/GoogleMapsSettings';
import { AdminPinSettings } from './components/admin/AdminPinSettings';

export default function App() {
  // Navigation & View Mode
  const [mode, setMode] = useState<'CUSTOMER' | 'ADMIN'>('CUSTOMER');
  const [adminToken, setAdminToken] = useState<string | null>(
    sessionStorage.getItem('dwj_admin_token')
  );
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Back button sync for ADMIN mode
  useBackButtonSync(mode === 'ADMIN', () => setMode('CUSTOMER'));

  // Customer State
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Diwa Jajanan',
    description: 'Jajanan enak untuk menemani hari Anda.',
    whatsappNumber: '6285710237271',
    address:
      'Kp Rawa Cangkudu RT 05 RW 04 Desa Dayeuh Kec Cileungsi Kab Bogor ( samping kawasan industri menara permai Cileungsi dekat Masjid Alfattaah)',
    openingHours: '13.00 - 21.00 WIB',
    googleMapsUrl: 'https://maps.app.goo.gl/XnAAn7hkiV9V76rWA',
    shippingFee: 0,
  });

  const [isLoadingPublicData, setIsLoadingPublicData] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('cat-1');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dwj_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dwj_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type?: 'success' | 'error' } | null>(null);

  // Admin Data State
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminStats, setAdminStats] = useState<DashboardStats>({
    todayOrdersCount: 0,
    newOrdersCount: 0,
    processingOrdersCount: 0,
    completedOrdersCount: 0,
    totalRevenue: 0,
    totalProductsCount: 0,
    topProductNames: [],
    dailySales: [],
  });

  // Show Toast Helper
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. Fetch Public App Data
  const fetchPublicData = useCallback(async () => {
    try {
      const res = await fetch('/api/public/data');
      if (res.ok) {
        const data = await res.json();
        if (data.categories) setCategories(data.categories);
        if (data.products) setProducts(data.products);
        if (data.bankAccounts) setBankAccounts(data.bankAccounts);
        if (data.promotions) setPromotions(data.promotions);
        if (data.settings) setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed fetching public data:', err);
    } finally {
      setIsLoadingPublicData(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  // 2. Fetch Admin Full Data if authenticated
  const fetchAdminData = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/full-data', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminOrders(data.orders || []);
        setAdminStats(data.stats);
        if (data.products) setProducts(data.products);
        if (data.categories) setCategories(data.categories);
        if (data.bankAccounts) setBankAccounts(data.bankAccounts);
        if (data.promotions) setPromotions(data.promotions);
        if (data.settings) setSettings(data.settings);
      } else if (res.status === 401) {
        sessionStorage.removeItem('dwj_admin_token');
        setAdminToken(null);
      }
    } catch (err) {
      console.error('Failed fetching admin data:', err);
    }
  }, [adminToken]);

  useEffect(() => {
    if (mode === 'ADMIN' && adminToken) {
      fetchAdminData();
    }
  }, [mode, adminToken, fetchAdminData]);

  // Scroll to section helper
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter Products for Customer Grid
  const displayedProducts = useMemo(() => {
    return products.filter((p) => {
      // Search match
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category match
      if (selectedCategoryId === 'cat-1') return matchesSearch; // Semua
      if (selectedCategoryId === 'cat-7') {
        // Promo category filter
        const promoProdIds = new Set(promotions.map((pr) => pr.productId));
        return matchesSearch && promoProdIds.has(p.id);
      }
      return matchesSearch && p.categoryId === selectedCategoryId;
    });
  }, [products, searchQuery, selectedCategoryId, promotions]);

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    selectedVariant: ProductVariant | undefined,
    quantity: number,
    price: number,
    notes: string
  ) => {
    const cartItemId = `${product.id}-${selectedVariant ? selectedVariant.name : 'default'}`;

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        if (notes) updated[existingIdx].notes = notes;
        return updated;
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedVariant,
          quantity,
          price,
          notes,
        },
      ];
    });

    showToast(`"${product.name}" dimasukkan ke keranjang!`);
  };

  const handleUpdateCartQty = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item berhasil dihapus dari keranjang');
  };

  const handleBatchAddToCart = (itemsToAdd: CartItem[]) => {
    setCart((prev) => {
      const updated = [...prev];
      itemsToAdd.forEach((item) => {
        const existingIdx = updated.findIndex((i) => i.id === item.id);
        if (existingIdx > -1) {
          updated[existingIdx].quantity += item.quantity;
        } else {
          updated.push(item);
        }
      });
      return updated;
    });
    setIsCartOpen(true);
    showToast('Menu berhasil ditambahkan ke keranjang!');
  };

  // Create Order Handler
  const handleCreateOrder = async (orderData: any) => {
    const itemsPayload = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      variantName: item.selectedVariant?.name || '',
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      notes: item.notes || '',
    }));

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderData,
        items: itemsPayload,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal membuat pesanan');
    }

    // Save order into localStorage history
    try {
      const savedOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
      const updatedOrders = [data.order, ...savedOrders.filter((o: any) => o.orderNumber !== data.order.orderNumber)];
      localStorage.setItem('my_orders', JSON.stringify(updatedOrders.slice(0, 15)));
    } catch (e) {
      console.error('Failed saving order to localStorage:', e);
    }

    // Reset Cart & Open Confirmation Modal
    setCart([]);
    setIsCheckoutOpen(false);
    setConfirmedOrder(data.order);
    showToast('Pesanan berhasil dibuat!');
    return data.order;
  };

  // Admin Auth Handlers
  const handleAdminLogin = async (pin: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminToken(data.token);
        sessionStorage.setItem('dwj_admin_token', data.token);
        showToast('Login Admin Berhasil');
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const handleAdminLogout = async () => {
    if (adminToken) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
    }
    setAdminToken(null);
    sessionStorage.removeItem('dwj_admin_token');
    setMode('CUSTOMER');
    showToast('Admin berhasil keluar');
  };

  // Protected Admin Actions Helpers
  const adminFetchApi = async (url: string, method: string, body?: any) => {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan server');
    fetchAdminData();
    fetchPublicData();
    return data;
  };

  // Render Admin View
  if (mode === 'ADMIN') {
    if (!adminToken) {
      return (
        <AdminLogin
          onLogin={handleAdminLogin}
          onBackToStore={() => setMode('CUSTOMER')}
        />
      );
    }

    return (
      <AdminLayout
        activeTab={adminTab}
        onSelectTab={setAdminTab}
        onLogout={handleAdminLogout}
        onGoToStore={() => setMode('CUSTOMER')}
      >
        {adminTab === 'dashboard' && (
          <DashboardOverview
            stats={adminStats}
            onNavigateTab={setAdminTab}
          />
        )}

        {adminTab === 'orders' && (
          <OrderManager
            orders={adminOrders}
            settings={settings}
            onUpdateOrderStatus={async (id, orderStatus, paymentStatus) => {
              await adminFetchApi(`/api/admin/orders/${id}`, 'PUT', {
                orderStatus,
                paymentStatus,
              });
              showToast('Status pesanan diperbarui');
            }}
          />
        )}

        {adminTab === 'products' && (
          <ProductManager
            products={products}
            categories={categories}
            onSaveProduct={async (data) => {
              await adminFetchApi('/api/admin/products', 'POST', data);
              showToast('Menu baru berhasil ditambahkan');
            }}
            onUpdateProduct={async (id, data) => {
              await adminFetchApi(`/api/admin/products/${id}`, 'PUT', data);
              showToast('Menu berhasil diperbarui');
            }}
            onDeleteProduct={async (id) => {
              await adminFetchApi(`/api/admin/products/${id}`, 'DELETE');
              showToast('Menu dihapus');
            }}
          />
        )}

        {adminTab === 'categories' && (
          <CategoryManager
            categories={categories}
            onAddCategory={async (name) => {
              await adminFetchApi('/api/admin/categories', 'POST', { name });
              showToast('Kategori baru ditambahkan');
            }}
            onUpdateCategory={async (id, name, isActive) => {
              await adminFetchApi(`/api/admin/categories/${id}`, 'PUT', { name, isActive });
              showToast('Kategori diperbarui');
            }}
            onDeleteCategory={async (id) => {
              await adminFetchApi(`/api/admin/categories/${id}`, 'DELETE');
              showToast('Kategori dihapus');
            }}
          />
        )}

        {adminTab === 'bank-accounts' && (
          <BankAccountManager
            bankAccounts={bankAccounts}
            onAddBankAccount={async (data) => {
              await adminFetchApi('/api/admin/bank-accounts', 'POST', data);
              showToast('Rekening bank ditambahkan');
            }}
            onUpdateBankAccount={async (id, data) => {
              await adminFetchApi(`/api/admin/bank-accounts/${id}`, 'PUT', data);
              showToast('Rekening bank diperbarui');
            }}
            onDeleteBankAccount={async (id) => {
              await adminFetchApi(`/api/admin/bank-accounts/${id}`, 'DELETE');
              showToast('Rekening bank dihapus');
            }}
          />
        )}

        {adminTab === 'store-settings' && (
          <StoreSettingsComp
            settings={settings}
            onSaveSettings={async (data) => {
              await adminFetchApi('/api/admin/settings', 'PUT', data);
              showToast('Pengaturan toko disimpan');
            }}
          />
        )}

        {adminTab === 'whatsapp-settings' && (
          <WhatsAppSettings
            settings={settings}
            onSaveSettings={async (data) => {
              await adminFetchApi('/api/admin/settings', 'PUT', data);
              showToast('Nomor WhatsApp disimpan');
            }}
          />
        )}

        {adminTab === 'google-maps-settings' && (
          <GoogleMapsSettings
            settings={settings}
            onSaveSettings={async (data) => {
              await adminFetchApi('/api/admin/settings', 'PUT', data);
              showToast('URL Google Maps disimpan');
            }}
          />
        )}

        {adminTab === 'pin-settings' && (
          <AdminPinSettings
            onChangePin={async (newPin) => {
              try {
                await adminFetchApi('/api/admin/pin', 'PUT', { newPin });
                showToast('PIN Admin berhasil diubah');
                return { success: true };
              } catch (err: any) {
                return { success: false, error: err.message };
              }
            }}
          />
        )}

        {toastMsg && (
          <Toast
            message={toastMsg.text}
            type={toastMsg.type}
            onClose={() => setToastMsg(null)}
          />
        )}
      </AdminLayout>
    );
  }

  // Render Customer Store View
  return (
    <div className="min-h-screen bg-[#FFFBF5] font-sans text-[#4A3728] antialiased selection:bg-[#FF6321] selection:text-white">
      
      {/* Customer Header */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => setMode('ADMIN')}
        onOpenOrderStatus={() => setIsOrderStatusOpen(true)}
      />

      {/* Main Content */}
      <main>
        {/* Banner Slideshow Menu */}
        <MenuSlideshow
          products={products}
          categories={categories}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        {/* Menu Listing Section */}
        <section id="menu" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-[#2D1B08] tracking-tight">
              Pilihan Menu Favorit
            </h2>
            <p className="text-sm text-[#8C7B6B]">
              Pilih jajanan gurih, pedas, atau minuman segar pelepas dahaga dari racikan khas Diwa Jajanan.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={displayedProducts}
            isLoading={isLoadingPublicData}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />

        </section>

        {/* Location & Google Maps */}
        <GoogleMapsSection settings={settings} />

      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => setMode('ADMIN')}
      />

      {/* Floating Cart Button */}
      {mode === 'CUSTOMER' && !isCartOpen && !isCheckoutOpen && !confirmedOrder && (
        <FloatingCart
          cart={cart}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Customer Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
        onSeeMenu={() => handleNavigateSection('menu')}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        cart={cart}
        bankAccounts={bankAccounts}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmitOrder={handleCreateOrder}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        settings={settings}
        onClose={() => setConfirmedOrder(null)}
        onOpenOrderStatus={() => setIsOrderStatusOpen(true)}
      />

      <OrderStatusModal
        isOpen={isOrderStatusOpen}
        onClose={() => setIsOrderStatusOpen(false)}
        products={products}
        settings={settings}
        onAddToCart={handleBatchAddToCart}
        onOpenMenu={() => handleNavigateSection('menu')}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <Toast
          message={toastMsg.text}
          type={toastMsg.type}
          onClose={() => setToastMsg(null)}
        />
      )}

    </div>
  );
}
