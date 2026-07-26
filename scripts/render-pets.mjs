import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, 'public/pets');
mkdirSync(outDir, { recursive: true });

const PETS = [
  { key: 'octopus', color: '#ef4444' },
  { key: 'fox', color: '#f97316' },
  { key: 'tiger', color: '#f59e0b' },
  { key: 'monkey', color: '#a16207' },
  { key: 'bear', color: '#92400e' },
  { key: 'duck', color: '#fbbf24' },
  { key: 'cat', color: '#6b7280' },
  { key: 'dog', color: '#d97706' },
  { key: 'rabbit', color: '#f9a8d4' },
  { key: 'giraffe', color: '#eab308' },
  { key: 'alligator', color: '#16a34a' },
];

// We'll build the SVG strings inline, matching PetIllustrations.tsx
function svgWrap(inner, color) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${inner(color)}</svg>`;
}

const builders = {
  octopus: (color) => {
    let arms = '';
    for (let i = 0; i < 8; i++) {
      const angle = (i - 3.5) * 0.38;
      const length = 65 + (i % 3) * 8;
      const baseX = 100, baseY = 110;
      const endX = baseX + Math.sin(angle) * length;
      const endY = baseY + Math.cos(angle) * length * 0.85;
      const ctrlX = baseX + Math.sin(angle) * (length * 0.5);
      const ctrlY = baseY + Math.cos(angle) * (length * 0.5) + 10;
      arms += `<path d="M ${baseX + Math.sin(angle) * 18} ${baseY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}" stroke="${color}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
    }
    return `<ellipse cx="100" cy="70" rx="62" ry="55" fill="${color}"/><ellipse cx="100" cy="55" rx="50" ry="40" fill="${color}" opacity="0.85"/>${arms}<circle cx="78" cy="60" r="11" fill="white"/><circle cx="122" cy="60" r="11" fill="white"/><circle cx="80" cy="62" r="6" fill="#1e293b"/><circle cx="124" cy="62" r="6" fill="#1e293b"/><circle cx="82" cy="59" r="2.5" fill="white"/><circle cx="126" cy="59" r="2.5" fill="white"/><path d="M 88 82 Q 100 90 112 82" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="70" cy="78" r="7" fill="#fca5a5" opacity="0.5"/><circle cx="130" cy="78" r="7" fill="#fca5a5" opacity="0.5"/>`;
  },
  fox: (color) => {
    const dark = '#c2410c';
    const light = '#fed7aa';
    return `<path d="M 155 130 Q 180 110 185 80 Q 178 75 168 85 Q 160 105 145 120 Z" fill="${color}"/><ellipse cx="180" cy="82" rx="10" ry="8" fill="${light}"/><ellipse cx="100" cy="135" rx="42" ry="35" fill="${color}"/><ellipse cx="100" cy="145" rx="28" ry="22" fill="${light}"/><rect x="78" y="155" width="14" height="28" rx="7" fill="${color}"/><rect x="108" y="155" width="14" height="28" rx="7" fill="${color}"/><rect x="76" y="175" width="18" height="10" rx="5" fill="${dark}"/><rect x="106" y="175" width="18" height="10" rx="5" fill="${dark}"/><ellipse cx="100" cy="80" rx="40" ry="38" fill="${color}"/><path d="M 68 55 L 58 25 L 82 48 Z" fill="${color}"/><path d="M 132 55 L 142 25 L 118 48 Z" fill="${color}"/><path d="M 70 50 L 65 33 L 78 46 Z" fill="${light}"/><path d="M 130 50 L 135 33 L 122 46 Z" fill="${light}"/><ellipse cx="100" cy="92" rx="25" ry="20" fill="${light}"/><path d="M 88 88 L 75 80 L 82 95 Z" fill="${light}"/><path d="M 112 88 L 125 80 L 118 95 Z" fill="${light}"/><circle cx="85" cy="75" r="7" fill="#1e293b"/><circle cx="115" cy="75" r="7" fill="#1e293b"/><circle cx="87" cy="73" r="2.5" fill="white"/><circle cx="117" cy="73" r="2.5" fill="white"/><ellipse cx="100" cy="95" rx="6" ry="4" fill="#1e293b"/><path d="M 100 99 L 100 104 M 100 104 L 92 108 M 100 104 L 108 108" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  },
  tiger: (color) => {
    const dark = '#b45309';
    const light = '#fef3c7';
    return `<path d="M 150 130 Q 175 120 180 95 Q 173 90 165 100 Q 155 115 140 125" stroke="${color}" stroke-width="14" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="135" rx="44" ry="36" fill="${color}"/><ellipse cx="100" cy="145" rx="26" ry="20" fill="${light}"/><path d="M 70 120 Q 75 130 72 142" stroke="${dark}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M 130 120 Q 125 130 128 142" stroke="${dark}" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="76" y="155" width="14" height="28" rx="7" fill="${color}"/><rect x="110" y="155" width="14" height="28" rx="7" fill="${color}"/><rect x="74" y="175" width="18" height="10" rx="5" fill="${dark}"/><rect x="108" y="175" width="18" height="10" rx="5" fill="${dark}"/><ellipse cx="100" cy="78" rx="42" ry="40" fill="${color}"/><circle cx="66" cy="50" r="14" fill="${color}"/><circle cx="134" cy="50" r="14" fill="${color}"/><circle cx="66" cy="52" r="8" fill="#fbbf24"/><circle cx="134" cy="52" r="8" fill="#fbbf24"/><ellipse cx="100" cy="92" rx="24" ry="18" fill="${light}"/><path d="M 80 55 L 78 68" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><path d="M 120 55 L 122 68" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><path d="M 100 48 L 100 60" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><circle cx="85" cy="75" r="7" fill="#1e293b"/><circle cx="115" cy="75" r="7" fill="#1e293b"/><circle cx="87" cy="73" r="2.5" fill="white"/><circle cx="117" cy="73" r="2.5" fill="white"/><ellipse cx="100" cy="95" rx="6" ry="4" fill="#1e293b"/><path d="M 100 99 L 100 104 M 100 104 L 92 108 M 100 104 L 108 108" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  },
  monkey: (color) => {
    const dark = '#78350f';
    const light = '#fde68a';
    return `<path d="M 150 140 Q 185 140 185 100 Q 180 95 170 105 Q 155 125 140 130" stroke="${color}" stroke-width="12" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="135" rx="38" ry="34" fill="${color}"/><ellipse cx="100" cy="142" rx="24" ry="20" fill="${light}"/><ellipse cx="62" cy="130" rx="12" ry="22" fill="${color}" transform="rotate(20 62 130)"/><ellipse cx="138" cy="130" rx="12" ry="22" fill="${color}" transform="rotate(-20 138 130)"/><rect x="80" y="158" width="14" height="26" rx="7" fill="${color}"/><rect x="106" y="158" width="14" height="26" rx="7" fill="${color}"/><rect x="78" y="176" width="18" height="10" rx="5" fill="${dark}"/><rect x="104" y="176" width="18" height="10" rx="5" fill="${dark}"/><ellipse cx="100" cy="78" rx="42" ry="40" fill="${color}"/><circle cx="58" cy="72" r="16" fill="${color}"/><circle cx="142" cy="72" r="16" fill="${color}"/><circle cx="58" cy="74" r="10" fill="${light}"/><circle cx="142" cy="74" r="10" fill="${light}"/><ellipse cx="100" cy="85" rx="28" ry="24" fill="${light}"/><circle cx="88" cy="78" r="7" fill="#1e293b"/><circle cx="112" cy="78" r="7" fill="#1e293b"/><circle cx="90" cy="76" r="2.5" fill="white"/><circle cx="114" cy="76" r="2.5" fill="white"/><ellipse cx="100" cy="92" rx="5" ry="3" fill="#1e293b"/><path d="M 90 98 Q 100 104 110 98" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  },
  bear: (color) => {
    const dark = '#451a03';
    const light = '#fef3c7';
    return `<ellipse cx="100" cy="138" rx="48" ry="38" fill="${color}"/><ellipse cx="100" cy="148" rx="30" ry="22" fill="${light}"/><rect x="72" y="160" width="18" height="26" rx="9" fill="${color}"/><rect x="110" y="160" width="18" height="26" rx="9" fill="${color}"/><ellipse cx="81" cy="184" rx="12" ry="7" fill="${dark}"/><ellipse cx="119" cy="184" rx="12" ry="7" fill="${dark}"/><ellipse cx="56" cy="135" rx="12" ry="20" fill="${color}" transform="rotate(15 56 135)"/><ellipse cx="144" cy="135" rx="12" ry="20" fill="${color}" transform="rotate(-15 144 135)"/><ellipse cx="100" cy="75" rx="44" ry="42" fill="${color}"/><circle cx="62" cy="42" r="16" fill="${color}"/><circle cx="138" cy="42" r="16" fill="${color}"/><circle cx="62" cy="44" r="9" fill="#d97706"/><circle cx="138" cy="44" r="9" fill="#d97706"/><ellipse cx="100" cy="92" rx="22" ry="18" fill="${light}"/><circle cx="84" cy="72" r="6" fill="#1e293b"/><circle cx="116" cy="72" r="6" fill="#1e293b"/><circle cx="86" cy="70" r="2" fill="white"/><circle cx="118" cy="70" r="2" fill="white"/><ellipse cx="100" cy="88" rx="7" ry="5" fill="#1e293b"/><path d="M 100 93 L 100 98 M 100 98 L 92 102 M 100 98 L 108 102" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  },
  duck: (color) => {
    const dark = '#ca8a04';
    const orange = '#f97316';
    return `<ellipse cx="105" cy="135" rx="50" ry="40" fill="${color}"/><path d="M 155 125 L 175 115 L 168 130 Z" fill="${color}"/><path d="M 155 140 L 175 145 L 165 150 Z" fill="${color}"/><ellipse cx="95" cy="130" rx="28" ry="22" fill="${dark}" transform="rotate(-10 95 130)"/><rect x="92" y="170" width="6" height="18" fill="${orange}"/><rect x="108" y="170" width="6" height="18" fill="${orange}"/><path d="M 85 188 L 105 188 L 100 193 Z" fill="${orange}"/><path d="M 101 188 L 121 188 L 116 193 Z" fill="${orange}"/><circle cx="75" cy="78" r="34" fill="${color}"/><path d="M 45 80 L 20 78 L 22 88 L 48 88 Z" fill="${orange}"/><line x1="22" y1="83" x2="46" y2="83" stroke="${dark}" stroke-width="1.5"/><circle cx="80" cy="72" r="7" fill="white"/><circle cx="82" cy="73" r="5" fill="#1e293b"/><circle cx="84" cy="71" r="2" fill="white"/>`;
  },
  cat: (color) => {
    const dark = '#374151';
    const light = '#e5e7eb';
    return `<path d="M 145 135 Q 180 120 175 85 Q 168 80 160 90 Q 150 110 138 125" stroke="${color}" stroke-width="14" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="138" rx="42" ry="34" fill="${color}"/><ellipse cx="100" cy="148" rx="24" ry="18" fill="${light}"/><rect x="78" y="160" width="14" height="24" rx="7" fill="${color}"/><rect x="108" y="160" width="14" height="24" rx="7" fill="${color}"/><rect x="76" y="178" width="18" height="10" rx="5" fill="${dark}"/><rect x="106" y="178" width="18" height="10" rx="5" fill="${dark}"/><ellipse cx="100" cy="78" rx="40" ry="36" fill="${color}"/><path d="M 65 55 L 55 25 L 80 48 Z" fill="${color}"/><path d="M 135 55 L 145 25 L 120 48 Z" fill="${color}"/><path d="M 68 50 L 63 35 L 76 46 Z" fill="#f9a8d4"/><path d="M 132 50 L 137 35 L 124 46 Z" fill="#f9a8d4"/><ellipse cx="100" cy="88" rx="22" ry="16" fill="${light}"/><ellipse cx="85" cy="75" rx="6" ry="8" fill="#1e293b"/><ellipse cx="115" cy="75" rx="6" ry="8" fill="#1e293b"/><ellipse cx="87" cy="72" rx="2" ry="3" fill="white"/><ellipse cx="117" cy="72" rx="2" ry="3" fill="white"/><path d="M 96 90 L 100 95 L 104 90 Z" fill="#f472b6"/><path d="M 100 95 L 100 99 M 100 99 L 92 103 M 100 99 L 108 103" stroke="#1e293b" stroke-width="1.5" fill="none" stroke-linecap="round"/><line x1="75" y1="88" x2="60" y2="85" stroke="${dark}" stroke-width="1"/><line x1="75" y1="92" x2="60" y2="93" stroke="${dark}" stroke-width="1"/><line x1="125" y1="88" x2="140" y2="85" stroke="${dark}" stroke-width="1"/><line x1="125" y1="92" x2="140" y2="93" stroke="${dark}" stroke-width="1"/>`;
  },
  dog: (color) => {
    const dark = '#92400e';
    const light = '#fef3c7';
    return `<path d="M 148 130 Q 175 115 178 90 Q 171 86 163 94 Q 152 110 140 122" stroke="${color}" stroke-width="14" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="138" rx="44" ry="34" fill="${color}"/><ellipse cx="100" cy="148" rx="26" ry="18" fill="${light}"/><rect x="76" y="160" width="16" height="26" rx="8" fill="${color}"/><rect x="108" y="160" width="16" height="26" rx="8" fill="${color}"/><rect x="74" y="180" width="20" height="10" rx="5" fill="${dark}"/><rect x="106" y="180" width="20" height="10" rx="5" fill="${dark}"/><ellipse cx="100" cy="76" rx="42" ry="38" fill="${color}"/><ellipse cx="58" cy="58" rx="14" ry="24" fill="${color}" transform="rotate(20 58 58)"/><ellipse cx="142" cy="58" rx="14" ry="24" fill="${color}" transform="rotate(-20 142 58)"/><ellipse cx="100" cy="92" rx="26" ry="18" fill="${light}"/><circle cx="84" cy="70" r="7" fill="#1e293b"/><circle cx="116" cy="70" r="7" fill="#1e293b"/><circle cx="86" cy="68" r="2.5" fill="white"/><circle cx="118" cy="68" r="2.5" fill="white"/><ellipse cx="100" cy="88" rx="8" ry="5" fill="#1e293b"/><path d="M 100 93 L 100 100 M 100 100 L 92 104 M 100 100 L 108 104" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  },
  rabbit: (color) => {
    const dark = '#be185d';
    const light = '#fce7f3';
    return `<circle cx="148" cy="135" r="14" fill="white"/><ellipse cx="100" cy="140" rx="40" ry="34" fill="${color}"/><ellipse cx="100" cy="150" rx="22" ry="18" fill="${light}"/><rect x="80" y="162" width="14" height="22" rx="7" fill="${color}"/><rect x="106" y="162" width="14" height="22" rx="7" fill="${color}"/><rect x="78" y="178" width="18" height="10" rx="5" fill="${dark}"/><rect x="104" y="178" width="18" height="10" rx="5" fill="${dark}"/><ellipse cx="100" cy="82" rx="36" ry="34" fill="${color}"/><ellipse cx="82" cy="35" rx="10" ry="32" fill="${color}"/><ellipse cx="118" cy="35" rx="10" ry="32" fill="${color}"/><ellipse cx="82" cy="38" rx="5" ry="24" fill="${light}"/><ellipse cx="118" cy="38" rx="5" ry="24" fill="${light}"/><ellipse cx="100" cy="92" rx="20" ry="14" fill="${light}"/><circle cx="88" cy="78" r="6" fill="#1e293b"/><circle cx="112" cy="78" r="6" fill="#1e293b"/><circle cx="90" cy="76" r="2" fill="white"/><circle cx="114" cy="76" r="2" fill="white"/><ellipse cx="100" cy="90" rx="5" ry="3" fill="${dark}"/><path d="M 100 93 L 100 98 M 100 98 L 94 101 M 100 98 L 106 101" stroke="#1e293b" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
  },
  giraffe: (color) => {
    const dark = '#a16207';
    const light = '#fef08a';
    return `<rect x="82" y="135" width="12" height="50" rx="6" fill="${color}"/><rect x="106" y="135" width="12" height="50" rx="6" fill="${color}"/><rect x="80" y="178" width="16" height="10" rx="5" fill="${dark}"/><rect x="104" y="178" width="16" height="10" rx="5" fill="${dark}"/><ellipse cx="100" cy="130" rx="38" ry="26" fill="${color}"/><ellipse cx="100" cy="138" rx="22" ry="14" fill="${light}"/><circle cx="85" cy="125" r="5" fill="${dark}" opacity="0.6"/><circle cx="110" cy="120" r="4" fill="${dark}" opacity="0.6"/><circle cx="120" cy="135" r="5" fill="${dark}" opacity="0.6"/><path d="M 88 115 L 82 55 L 96 50 L 100 115 Z" fill="${color}"/><ellipse cx="92" cy="42" rx="24" ry="18" fill="${color}"/><ellipse cx="80" cy="48" rx="14" ry="10" fill="${light}"/><line x1="86" y1="28" x2="84" y2="16" stroke="${dark}" stroke-width="4" stroke-linecap="round"/><line x1="98" y1="28" x2="100" y2="16" stroke="${dark}" stroke-width="4" stroke-linecap="round"/><circle cx="84" cy="14" r="4" fill="${dark}"/><circle cx="100" cy="14" r="4" fill="${dark}"/><ellipse cx="76" cy="36" rx="6" ry="10" fill="${color}"/><ellipse cx="108" cy="36" rx="6" ry="10" fill="${color}"/><circle cx="96" cy="38" r="5" fill="#1e293b"/><circle cx="98" cy="36" r="1.5" fill="white"/><circle cx="74" cy="47" r="2" fill="${dark}"/><circle cx="80" cy="49" r="2" fill="${dark}"/>`;
  },
  alligator: (color) => {
    const dark = '#14532d';
    const light = '#86efac';
    return `<path d="M 150 140 L 185 130 L 185 150 L 150 155 Z" fill="${color}"/><path d="M 170 132 L 185 128 L 185 138 L 172 140 Z" fill="${dark}"/><ellipse cx="100" cy="140" rx="52" ry="28" fill="${color}"/><ellipse cx="100" cy="148" rx="36" ry="16" fill="${light}"/><path d="M 70 118 L 75 108 L 80 118 Z" fill="${dark}"/><path d="M 88 116 L 93 106 L 98 116 Z" fill="${dark}"/><path d="M 106 116 L 111 106 L 116 116 Z" fill="${dark}"/><path d="M 124 118 L 129 108 L 134 118 Z" fill="${dark}"/><rect x="72" y="160" width="14" height="20" rx="7" fill="${color}"/><rect x="114" y="160" width="14" height="20" rx="7" fill="${color}"/><rect x="70" y="174" width="18" height="10" rx="5" fill="${dark}"/><rect x="112" y="174" width="18" height="10" rx="5" fill="${dark}"/><path d="M 70 125 L 15 128 L 12 142 L 25 148 L 75 145 Z" fill="${color}"/><path d="M 25 142 L 30 148 L 35 142 L 40 148 L 45 142 L 50 148 L 55 142 L 60 148 L 65 142" stroke="white" stroke-width="2" fill="none"/><circle cx="68" cy="120" r="8" fill="${color}"/><circle cx="82" cy="120" r="8" fill="${color}"/><circle cx="69" cy="121" r="5" fill="#fef9c3"/><circle cx="83" cy="121" r="5" fill="#fef9c3"/><circle cx="70" cy="122" r="3" fill="#1e293b"/><circle cx="84" cy="122" r="3" fill="#1e293b"/><circle cx="20" cy="132" r="2" fill="${dark}"/>`;
  },
};

const sharp = (await import('sharp')).default;

for (const pet of PETS) {
  const builder = builders[pet.key];
  if (!builder) { console.warn('no builder for', pet.key); continue; }
  const svg = svgWrap(builder, pet.color);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  const outPath = resolve(outDir, `${pet.key}.png`);
  writeFileSync(outPath, png);
  console.log('wrote', outPath, png.length, 'bytes');
}
console.log('done');
