import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure data folder exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default Seed Data
const initialCategories = [
  { id: 'cat-1', name: 'Semua', isActive: true },
  { id: 'cat-2', name: 'Jajanan', isActive: true },
  { id: 'cat-3', name: 'Gorengan', isActive: true },
  { id: 'cat-4', name: 'Makanan', isActive: true },
  { id: 'cat-5', name: 'Minuman', isActive: true },
  { id: 'cat-6', name: 'Paket', isActive: true },
  
];

const initialProducts = [
  {
    id: 'prod-1',
    name: 'Dimsum Goreng Keju Lumer',
    description: 'Dimsum goreng renyah dengan isian daging gurih dan lelehan keju lumer melimpah.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-09-1d36c165-0b58-4002-8b55-5cd257f3947d.jpg',
    categoryId: 'cat-2',
    basePrice: 15000,
    variants: [
      { id: 'v1', name: 'Dimsum Gokel (3 pcs)', price: 15000 },
      { id: 'v2', name: 'Dimsum Gokel (4 pcs)', price: 20000 },
      { id: 'v3', name: 'Dimsum Gokel (5 pcs)', price: 25000 },
      { id: 'v4', name: 'Dimsum Jando (3 pcs)', price: 15000 },
      { id: 'v5', name: 'Dimsum Jando (4 pcs)', price: 20000 },
    ],
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: 'prod-2',
    name: 'Mie Ayam',
    description: 'Mie ayam kenyal khas Diwa Jajanan dengan racikan bumbu spesial dan topping ayam manis gurih.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-09-29bf1a78-5c94-4c75-a34c-9f1d779f2ca0.jpg',
    categoryId: 'cat-4',
    basePrice: 11000,
    variants: [
      { id: 'v1', name: 'Original', price: 11000 },
      { id: 'v2', name: 'Komplit', price: 16000 },
      { id: 'v3', name: 'Ceker', price: 13000 },
      { id: 'v4', name: 'Bakso', price: 13000 },
      { id: 'v5', name: 'Pangsit Basah', price: 13000},
      { id: 'v6', name: 'Pangsit Kering', price: 13000},
    ],
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: 'prod-3',
    name: 'Basreng',
    description: 'Bakso goreng irisan tipis renyah bertabur bumbu cabai asli dan wangi daun jeruk pedas nampol.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-09-0e7aeee5-0010-4599-87a1-81945981ee55.jpg',
    categoryId: 'cat-2',
    basePrice: 10000,
    variants: [
      { id: 'v1', name: 'Original', price: 10000 },
      { id: 'v2', name: 'Chili oil', price: 10000 },
      { id: 'v3', name: 'Mix Tempura', price: 10000},
    ],
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: 'prod-4',
    name: 'Mie Jebew',
    description: 'Mie pedas ala Diwa Jajanan dengan kuah/bumbu minyak cabai rahasia, bikin nagih di setiap gigitan.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-10-17f67c21-bcf8-4e34-989f-9ecb94676c46.jpg',
    categoryId: 'cat-4',
    basePrice: 11000,
    variants: [
      { id: 'v1', name: 'Original', price: 11000 },
      { id: 'v2', name: 'Pangsit Basah', price: 12000 },
      { id: 'v3', name: 'Pangsit Kering', price: 12000 },
      { id: 'v4', name: 'Beaf', price: 12000 },
      { id: 'v5', name: 'Sosis', price: 12000 },
      { id: 'v6', name: 'Telor Ceplok', price: 13000 },
      { id: 'v7', name: 'Komplit', price: 15000 },
    ],
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: 'prod-5',
    name: 'Pangsit',
    description: 'Pangsit olahan daging ayam empuk disajikan goreng renyah atau kuah hangat gurih.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-10-4c0fe0d1-f2f2-4eb2-8989-f2d54ec95090.jpg',
    categoryId: 'cat-3',
    basePrice: 10000,
    variants: [
      { id: 'v1', name: 'Chili Oil', price: 10000 },
      { id: 'v2', name: 'Kuah Chili Oil', price: 12000 },
      { id: 'v3', name: 'Isi Keju Chili Oil', price: 12000 },
      { id: 'v4', name: 'Goreng', price: 10000 },
    ],
    isAvailable: true,
    isBestSeller: false,
  },
  {
    id: 'prod-6',
    name: 'Pisang',
    description: 'Pisang manis legit dibakar bertabur keju parut melimpah dan susu kental manis cokelat.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-10-ee14c690-790a-4098-8ae1-5e957a35b4ab.jpg',
    categoryId: 'cat-3',
    basePrice: 10000,
    variants: [
      { id: 'v1', name: 'Bakar Keju', price: 10000 },
      { id: 'v2', name: 'Bakar Cokelat', price: 10000 },
      { id: 'v3', name: 'Bakar Cokelat & Keju', price: 12000 },
      { id: 'v4', name: 'Pisang Cokelat Lumer', price: 10000 },
    ],
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: 'prod-7',
    name: 'Ceker Mercon',
    description: 'Ceker ayam empuk tanpa tulang disiram bumbu rica mercon pedas manis mantap.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-10-8185c813-3205-48e0-a137-a95ec2fd4410.jpg',
    categoryId: 'cat-2',
    basePrice: 12000,
    variants: [
      { id: 'v1', name: 'Ceker Tanpa Tulang', price: 12000 },
      { id: 'v2', name: 'Ceker Bertulang', price: 12000 },
      { id: 'v3', name: 'Ceker Tanpa Tulang X Bakso', price: 15000 },
      { id: 'v4', name: 'Bakso Mercon', price: 10000 },
      { id: 'v5', name: 'Tulang Mercon', price: 10000}
    ],
    isAvailable: true,
    isBestSeller: false,
  },
  {
    id: 'prod-8',
    name: 'Bakso Aci',
    description: 'Bakso aci kenyal isi daging dengan cuanki lidah, pilus cikur, dan kuah rempah pedas mantap.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-10-699edb40-2538-4e89-a92c-bc483f2b8885.jpg',
    categoryId: 'cat-4',
    basePrice: 10000,
    variants: [
      { id: 'v1', name: 'Original', price: 10000 },
      { id: 'v2', name: 'Ceker', price: 12000 },
      { id: 'v3', name: 'Tulang', price: 12000 },
      { id: 'v4', name: 'Isi Keju', price: 12000 },
      { id: 'v5', name: 'Komplit', price: 15000 },
    ],
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: 'prod-9',
    name: 'Roti Bakar',
    description: 'Roti bakar empuk dipanggang mentega dengan aneka isian topping melimpah.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-10-6f733fa7-153f-488d-8912-cd2e431c7d8a.jpg',
    categoryId: 'cat-2',
    basePrice: 10000,
    variants: [
      { id: 'v1', name: 'Cokelat & Keju', price: 12000 },
      { id: 'v2', name: 'Cokelat', price: 10000 },
      { id: 'v3', name: 'Keju', price: 10000 },
    ],
    isAvailable: true,
    isBestSeller: false,
  },
  {
    id: 'prod-10',
    name: 'Martabak Telor',
    description: 'Martabak telor olahan daging cincang dan daun bawang segar disajikan dengan kuah cuka gurih.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-10-73acf6af-f0ce-4210-a41e-434c0204d20a.jpg',
    categoryId: 'cat-3',
    basePrice: 7000,
    variants: [
      { id: 'v1', name: 'Mini', price: 7000 },
      { id: 'v2', name: 'Jumbo', price: 12000 },
      { id: 'v3', name: 'Mix Tempura', price: 15000 },
    ],
    isAvailable: true,
    isBestSeller: false,
  },
  {
    id: 'prod-11',
    name: 'Aneka Jus Buah Segar',
    description: 'Jus buah asli kaya vitamin diblend dingin dengan gula murni tanpa pemanis buatan.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-10-0b8ad90d-905e-4512-9080-adec0931a5ef.jpg',
    categoryId: 'cat-5',
    basePrice: 10000,
    variants: [
      { id: 'v1', name: 'Jus Mangga', price: 10000 },
      { id: 'v2', name: 'Jus Alpukat', price: 12000 },
      { id: 'v3', name: 'Jus Jambu Biji', price: 10000 },
      { id: 'v4', name: 'Jus Buah Naga', price: 10000 },
      { id: 'v5', name: 'Jus Nanas', price: 10000 },
    ],
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: 'prod-12',
    name: 'Es Teh Manis Segar',
    description: 'Es teh manis segar pelepas dahaga dari racikan daun teh melati harum.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-10-70f4225b-1c7a-4f6c-a653-af707ef5b1e7.jpg',
    categoryId: 'cat-5',
    basePrice: 5000,
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: 'prod-13',
    name: 'Es Jeruk Peras Asli',
    description: 'Jeruk peras manis alami penuh sensasi segar vitamin C disajikan dingin.',
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    categoryId: 'cat-5',
    basePrice: 5000,
    isAvailable: true,
    isBestSeller: false,
  },
  {
    id: 'prod-14',
    name: 'Tea Jus Dingin',
    description: 'Minuman Tea Jus manis dingin instan yang pas menemani santap jajanan pedas.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-10-1552694c-6961-4a1d-9d94-21e9c0ea049e.jpg',
    categoryId: 'cat-5',
    basePrice: 3000,
    variants: [
      { id: 'v1', name: 'Rasa Gula Batu', price: 3000 },
      { id: 'v2', name: 'Rasa Melati', price: 3000 },
      { id: 'v3', name: 'Rasa Lemon', price: 3000 },
    ],
    isAvailable: true,
    isBestSeller: false,
  },
  {
    id: 'prod-15',
    name: 'Nutrisari Es Segar',
    description: 'Minuman es Nutrisari dengan aneka pilihan rasa buah kaya akan nutrisi dan vitamin.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-11-3fceef30-14e3-45a8-a25e-bfa56b00c9a8.jpg',
    categoryId: 'cat-5',
    basePrice: 4000,
    variants: [
      { id: 'v1', name: 'Jeruk Peras', price: 4000 },
      { id: 'v2', name: 'Mangga Gandaria', price: 4000 },
      { id: 'v3', name: 'Sweet Guava', price: 4000 },
    ],
    isAvailable: true,
    isBestSeller: false,
  },
  {
    id: 'prod-16',
    name: 'Es Good Day',
    description: 'Kopi instan Good Day dingin nikmat bertabur es serut dan foam creamy.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-11-d01e9d46-9510-49c9-a9aa-69f99e2311ab.jpg',
    categoryId: 'cat-5',
    basePrice: 5000,
    variants: [
    ],
    isAvailable: true,
    isBestSeller: false,
  },
  {
    id: 'prod-17',
    name: 'Es White Kopi',
    description: 'Kopi putih ramah lambung disajikan dingin mantap untuk melegakan dahaga.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-11-6725252f-9889-4f40-b77e-b192f21a0425.jpg',
    categoryId: 'cat-5',
    basePrice: 5000,
    variants: [{ id: 'v1', name: 'Luwak White Koffie', price: 5000 }],
    isAvailable: true,
    isBestSeller: false,
  },
  {
    id: 'prod-18',
    name: 'Es Susu Kental Manis',
    description: 'Susu kental manis gurih legit disajikan dingin segar.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-11-808e2393-2fdd-467d-a25f-5482abfe48d3.jpg',
    categoryId: 'cat-5',
    basePrice: 5000,
    variants: [
      { id: 'v1', name: 'Susu Putih', price: 5000 },
      { id: 'v2', name: 'Susu Cokelat', price: 5000 },
    ],
    isAvailable: true,
    isBestSeller: false,
  },
  {
    id: 'prod-19',
    name: 'Kopi Kapal Api',
    description: 'Kopi hitam mantap kental aromatik khas Kapal Api.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-11-05f666c2-2933-4a09-8a90-b3969c892c96.jpg',
    categoryId: 'cat-5',
    basePrice: 5000,
    variants: [
    ],
    isAvailable: true,
    isBestSeller: false,
  },
  {
    id: 'prod-20',
    name: 'Es Susu Milo',
    description: 'Susu cokelat Milo manis legit favorit anak dan dewasa disajikan dingin.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-11-d6c65ab1-f197-447d-9178-e97d1ee36e21.jpg',
    categoryId: 'cat-5',
    basePrice: 5000,
    variants: [
    ],
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: 'prod-21',
    name: 'Good Day Friez Blend',
    description: 'Kopi Good Day Friez dingin rasa mint segar dan manis creamy.',
    imageUrl: 'https://cdn.phototourl.com/free/2026-08-11-1913f584-218d-4e93-ac9a-401206e984d6.jpg',
    categoryId: 'cat-5',
    basePrice: 6000,
    variants: [{ id: 'v1', name: 'Good Day Friez Ice', price: 6000 }],
    isAvailable: true,
    isBestSeller: false,
  },
];

