/**
 * Artआलय Text Sanitizer for Physical Laser-Cut Manufacturing
 * 
 * Ensures customer entered typography contains only characters supported
 * by physical CNC laser cutters and optical plotters. Stops emoji tofu symbols
 * from damaging physical acrylic stock.
 */

// Permitted: English alphabets, digits, common punctuation (&, -, ', .), Devanagari Unicode
const LASER_SAFE_PATTERN = /^[a-zA-Z0-9\s&'\-.,/॥।\u0900-\u097F]*$/;

export function sanitizeLaserText(input: string): { isValid: boolean; sanitized: string; error?: string } {
  // Strip non-printable or forbidden control characters
  const trimmed = input.trim();
  
  if (trimmed.length === 0) {
    return { isValid: true, sanitized: "" };
  }

  // Check against emojis and unsupported glyphs
  if (!LASER_SAFE_PATTERN.test(trimmed)) {
    // Filter out forbidden characters and keep only laser-safe characters
    const sanitized = trimmed.replace(/[^a-zA-Z0-9\s&'\-.,/॥।\u0900-\u097F]/g, "");
    return {
      isValid: false,
      sanitized,
      error: "Special characters or emojis are not supported for physical laser-cutting. Please use our Sacred Emblem selector for symbols like Ganesha, Swastik, or Lotus.",
    };
  }

  return { isValid: true, sanitized: trimmed };
}

