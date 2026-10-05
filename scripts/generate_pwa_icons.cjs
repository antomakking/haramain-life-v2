const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Master SVG: High-fidelity, perfectly balanced, eye-catching emblem of Haramain Life
// Featuring:
// - Outer Deep Imperial Emerald Green medallion with radiant dual gold filigree borders
// - Islamic 8-point golden stars (Rub El Hizb) flanking the top arc
// - Perfectly centered curved typography "HARAMAIN LIFE" on top
// - Centered bottom arc "MAKKAH • MADINAH" with gold stars
// - Soft ambient celestial radiance in the inner sanctuary
// - Majestic Holy Ka'bah with 3D depth, lustrous Gold Kiswah calligraphy band, Golden Door (Bab Ka'bah), and white marble Syadzarwan
// - Iconic Prophet's Mosque Green Dome (Kubah Hijau) with golden crescent finial and authentic ribbed contour
// - Noble soaring minarets with golden crescents reaching the heavens
const masterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    
    
    <path id="topTextArc" d="M 66,256 A 190,190 0 0,1 446,256" fill="none" />
    
    <path id="bottomTextArc" d="M 436,256 A 180,180 0 0,1 76,256" fill="none" />

    
    <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDF2C7"/>
      <stop offset="25%" stop-color="#E4CB96"/>
      <stop offset="50%" stop-color="#C5A059"/>
      <stop offset="85%" stop-color="#9C7730"/>
      <stop offset="100%" stop-color="#7B5B20"/>
    </linearGradient>

    <linearGradient id="goldLight" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C5A059"/>
      <stop offset="50%" stop-color="#FFF3D1"/>
      <stop offset="100%" stop-color="#C5A059"/>
    </linearGradient>

    
    <linearGradient id="emeraldRim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E5E3D"/>
      <stop offset="40%" stop-color="#14462D"/>
      <stop offset="80%" stop-color="#0E3521"/>
      <stop offset="100%" stop-color="#082215"/>
    </linearGradient>

    
    <linearGradient id="greenDomeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1B6D44"/>
      <stop offset="25%" stop-color="#2D9A61"/>
      <stop offset="55%" stop-color="#207F4E"/>
      <stop offset="85%" stop-color="#155C37"/>
      <stop offset="100%" stop-color="#0D3F24"/>
    </linearGradient>

    
    <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFDF5"/>
      <stop offset="50%" stop-color="#FBF6E9"/>
      <stop offset="80%" stop-color="#F4EBD9"/>
      <stop offset="100%" stop-color="#ECE0C8"/>
    </radialGradient>

    
    <radialGradient id="sacredHalo" cx="50%" cy="60%" r="45%">
      <stop offset="0%" stop-color="#FDE8B3" stop-opacity="0.85"/>
      <stop offset="45%" stop-color="#F5DF95" stop-opacity="0.45"/>
      <stop offset="75%" stop-color="#E5DAC8" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#ECE0C8" stop-opacity="0"/>
    </radialGradient>

    
    <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#082215" flood-opacity="0.3"/>
    </filter>

    
    <clipPath id="innerSanctuaryClip">
      <circle cx="256" cy="256" r="216"/>
    </clipPath>
  </defs>

  
  
  <circle cx="256" cy="256" r="252" fill="url(#emeraldRim)"/>
  
  
  <circle cx="256" cy="256" r="248" fill="none" stroke="url(#goldSheen)" stroke-width="3"/>
  <circle cx="256" cy="256" r="243" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.6"/>

  
  <circle cx="256" cy="256" r="222" fill="none" stroke="url(#goldLight)" stroke-width="3"/>
  <circle cx="256" cy="256" r="218" fill="none" stroke="#0E3521" stroke-width="1.5"/>

  
  <circle cx="256" cy="256" r="216" fill="url(#innerGlow)"/>
  <circle cx="256" cy="245" r="175" fill="url(#sacredHalo)"/>

  
  
  <text font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="30" fill="url(#goldLight)" letter-spacing="4.5">
    <textPath href="#topTextArc" startOffset="50%" text-anchor="middle">HARAMAIN LIFE</textPath>
  </text>

  
  <g transform="translate(68, 256) scale(0.65)" fill="url(#goldSheen)">
    <rect x="-10" y="-10" width="20" height="20" rx="1"/>
    <rect x="-10" y="-10" width="20" height="20" rx="1" transform="rotate(45)"/>
    <circle cx="0" cy="0" r="3" fill="#0E3521"/>
  </g>

  
  <g transform="translate(444, 256) scale(0.65)" fill="url(#goldSheen)">
    <rect x="-10" y="-10" width="20" height="20" rx="1"/>
    <rect x="-10" y="-10" width="20" height="20" rx="1" transform="rotate(45)"/>
    <circle cx="0" cy="0" r="3" fill="#0E3521"/>
  </g>

  
  <text font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="20" fill="url(#goldLight)" letter-spacing="4">
    <textPath href="#bottomTextArc" startOffset="50%" text-anchor="middle">MAKKAH  ★  MADINAH</textPath>
  </text>

  
  <g clip-path="url(#innerSanctuaryClip)">
    
    
    <g opacity="0.12" stroke="#165335" stroke-width="1.2" fill="none" transform="translate(256, 230)">
      <polygon points="0,-140 99,-99 140,0 99,99 0,140 -99,99 -140,0 -99,-99"/>
      <polygon points="0,-140 99,-99 140,0 99,99 0,140 -99,99 -140,0 -99,-99" transform="rotate(22.5)"/>
      <circle cx="0" cy="0" r="100"/>
      <circle cx="0" cy="0" r="60"/>
    </g>

    
    <g id="minarets" filter="url(#shadowFilter)">
      
      <g fill="#183628">
        
        <path d="M 308 68 A 9 9 0 1 1 301 82 A 7 7 0 1 0 308 68 Z" fill="url(#goldSheen)"/>
        <polygon points="305,80 307.5,90 303.5,90" fill="url(#goldSheen)"/>
        <circle cx="305.5" cy="94" r="3" fill="url(#goldSheen)"/>
        
        <polygon points="305.5,94 309,114 302,114" fill="#143023"/>
        <rect x="300" y="114" width="11" height="7" rx="1.5" fill="#183628"/>
        
        <rect x="295" y="121" width="21" height="6" rx="1.5" fill="url(#goldSheen)"/>
        <rect x="296" y="127" width="19" height="3" fill="#10251B"/>
        
        <polygon points="298,130 297,178 314,178 313,130" fill="#183628"/>
        <rect x="303" y="138" width="5" height="10" rx="2.5" fill="#FFFBF0"/>
        <rect x="303" y="157" width="5" height="10" rx="2.5" fill="#FFFBF0"/>
        
        <rect x="292" y="178" width="27" height="8" rx="2" fill="url(#goldSheen)"/>
        <line x1="293" y1="184" x2="318" y2="184" stroke="#10251B" stroke-width="1.5"/>
        
        <polygon points="296,186 294,320 317,320 315,186" fill="#143023"/>
        <rect x="302" y="200" width="7" height="18" rx="3.5" fill="#FFFBF0"/>
        <rect x="302" y="235" width="7" height="18" rx="3.5" fill="#FFFBF0"/>
        <rect x="302" y="270" width="7" height="18" rx="3.5" fill="#FFFBF0"/>
      </g>

      
      <g fill="#183628">
        
        <path d="M 204 102 A 8 8 0 1 1 198 114 A 6 6 0 1 0 204 102 Z" fill="url(#goldSheen)"/>
        <polygon points="201.5,113 203.5,121 200,121" fill="url(#goldSheen)"/>
        <circle cx="201.5" cy="124" r="2.5" fill="url(#goldSheen)"/>
        
        <polygon points="201.5,124 205,140 198,140" fill="#143023"/>
        
        <rect x="193" y="140" width="17" height="5" rx="1.5" fill="url(#goldSheen)"/>
        
        <polygon points="195,145 194,188 209,188 208,145" fill="#183628"/>
        <rect x="199" y="153" width="4.5" height="9" rx="2" fill="#FFFBF0"/>
        <rect x="199" y="169" width="4.5" height="9" rx="2" fill="#FFFBF0"/>
        
        <rect x="190" y="188" width="23" height="7" rx="2" fill="url(#goldSheen)"/>
        
        <polygon points="193,195 191,330 212,330 210,195" fill="#143023"/>
        <rect x="198.5" y="208" width="6" height="16" rx="3" fill="#FFFBF0"/>
        <rect x="198.5" y="240" width="6" height="16" rx="3" fill="#FFFBF0"/>
        <rect x="198.5" y="275" width="6" height="16" rx="3" fill="#FFFBF0"/>
      </g>
    </g>

    
    <g id="green-dome" filter="url(#shadowFilter)">
      
      <g id="dome-finial">
        <path d="M 356 182 A 9 9 0 1 1 347 196 A 7 7 0 1 0 356 182 Z" fill="url(#goldSheen)"/>
        <polygon points="353.5,195 355.5,207 351.5,207" fill="url(#goldSheen)"/>
        <circle cx="353.5" cy="212" r="4.5" fill="url(#goldSheen)"/>
        <circle cx="353.5" cy="221" r="3.5" fill="url(#goldSheen)"/>
        <polygon points="350.5,225 356.5,225 354.5,236 352.5,236" fill="url(#goldSheen)"/>
      </g>

      
      <path d="M 353.5,236 C 314,258 266,298 260,388 L 434,388 C 428,298 382,258 353.5,236 Z" fill="url(#greenDomeGrad)"/>
      
      
      <path d="M 353.5,236 C 339,266 317,308 312,388" fill="none" stroke="#0F4327" stroke-width="3" opacity="0.65"/>
      <path d="M 353.5,236 C 368,266 390,308 395,388" fill="none" stroke="#0F4327" stroke-width="3" opacity="0.65"/>
      <path d="M 353.5,236 C 347,272 338,320 336,388" fill="none" stroke="#34AF71" stroke-width="1.8" opacity="0.45"/>
      <path d="M 353.5,236 C 360,272 369,320 371,388" fill="none" stroke="#0C341E" stroke-width="2" opacity="0.45"/>

      
      <path d="M 352,240 C 322,264 286,305 278,380" fill="none" stroke="#5FD697" stroke-width="3.5" opacity="0.35"/>

      
      <rect x="264" y="384" width="166" height="28" fill="#144C2F"/>
      <rect x="264" y="384" width="166" height="3" fill="url(#goldSheen)"/>
      
      <g fill="#FFFDF0">
        <rect x="277" y="391" width="8" height="15" rx="4"/>
        <rect x="297" y="391" width="8" height="15" rx="4"/>
        <rect x="317" y="391" width="8" height="15" rx="4"/>
        <rect x="337" y="391" width="8" height="15" rx="4"/>
        <rect x="357" y="391" width="8" height="15" rx="4"/>
        <rect x="377" y="391" width="8" height="15" rx="4"/>
        <rect x="397" y="391" width="8" height="15" rx="4"/>
        <rect x="417" y="391" width="8" height="15" rx="4"/>
      </g>
      
      <rect x="262" y="410" width="170" height="4" fill="url(#goldSheen)"/>
    </g>

    
    <g id="kaaba" filter="url(#shadowFilter)">
      
      <polygon points="152,284 228,298 296,289 220,275" fill="#18241E"/>
      <polygon points="152,284 228,298 220,275" fill="#22332B" opacity="0.6"/>

      
      <polygon points="98,338 228,298 228,416 98,402" fill="#101713"/>
      
      <polygon points="228,298 296,289 296,396 228,416" fill="#0A0F0D"/>

      
      <polygon points="178,280 186,278 188,284 180,286" fill="url(#goldLight)"/>

      
      <polygon points="98,350 228,310 228,328 98,368" fill="url(#goldSheen)"/>
      <line x1="98" y1="352" x2="228" y2="312" stroke="#FFFFFF" stroke-width="1.2" opacity="0.8"/>
      <line x1="98" y1="366" x2="228" y2="326" stroke="#FFFFFF" stroke-width="1.2" opacity="0.8"/>
      
      <line x1="112" y1="357" x2="135" y2="350" stroke="#684A12" stroke-width="2.5"/>
      <line x1="145" y1="347" x2="175" y2="338" stroke="#684A12" stroke-width="2.5"/>
      <line x1="185" y1="335" x2="218" y2="325" stroke="#684A12" stroke-width="2.5"/>

      
      <polygon points="228,310 296,301 296,319 228,328" fill="url(#goldSheen)"/>
      <line x1="228" y1="312" x2="296" y2="303" stroke="#FFFFFF" stroke-width="1.2" opacity="0.8"/>
      <line x1="228" y1="326" x2="296" y2="317" stroke="#FFFFFF" stroke-width="1.2" opacity="0.8"/>
      <line x1="238" y1="318" x2="258" y2="315" stroke="#684A12" stroke-width="2.5"/>
      <line x1="268" y1="313" x2="288" y2="310" stroke="#684A12" stroke-width="2.5"/>

      
      <polygon points="176,339 216,327 216,394 176,402" fill="url(#goldLight)"/>
      
      <polygon points="179,343 213,333 213,391 179,398" fill="none" stroke="#7A5714" stroke-width="1.5"/>
      <line x1="196" y1="338" x2="196" y2="395" stroke="#7A5714" stroke-width="1.5"/>
      <rect x="183" y="350" width="10" height="4" fill="#684A12" transform="rotate(-6 183 350)"/>
      <rect x="183" y="362" width="10" height="4" fill="#684A12" transform="rotate(-6 183 362)"/>
      <rect x="183" y="374" width="10" height="4" fill="#684A12" transform="rotate(-6 183 374)"/>
      <rect x="200" y="345" width="10" height="4" fill="#684A12" transform="rotate(-6 200 345)"/>
      <rect x="200" y="357" width="10" height="4" fill="#684A12" transform="rotate(-6 200 357)"/>
      <rect x="200" y="369" width="10" height="4" fill="#684A12" transform="rotate(-6 200 369)"/>
      
      <circle cx="196" cy="382" r="2.5" fill="#3D2905"/>

      
      <path d="M 98,397 L 114,414 L 130,400 L 146,414 L 162,401 L 178,416 L 194,402 L 210,417 L 228,403 L 244,417 L 260,404 L 276,418 L 296,405 L 296,424 L 98,424 Z" fill="#FFFFFF"/>
      <path d="M 98,401 L 114,416 L 130,403 L 146,416 L 162,404 L 178,418 L 194,405 L 210,419 L 228,406 L 244,419 L 260,407 L 276,420 L 296,408" fill="none" stroke="url(#goldSheen)" stroke-width="2.5"/>
      
      <rect x="96" y="420" width="202" height="4" fill="#C5A059" opacity="0.6"/>
    </g>

    
    <path d="M 40,412 C 140,432 372,432 472,412 L 472,480 L 40,480 Z" fill="url(#emeraldRim)" opacity="0.3"/>
  </g>