const initialBankAccounts = [
  {
    id: 'bank-1',
    bankName: 'BCA Syariah',
    accountNumber: '0440014421',
    accountHolder: 'Puput Fauziah',
    isActive: true,
  },
];

const initialPromotions = [
  {
    id: 'promo-1',
    title: 'PROMO SPESIAL MIE AYAM',
    productId: 'prod-2',
    normalPrice: 20000,
    promoPrice: 16000,
    isActive: true,
  },
  {
    id: 'promo-2',
    title: 'PROMO DIMSUM KEJU LUMER',
    productId: 'prod-1',
    normalPrice: 25000,
    promoPrice: 20000,
    isActive: true,
  },
];

const initialSettings = {
  storeName: 'Diwa Jajanan',
  description: 'Jajanan enak untuk menemani hari Anda.',
  whatsappNumber: '6282117579041',
  address:
    'Kp Rawa Cangkudu RT 05 RW 04 Desa Dayeuh Kec Cileungsi Kab Bogor ( samping kawasan industri menara permai Cileungsi dekat Masjid Alfattaah)',
  openingHours: '13.00 - 21.00 WIB',
  googleMapsUrl: 'https://maps.app.goo.gl/XnAAn7hkiV9V76rWA',
  shippingFee: 0,
};

// Initial admin pin hash using simple crypto (default PIN: 1234)
const defaultPinHash = crypto.createHash('sha256').update('1234').digest('hex');

