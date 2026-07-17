// Erzeugt einfache equirectangulare Test-Panoramen + ein Logo — ohne externe
// Bibliotheken (eigener Mini-PNG-Encoder). Aufruf:  node generate-sample.js
import zlib from 'node:zlib';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), 'samples');
fs.mkdirSync(OUT, { recursive: true });

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return (buf) => { let c = 0xffffffff; for (const b of buf) c = t[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
})();

function png(width, height, rgba) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(CRC(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit, RGBA
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.subarray(y * width * 4, (y + 1) * width * 4).copy(raw, y * (width * 4 + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Equirectangulares Panorama: Himmel-Gradient, Boden, Gitternetz, Stativ-Fleck.
function panorama(w, h, hue, label) {
  const buf = Buffer.alloc(w * h * 4);
  const set = (x, y, r, g, b) => { const i = (y * w + x) * 4; buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255; };
  for (let y = 0; y < h; y++) {
    const v = y / h;               // 0 oben (Himmel) .. 1 unten (Boden)
    for (let x = 0; x < w; x++) {
      let r, g, b;
      if (v < 0.5) { const t = v * 2; r = 40 + hue.r * (1 - t); g = 60 + hue.g * (1 - t); b = 120 + hue.b * (1 - t); }
      else { const t = (v - 0.5) * 2; r = 70 - 30 * t; g = 55 - 25 * t; b = 45 - 20 * t; }
      // Gitternetz alle ~15°
      if (x % Math.round(w / 24) === 0 || y % Math.round(h / 12) === 0) { r += 45; g += 45; b += 45; }
      set(x, y, Math.min(255, r | 0), Math.min(255, g | 0), Math.min(255, b | 0));
    }
  }
  // Stativ/Fotograf: dunkler Fleck am unteren Rand (Nadir)
  const cx = w / 2, cy = h - h * 0.06, rad = h * 0.09;
  for (let y = h - Math.round(rad * 1.4); y < h; y++)
    for (let x = 0; x < w; x++) {
      const dx = Math.min(Math.abs(x - cx), w - Math.abs(x - cx));
      if (dx * dx + (y - cy) * (y - cy) < rad * rad) set(x, y, 25, 25, 28);
    }
  // Beschriftung (grobe Blockschrift) auf Augenhöhe
  stamp(buf, w, h, label, Math.round(w * 0.42), Math.round(h * 0.44));
  return png(w, h, buf);
}

// winzige 5x7-Blockschrift für ein paar Zeichen
function stamp(buf, w, h, text, ox, oy) {
  const F = { R1: 'A', };
  const put = (x, y) => { if (x < 0 || y < 0 || x >= w || y >= h) return; const i = (y * w + x) * 4; buf[i] = 255; buf[i + 1] = 220; buf[i + 2] = 90; buf[i + 3] = 255; };
  const s = 6;
  for (let c = 0; c < text.length; c++)
    for (let yy = 0; yy < 7; yy++)
      for (let xx = 0; xx < 5; xx++)
        if ((GLYPH[text[c]] || GLYPH['?'])[yy] & (1 << (4 - xx)))
          for (let a = 0; a < s; a++) for (let b = 0; b < s; b++) put(ox + c * 6 * s + xx * s + a, oy + yy * s + b);
}
const GLYPH = {
  '1': [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  '2': [0b01110, 0b10001, 0b00001, 0b00110, 0b01000, 0b10000, 0b11111],
  'R': [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  'A': [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  'U': [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  'M': [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  ' ': [0, 0, 0, 0, 0, 0, 0], '?': [0b01110, 0b10001, 0b00010, 0b00100, 0b00100, 0, 0b00100],
};

// Logo: farbiger Kreis mit „PT"
function logo() {
  const s = 256, buf = Buffer.alloc(s * s * 4);
  const cx = s / 2, cy = s / 2, r = s * 0.46;
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const d = Math.hypot(x - cx, y - cy), i = (y * s + x) * 4;
    if (d < r) { buf[i] = 79; buf[i + 1] = 140; buf[i + 2] = 255; buf[i + 3] = 255; }
  }
  stampBig(buf, s, 'PT');
  return png(s, s, buf);
}
function stampBig(buf, s, text) {
  const g = { P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000], T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100] };
  const px = 12, ox = s / 2 - text.length * 5 * px / 2, oy = s / 2 - 7 * px / 2;
  for (let c = 0; c < text.length; c++) for (let yy = 0; yy < 7; yy++) for (let xx = 0; xx < 5; xx++)
    if (g[text[c]][yy] & (1 << (4 - xx))) for (let a = 0; a < px; a++) for (let b = 0; b < px; b++) {
      const X = Math.round(ox + c * 5 * px + xx * px + a), Y = Math.round(oy + yy * px + b), i = (Y * s + X) * 4;
      buf[i] = 255; buf[i + 1] = 255; buf[i + 2] = 255; buf[i + 3] = 255;
    }
}

fs.writeFileSync(join(OUT, 'raum1.png'), panorama(2048, 1024, { r: 60, g: 40, b: 20 }, 'RAUM 1'));
fs.writeFileSync(join(OUT, 'raum2.png'), panorama(2048, 1024, { r: 20, g: 50, b: 40 }, 'RAUM 2'));
fs.writeFileSync(join(OUT, 'logo.png'), logo());
console.log('Erzeugt:', fs.readdirSync(OUT).join(', '));
