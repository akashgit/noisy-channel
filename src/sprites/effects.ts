// Effect/particle sprites — confetti, sparks, sparkles

export interface EffectChar {
  char: string;
  color: string;
}

// ============================================================
// Confetti — colorful celebration particles
// ============================================================
export const confettiChars: EffectChar[] = [
  { char: '\u2605', color: '#FFD700' }, // ★ gold
  { char: '\u25CF', color: '#FF69B4' }, // ● hot pink
  { char: '\u25C6', color: '#7B68EE' }, // ◆ medium slate blue
  { char: '\u25AA', color: '#00CED1' }, // ▪ dark turquoise
  { char: '\u2666', color: '#FF6347' }, // ♦ tomato
  { char: '\u2665', color: '#FF1493' }, // ♥ deep pink
  { char: '\u2726', color: '#9370DB' }, // ✦ medium purple
];

// ============================================================
// Sparks — energetic work particles (brighter, sharper)
// ============================================================
export const sparkChars: EffectChar[] = [
  { char: '\u00B7', color: '#FFFFFF' }, // · white
  { char: '\u2022', color: '#FFD700' }, // • gold
  { char: '\u2217', color: '#FFA500' }, // ∗ orange
  { char: '\u26A1', color: '#FFFF00' }, // ⚡ yellow
];

// ============================================================
// Sparkles — subtle ambient particles (softer, twinkly)
// ============================================================
export const sparkleChars: EffectChar[] = [
  { char: '\u2726', color: '#E6E6FA' }, // ✦ lavender
  { char: '\u2727', color: '#B0C4DE' }, // ✧ light steel blue
  { char: '\u22C6', color: '#DDA0DD' }, // ⋆ plum
  { char: '\u2728', color: '#FAFAD2' }, // ✨ light goldenrod
  { char: '\u00B7', color: '#D8BFD8' }, // · thistle
];