function getDB() {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      categories: initialCategories,
      products: initialProducts,
      bankAccounts: initialBankAccounts,
      promotions: initialPromotions,
      settings: initialSettings,
      orders: [],
      adminPinHash: defaultPinHash,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading DB file, recreating default:', err);
    const defaultData = {
      categories: initialCategories,
      products: initialProducts,
      bankAccounts: initialBankAccounts,
      promotions: initialPromotions,
      settings: initialSettings,
      orders: [],
      adminPinHash: defaultPinHash,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

function saveDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Memory session tokens for authenticated admin sessions
const validAdminTokens = new Set<string>();
const pinFailedAttempts: Record<string, { count: number; lockedUntil: number }> = {};

// Helper middleware to check admin authorization
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && validAdminTokens.has(token)) {
    return next();
  }
  return res.status(401).json({ error: 'Akses ditolak. Silakan login admin kembali.' });
}

// ----------------------------------------------------
// PUBLIC API ENDPOINTS
// ----------------------------------------------------

// Download db.json file directly (synced with current db)
app.get(['/api/download/db.json', '/api/db.json', '/db.json'], (req, res) => {
  try {
    const db = getDB();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="db.json"');
    res.send(JSON.stringify(db, null, 2));
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal mendownload db.json' });
  }
});

