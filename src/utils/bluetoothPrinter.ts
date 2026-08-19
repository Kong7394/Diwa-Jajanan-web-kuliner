// Web Bluetooth Thermal Printer Utility for ESC/POS 58mm & 80mm Printers

export interface BluetoothPrinterDevice {
  device: BluetoothDevice;
  characteristic: BluetoothRemoteGATTCharacteristic;
}

let connectedPrinter: BluetoothPrinterDevice | null = null;

// Common Bluetooth Serial / Thermal Printer GATT Service & Characteristic UUIDs
const PRINTER_SERVICES = [
  '00001101-0000-1000-8000-00805f9b34fb', // Standard Serial Port Profile (SPP)
  '000018f0-0000-1000-8000-00805f9b34fb', // Common Thermal Printer Service
  '0000e0ff-0000-1000-8000-00805f9b34fb', // ESC/POS Service
  '495353c2-fe7d-4ae5-8fa9-25afd0206e94',
];

const PRINTER_CHARACTERISTICS = [
  '00002001-0000-1000-8000-00805f9b34fb',
  '00002af1-0000-1000-8000-00805f9b34fb',
  '0000e0ef-0000-1000-8000-00805f9b34fb',
  '495353c2-fe7d-4ae5-8fa9-25afd0206e94',
];

export function isWebBluetoothSupported(): boolean {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

export function getConnectedPrinterDevice(): BluetoothPrinterDevice | null {
  return connectedPrinter;
}

export async function connectBluetoothPrinter(): Promise<BluetoothPrinterDevice> {
  if (!isWebBluetoothSupported()) {
    throw new Error('Web Bluetooth API tidak didukung di browser ini. Gunakan Chrome/Edge di Desktop atau Android.');
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [
        ...PRINTER_SERVICES,
        '00001800-0000-1000-8000-00805f9b34fb',
        '00001801-0000-1000-8000-00805f9b34fb'
      ],
    });

    if (!device.gatt) {
      throw new Error('GATT Server tidak tersedia pada perangkat ini.');
    }

    const server = await device.gatt.connect();

    // Try finding a primary service and writeable characteristic
    let targetCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;

    const services = await server.getPrimaryServices().catch(() => []);
    for (const service of services) {
      const characteristics = await service.getCharacteristics().catch(() => []);
      for (const char of characteristics) {
        if (char.properties.write || char.properties.writeWithoutResponse) {
          targetCharacteristic = char;
          break;
        }
      }
      if (targetCharacteristic) break;
    }

    if (!targetCharacteristic) {
      throw new Error('Tidak ditemukan karakteristik printer yang dapat menerima perintah cetak.');
    }

    connectedPrinter = {
      device,
      characteristic: targetCharacteristic,
    };

    device.addEventListener('gattserverdisconnected', () => {
      connectedPrinter = null;
    });

    return connectedPrinter;
  } catch (error: any) {
    console.error('Bluetooth connection error:', error);
    throw new Error(error.message || 'Gagal menghubungkan printer Bluetooth.');
  }
}

export async function disconnectBluetoothPrinter(): Promise<void> {
  if (connectedPrinter && connectedPrinter.device.gatt?.connected) {
    connectedPrinter.device.gatt.disconnect();
  }
  connectedPrinter = null;
}

// Format line text to fit paper width (e.g., 32 characters for 58mm, 48 chars for 80mm)
function formatTwoColumns(left: string, right: string, width = 32): string {
  const spaceNeeded = width - left.length - right.length;
  if (spaceNeeded <= 0) {
    return left.substring(0, width - right.length - 1) + ' ' + right;
  }
  return left + ' '.repeat(spaceNeeded) + right;
}

function centerText(text: string, width = 32): string {
  if (text.length >= width) return text.substring(0, width);
  const padding = Math.floor((width - text.length) / 2);
  return ' '.repeat(padding) + text;
}

