/**
 * Formats a number to Indonesian Rupiah currency format.
 * Example: 15000 -> "Rp15.000"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount)) return 'Rp0';
  return 'Rp' + Math.round(amount).toLocaleString('id-ID');
}

/**
 * Clean phone number to international format (628xxxx) for WhatsApp Click-to-Chat.
 */
export function cleanWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('08')) {
    cleaned = '628' + cleaned.slice(2);
  } else if (cleaned.startsWith('8')) {
    cleaned = '628' + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Builds a WhatsApp chat link with encoded message.
 */
export function buildWhatsAppLink(phone: string, text: string): string {
  const cleanedPhone = cleanWhatsAppNumber(phone);
  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Safely extracts or creates embeddable iframe URL for Google Maps.
 */
export function getEmbeddableMapsUrl(mapsUrl: string): string {
  if (!mapsUrl) return 'https://maps.google.com/maps?q=-6.4025,106.9601&z=15&output=embed';
  
  if (mapsUrl.includes('google.com/maps/embed') || mapsUrl.includes('output=embed')) {
    return mapsUrl;
  }
  
  // Convert standard share links or coordinates
  return `https://maps.google.com/maps?q=${encodeURIComponent('Kp Rawa Cangkudu Desa Dayeuh Cileungsi Bogor')}&z=15&output=embed`;
}