// Sync / reset db.json file directly from initial server.ts data
app.get(['/api/sync-db-from-server', '/api/reset-db'], (req, res) => {
  try {
    const freshDb = {
      categories: initialCategories,
      products: initialProducts,
      bankAccounts: initialBankAccounts,
      promotions: initialPromotions,
      settings: initialSettings,
      orders: [],
      adminPinHash: defaultPinHash,
    };
    saveDB(freshDb);
    res.json({ success: true, message: 'db.json berhasil diperbarui/disinkronkan dari server.ts', db: freshDb });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal menyinkronkan db.json dari server.ts' });
  }
});

// Download bun.lock file directly
app.get(['/api/download/bun.lock', '/api/bun.lock', '/bun.lock'], (req, res) => {
  try {
    const bunLockPath = path.join(process.cwd(), 'bun.lock');
    if (fs.existsSync(bunLockPath)) {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="bun.lock"');
      res.sendFile(bunLockPath);
    } else {
      res.status(404).json({ error: 'File bun.lock tidak ditemukan' });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal mendownload bun.lock' });
  }
});

// Download server.ts file directly
app.get(['/api/download/server.ts', '/api/server.ts', '/server.ts'], (req, res) => {
  try {
    const serverTsPath = path.join(process.cwd(), 'server.ts');
    if (fs.existsSync(serverTsPath)) {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="server.ts"');
      res.sendFile(serverTsPath);
    } else {
      res.status(404).json({ error: 'File server.ts tidak ditemukan' });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal mendownload server.ts' });
  }
});

// Get public initial app data
app.get('/api/public/data', (req, res) => {
  const db = getDB();
  res.json({
    categories: db.categories.filter((c: any) => c.isActive !== false),
    products: db.products,
    bankAccounts: db.bankAccounts.filter((b: any) => b.isActive !== false),
    promotions: db.promotions.filter((p: any) => p.isActive !== false),
    settings: db.settings,
  });
});

// Create customer order
app.post('/api/orders', (req, res) => {
  try {
    const db = getDB();
    const { customerName, phone, address, items, subtotal, shippingCost, total, paymentMethod, notes, proofOfPaymentUrl } = req.body;

    if (!customerName || !phone || !address || !items || !items.length) {
      return res.status(400).json({ error: 'Mohon lengkapi nama, WhatsApp, alamat, dan item pesanan.' });
    }

    // Generate Order Number: DWJ-YYYYMMDD-XXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const todayOrders = db.orders.filter((o: any) => o.createdAt && o.createdAt.startsWith(now.toISOString().slice(0, 10)));
    const seq = (todayOrders.length + 1).toString().padStart(3, '0');
    const orderNumber = `DWJ-${dateStr}-${seq}`;

    const newOrder = {
      id: 'ord-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      orderNumber,
      customerName,
      phone,
      address,
      items,
      subtotal: subtotal || 0,
      shippingCost: shippingCost || 0,
      total: total || subtotal || 0,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'TRANSFER' && proofOfPaymentUrl ? 'MENUNGGU_VERIFIKASI' : 'BELUM_DIBAYAR',
      proofOfPaymentUrl: proofOfPaymentUrl || '',
      orderStatus: 'MENUNGGU_KONFIRMASI',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);
    saveDB(db);

    res.json({ success: true, order: newOrder });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal membuat pesanan: ' + err.message });
  }
});

// Lookup order by orderNumber or phone
app.get('/api/orders/lookup', (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || !q.trim()) {
      return res.status(400).json({ error: 'Masukkan kode pesanan atau nomor WhatsApp.' });
    }
    const queryStr = q.trim().toLowerCase();
    const db = getDB();
    const matches = db.orders.filter((o: any) => {
      const matchNumber = o.orderNumber && o.orderNumber.toLowerCase().includes(queryStr);
      const matchPhone = o.phone && o.phone.replace(/[^0-9]/g, '').includes(queryStr.replace(/[^0-9]/g, ''));
      return matchNumber || (queryStr.length >= 3 && matchPhone);
    });

    res.json({ success: true, orders: matches });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal mencari pesanan: ' + err.message });
  }
});

