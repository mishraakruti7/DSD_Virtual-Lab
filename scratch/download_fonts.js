import fs from 'node:fs';
import path from 'node:path';

async function downloadFonts() {
  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

  const cssUrl =
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;600&family=Bricolage+Grotesque:wght@700;800&display=swap';

  const res = await fetch(cssUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  const css = await res.text();

  const blocks = css.split('@font-face').slice(1);
  let localCss = '/* Self-hosted subset fonts (Latin) */\n';

  for (const block of blocks) {
    if (!block.includes('/* latin */') && !block.includes('unicode-range: U+0000-00FF')) continue;
    const familyMatch = block.match(/font-family:\s*['"]?([^'";]+)/);
    const weightMatch = block.match(/font-weight:\s*([^;]+)/);
    const styleMatch = block.match(/font-style:\s*([^;]+)/);
    const urlMatch = block.match(/url\((https:[^)]+\.woff2)\)/);

    if (familyMatch && weightMatch && urlMatch) {
      const family = familyMatch[1].trim();
      const weight = weightMatch[1].trim();
      const style = styleMatch ? styleMatch[1].trim() : 'normal';
      const remoteUrl = urlMatch[1];
      const safeFamily = family.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `${safeFamily}-${weight}-${style}.woff2`;
      const filePath = path.join(fontsDir, filename);

      console.log('Downloading', filename, 'from', remoteUrl);
      const fontRes = await fetch(remoteUrl);
      const buffer = Buffer.from(await fontRes.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      localCss += `@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('/fonts/${filename}') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`;
    }
  }

  fs.writeFileSync(path.join(fontsDir, 'fonts.css'), localCss);
  console.log('Fonts downloaded successfully, generated public/fonts/fonts.css');
}

downloadFonts().catch((err) => {
  console.error(err);
  process.exit(1);
});