export function buildEscPosReceiptBuffer(order: {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: { productName: string; variantName?: string; quantity: number; price: number; subtotal: number }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  notes?: string;
  storeSettings?: { storeName?: string; address?: string; whatsappNumber?: string };
}, paperWidth: '58mm' | '80mm' = '58mm'): Uint8Array {
  const charsPerLine = paperWidth === '58mm' ? 32 : 48;
  const lineDivider = '-'.repeat(charsPerLine);
  const storeName = order.storeSettings?.storeName || 'Diwa Jajanan';

  const encoder = new TextEncoder();
  const chunks: number[] = [];

  // Helper bytes
  const ESC = 0x1b;
  const GS = 0x1d;

  // Initialize printer
  chunks.push(ESC, 0x40);

  // Center align store header
  chunks.push(ESC, 0x61, 0x01);
  
  // Double height & width for Store Name
  chunks.push(GS, 0x21, 0x11);
  const storeHeader = encoder.encode(`${storeName}\n`);
  storeHeader.forEach(b => chunks.push(b));

  // Reset text size to normal
  chunks.push(GS, 0x21, 0x00);

  // Address & contact
  if (order.storeSettings?.address) {
    const addr = encoder.encode(`${order.storeSettings.address.substring(0, charsPerLine * 2)}\n`);
    addr.forEach(b => chunks.push(b));
  }
  if (order.storeSettings?.whatsappNumber) {
    const wa = encoder.encode(`WA: ${order.storeSettings.whatsappNumber}\n`);
    wa.forEach(b => chunks.push(b));
  }

  // Divider
  const div = encoder.encode(`${lineDivider}\n`);
  div.forEach(b => chunks.push(b));

  // Left align body
  chunks.push(ESC, 0x61, 0x00);

  // Date & Order No
  const dateStr = new Date(order.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  
  const infoLines = [
    `No.  : ${order.orderNumber}`,
    `Tgl  : ${dateStr}`,
    `Nama : ${order.customerName}`,
    `HP   : ${order.phone}`,
    `Bayar: ${order.paymentMethod}`,
  ];

  infoLines.forEach(line => {
    const encoded = encoder.encode(`${line}\n`);
    encoded.forEach(b => chunks.push(b));
  });

  div.forEach(b => chunks.push(b));

  // Items List
  order.items.forEach(item => {
    const itemName = item.variantName 
      ? `${item.productName} (${item.variantName})`
      : item.productName;
    
    // Line 1: Item Name
    const nameBytes = encoder.encode(`${itemName}\n`);
    nameBytes.forEach(b => chunks.push(b));

    // Line 2: Qty x Price ... Subtotal
    const priceStr = `  ${item.quantity}x @${item.price.toLocaleString('id-ID')}`;
    const subtotalStr = `Rp${item.subtotal.toLocaleString('id-ID')}`;
    const formattedLine = formatTwoColumns(priceStr, subtotalStr, charsPerLine);
    const lineBytes = encoder.encode(`${formattedLine}\n`);
    lineBytes.forEach(b => chunks.push(b));
  });

  div.forEach(b => chunks.push(b));

  // Totals
  const subtotalLine = formatTwoColumns('Subtotal', `Rp${order.subtotal.toLocaleString('id-ID')}`, charsPerLine);
  encoder.encode(`${subtotalLine}\n`).forEach(b => chunks.push(b));

  if (order.shippingFee > 0) {
    const shipLine = formatTwoColumns('Ongkir', `Rp${order.shippingFee.toLocaleString('id-ID')}`, charsPerLine);
    encoder.encode(`${shipLine}\n`).forEach(b => chunks.push(b));
  }

  div.forEach(b => chunks.push(b));

  // Bold Total
  chunks.push(ESC, 0x45, 0x01); // Bold on
  const totalLine = formatTwoColumns('TOTAL', `Rp${order.total.toLocaleString('id-ID')}`, charsPerLine);
  encoder.encode(`${totalLine}\n`).forEach(b => chunks.push(b));
  chunks.push(ESC, 0x45, 0x00); // Bold off

  div.forEach(b => chunks.push(b));

  // Footer Message
  chunks.push(ESC, 0x61, 0x01); // Center
  const footerText = encoder.encode(
    `${centerText('Terima Kasih Atas Pesanan Anda!', charsPerLine)}\n${centerText('Selamat Menikmati Jajanan Kami!', charsPerLine)}\n\n\n\n`
  );
  footerText.forEach(b => chunks.push(b));

  // Cut Paper command
  chunks.push(GS, 0x56, 0x41, 0x00);

  return new Uint8Array(chunks);
}

export async function sendToBluetoothPrinter(buffer: Uint8Array): Promise<void> {
  let printer = getConnectedPrinterDevice();
  if (!printer || !printer.device.gatt?.connected) {
    printer = await connectBluetoothPrinter();
  }

  if (!printer || !printer.characteristic) {
    throw new Error('Printer tidak terhubung');
  }

  // Send in chunks of 100 bytes to prevent buffer overflow in BLE characteristic
  const CHUNK_SIZE = 100;
  for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
    const chunk = buffer.subarray(i, i + CHUNK_SIZE);
    if (printer.characteristic.properties.writeWithoutResponse) {
      await printer.characteristic.writeValueWithoutResponse(chunk);
    } else {
      await printer.characteristic.writeValue(chunk);
    }
    // Small delay between BLE writes
    await new Promise((r) => setTimeout(r, 50));
  }
}