// Cancel customer order
app.post('/api/orders/:orderNumber/cancel', (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { reason } = req.body;
    const db = getDB();

    const orderIndex = db.orders.findIndex(
      (o: any) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase()
    );

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    const order = db.orders[orderIndex];

    if (order.orderStatus === 'DIBATALKAN') {
      return res.status(400).json({ error: 'Pesanan ini sudah dibatalkan sebelumnya.' });
    }

    if (['DIKIRIM', 'SELESAI'].includes(order.orderStatus)) {
      return res.status(400).json({
        error: 'Pesanan yang sedang dikirim atau telah selesai tidak dapat dibatalkan.',
      });
    }

    order.orderStatus = 'DIBATALKAN';
    if (reason) {
      order.notes = (order.notes ? order.notes + '\n' : '') + `[Alasan Pembatalan Pelanggan: ${reason}]`;
    }
    order.updatedAt = new Date().toISOString();

    db.orders[orderIndex] = order;
    saveDB(db);

    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal membatalkan pesanan: ' + err.message });
  }
});

// Add items to existing active order
app.post('/api/orders/:orderNumber/add-items', (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { newItems } = req.body;
    const db = getDB();

    const orderIndex = db.orders.findIndex(
      (o: any) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase()
    );

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    const order = db.orders[orderIndex];

    if (['DIBATALKAN', 'SELESAI', 'DIKIRIM'].includes(order.orderStatus)) {
      return res.status(400).json({
        error: 'Tidak dapat menambah item karena pesanan sudah dibatalkan, dikirim, atau selesai.',
      });
    }

    if (!newItems || !Array.isArray(newItems) || newItems.length === 0) {
      return res.status(400).json({ error: 'Item baru tidak valid' });
    }

    newItems.forEach((newItem: any) => {
      const existingItemIndex = order.items.findIndex(
        (i: any) =>
          i.productName === newItem.productName &&
          (i.variantName || '') === (newItem.variantName || '')
      );
      if (existingItemIndex > -1) {
        order.items[existingItemIndex].quantity += newItem.quantity;
        order.items[existingItemIndex].subtotal += newItem.subtotal;
      } else {
        order.items.push(newItem);
      }
    });

    order.subtotal = order.items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    order.total = order.subtotal + (order.shippingCost || 0);
    order.updatedAt = new Date().toISOString();

    db.orders[orderIndex] = order;
    saveDB(db);

    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal menambah item ke pesanan: ' + err.message });
  }
});