</svg>`;

// 2. Maskable version with safe zone margin (80% scale centered on dark green background #0E3521)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  
  <rect width="512" height="512" fill="#0E3521"/>
  
  <g transform="translate(51.2, 51.2) scale(0.8)">
    ${masterSvg.replace(/<svg[^>]*>|<\/svg>/g, '')}
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve(__dirname, '../public');
  const distDir = path.resolve(__dirname, '../dist');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save SVGs in public
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), masterSvg.trim(), 'utf8');
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), masterSvg.trim(), 'utf8');
  console.log('Saved public/icon.svg and public/favicon.svg');

  // Also save in dist if dist exists
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'icon.svg'), masterSvg.trim(), 'utf8');
    fs.writeFileSync(path.join(distDir, 'favicon.svg'), masterSvg.trim(), 'utf8');
    console.log('Saved dist/icon.svg and dist/favicon.svg');
  }

  const svgBuffer = Buffer.from(masterSvg);
  const maskableSvgBuffer = Buffer.from(maskableSvg);

  // Generate PNGs with high quality Lanczos3 filtering
  const targets = [
    { file: 'pwa-512x512.png', size: 512, input: svgBuffer },
    { file: 'pwa-192x192.png', size: 192, input: svgBuffer },
    { file: 'apple-touch-icon.png', size: 180, input: svgBuffer },
    { file: 'favicon-32x32.png', size: 32, input: svgBuffer },
    { file: 'favicon-16x16.png', size: 16, input: svgBuffer },
    { file: 'favicon.ico', size: 48, input: svgBuffer },
    { file: 'pwa-maskable-512x512.png', size: 512, input: maskableSvgBuffer },
  ];

  for (const t of targets) {
    const outPath = path.join(publicDir, t.file);
    await sharp(t.input)
      .resize(t.size, t.size, { kernel: sharp.kernel.lanczos3 })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outPath);
    console.log(`Generated public/${t.file} (${t.size}x${t.size})`);

    if (fs.existsSync(distDir)) {
      const distOutPath = path.join(distDir, t.file);
      fs.copyFileSync(outPath, distOutPath);
    }
  }

  console.log('All icons successfully created and synchronized!');
}

main().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});

