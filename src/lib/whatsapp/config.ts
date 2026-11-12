/**
 * Artआलय WhatsApp Configuration & Artist Direct Helpline
 * 
 * Mobile Number: +91 9373567492
 */
export const ARTIST_WHATSAPP_NUMBER = "919373567492"; // E.164 format without plus for wa.me links
export const ARTIST_WHATSAPP_DISPLAY = "+91 9373567492"; // E.164 with plus
export const ARTIST_WHATSAPP_FORMATTED = "+91 93735 67492"; // Spaced format for UI presentation

/**
 * Returns a direct wa.me URL for the artist with an optional pre-encoded message.
 */
export function getArtistWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${ARTIST_WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