// Handle file/image upload (base64 payload or standard binary)
app.post('/api/upload', (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'File gambar tidak ditemukan' });
    }
    // Return base64 URL directly or store safely
    res.json({ success: true, url: imageBase64 });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal mengunggah gambar' });
  }
});

// Admin Login via PIN
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  const ip = req.ip || 'client';
  const now = Date.now();

  const attempts = pinFailedAttempts[ip] || { count: 0, lockedUntil: 0 };
  if (attempts.lockedUntil > now) {
    const remainingSecs = Math.ceil((attempts.lockedUntil - now) / 1000);
    return res.status(429).json({
      error: `Terlalu banyak percobaan PIN. Silakan tunggu ${remainingSecs} detik lagi.`,
    });
  }

  const db = getDB();
  const inputHash = crypto.createHash('sha256').update(String(pin || '')).digest('hex');

  if (inputHash === db.adminPinHash) {
    // Reset failed attempts
    pinFailedAttempts[ip] = { count: 0, lockedUntil: 0 };
    const token = crypto.randomBytes(24).toString('hex');
    validAdminTokens.add(token);
    return res.json({ success: true, token });
  } else {
    attempts.count += 1;
    if (attempts.count >= 5) {
      attempts.lockedUntil = now + 60000; // 60s cooldown
      pinFailedAttempts[ip] = attempts;
      return res.status(429).json({
        error: 'PIN salah 5 kali. Login dikunci selama 60 detik demi keamanan.',
      });
    }
    pinFailedAttempts[ip] = attempts;
    return res.status(401).json({
      error: `PIN Salah! Sisa percobaan: ${5 - attempts.count}`,
    });
  }
});

// Admin Logout
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) validAdminTokens.delete(token);
  res.json({ success: true });
});

// ----------------------------------------------------
// PROTECTED ADMIN API ENDPOINTS
// ----------------------------------------------------

// Admin get dashboard stats & all data
app.get('/api/admin/full-data', requireAdmin, (req, res) => {
  const db = getDB();
  const nowStr = new Date().toISOString().slice(0, 10);

  const todayOrders = db.orders.filter((o: any) => o.createdAt && o.createdAt.startsWith(nowStr));
  const newOrders = db.orders.filter((o: any) => o.orderStatus === 'MENUNGGU_KONFIRMASI');
  const processingOrders = db.orders.filter((o: any) => ['PEMBAYARAN_DIKONFIRMASI', 'DIPROSES', 'SIAP_DIKIRIM', 'DIKIRIM'].includes(o.orderStatus));
  const completedOrders = db.orders.filter((o: any) => o.orderStatus === 'SELESAI');
  
  const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  // Top products calculation
  const productSalesMap: Record<string, number> = {};
  completedOrders.forEach((o: any) => {
    o.items?.forEach((item: any) => {
      productSalesMap[item.productName] = (productSalesMap[item.productName] || 0) + (item.quantity || 1);
    });
  });

  const topProductNames = Object.entries(productSalesMap)
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const stats = {
    todayOrdersCount: todayOrders.length,
    newOrdersCount: newOrders.length,
    processingOrdersCount: processingOrders.length,
    completedOrdersCount: completedOrders.length,
    totalRevenue,
    totalProductsCount: db.products.length,
    topProductNames,
  };

  res.json({
    stats,
    orders: db.orders,
    products: db.products,
    categories: db.categories,
    bankAccounts: db.bankAccounts,
    promotions: db.promotions,
    settings: db.settings,
  });
});

// Update order status or payment status
app.put('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { orderStatus, paymentStatus } = req.body;

  const orderIndex = db.orders.findIndex((o: any) => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
  }

  if (orderStatus) db.orders[orderIndex].orderStatus = orderStatus;
  if (paymentStatus) db.orders[orderIndex].paymentStatus = paymentStatus;
  db.orders[orderIndex].updatedAt = new Date().toISOString();

  saveDB(db);
  res.json({ success: true, order: db.orders[orderIndex] });
});

// Products CRUD
app.post('/api/admin/products', requireAdmin, (req, res) => {
  const db = getDB();
  const productData = req.body;
  const newProduct = {
    id: 'prod-' + Date.now(),
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.products.unshift(newProduct);
  saveDB(db);
  res.json({ success: true, product: newProduct });
});

app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const index = db.products.findIndex((p: any) => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Produk tidak ditemukan' });

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  saveDB(db);
  res.json({ success: true, product: db.products[index] });
});

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const db = getDB();
  const { id } = req.params;
  db.products = db.products.filter((p: any) => p.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// Categories CRUD
app.post('/api/admin/categories', requireAdmin, (req, res) => {
  const db = getDB();
  const newCategory = {
    id: 'cat-' + Date.now(),
    name: req.body.name,
    isActive: req.body.isActive ?? true,
    createdAt: new Date().toISOString(),
  };
  db.categories.push(newCategory);
  saveDB(db);
  res.json({ success: true, category: newCategory });
});

app.put('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const db = getDB();
  const index = db.categories.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Kategori tidak ditemukan' });

  db.categories[index] = { ...db.categories[index], ...req.body };
  saveDB(db);
  res.json({ success: true, category: db.categories[index] });
});

app.delete('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const db = getDB();
  db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// Promotions CRUD
app.post('/api/admin/promotions', requireAdmin, (req, res) => {
  const db = getDB();
  const newPromo = {
    id: 'promo-' + Date.now(),
    ...req.body,
    isActive: req.body.isActive ?? true,
  };
  db.promotions.push(newPromo);
  saveDB(db);
  res.json({ success: true, promotion: newPromo });
});

app.put('/api/admin/promotions/:id', requireAdmin, (req, res) => {
  const db = getDB();
  const index = db.promotions.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Promo tidak ditemukan' });

  db.promotions[index] = { ...db.promotions[index], ...req.body };
  saveDB(db);
  res.json({ success: true, promotion: db.promotions[index] });
});

app.delete('/api/admin/promotions/:id', requireAdmin, (req, res) => {
  const db = getDB();
  db.promotions = db.promotions.filter((p: any) => p.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// Bank Accounts CRUD
app.post('/api/admin/bank-accounts', requireAdmin, (req, res) => {
  const db = getDB();
  const newBank = {
    id: 'bank-' + Date.now(),
    ...req.body,
    isActive: req.body.isActive ?? true,
  };
  db.bankAccounts.push(newBank);
  saveDB(db);
  res.json({ success: true, bankAccount: newBank });
});

app.put('/api/admin/bank-accounts/:id', requireAdmin, (req, res) => {
  const db = getDB();
  const index = db.bankAccounts.findIndex((b: any) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Rekening bank tidak ditemukan' });

  db.bankAccounts[index] = { ...db.bankAccounts[index], ...req.body };
  saveDB(db);
  res.json({ success: true, bankAccount: db.bankAccounts[index] });
});

app.delete('/api/admin/bank-accounts/:id', requireAdmin, (req, res) => {
  const db = getDB();
  db.bankAccounts = db.bankAccounts.filter((b: any) => b.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// Update Store Settings
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const db = getDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);
  res.json({ success: true, settings: db.settings });
});

// Update Admin PIN
app.put('/api/admin/pin', requireAdmin, (req, res) => {
  const { newPin } = req.body;
  if (!newPin || newPin.length < 4) {
    return res.status(400).json({ error: 'PIN minimal 4 angka' });
  }
  const db = getDB();
  db.adminPinHash = crypto.createHash('sha256').update(String(newPin)).digest('hex');
  saveDB(db);
  res.json({ success: true, message: 'PIN Admin berhasil diubah' });
});

// ----------------------------------------------------
// VITE OR STATIC FILE SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Diwa Jajanan Server running on http://localhost:${PORT}`);
  });
}

startServer();
