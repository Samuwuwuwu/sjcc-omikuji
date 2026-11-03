import fs from 'node:fs/promises'

// Development helper only. The website serves the resulting fonts locally.
const directory = 'public/fonts'
await fs.mkdir(directory, { recursive: true })

async function sourceText(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map((entry) => entry.isDirectory()
    ? sourceText(`${directory}/${entry.name}`)
    : fs.readFile(`${directory}/${entry.name}`, 'utf8')))).join('')
}

const japanese = [...new Set((await sourceText('src')).match(/[\u3000-\u30ff\u3400-\u9fff]/gu))].join('')
const latin = Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 32)).join('') + 'ūōŪŌ…’'

for (const [family, filename, text, italic] of [
  ['Cormorant Garamond:wght@600', 'editorial-latin.woff2', latin, false],
  ['DM Sans:wght@400..600', 'interface.woff2', latin, false],
  ['Shippori Mincho', 'japanese.woff2', japanese, false],
  ['Shippori Mincho:wght@700', 'japanese-display.woff2', japanese, false],
]) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}${italic ? ':ital@1' : ''}&text=${encodeURIComponent(text)}&display=swap`
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' } })
  if (!response.ok) throw new Error(`Font stylesheet: ${response.status}`)
  const css = await response.text()
  const source = css.match(/src: url\(([^)]+)\)/)?.[1]
  if (!source) throw new Error(`No font found: ${css}`)
  const font = await fetch(source)
  if (!font.ok) throw new Error(`Font download: ${font.status}`)
  const data = new Uint8Array(await font.arrayBuffer())
  await fs.writeFile(`${directory}/${filename}`, data)
  console.log(`${filename}: ${data.length} bytes`)
}

for (const [family, slug] of [
  ['cormorant-garamond', 'cormorantgaramond'],
  ['shippori-mincho', 'shipporimincho'],
  ['dm-sans', 'dmsans'],
]) {
  const response = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${slug}/OFL.txt`)
  if (!response.ok) throw new Error(`License: ${response.status}`)
  await fs.writeFile(`${directory}/${family}-OFL.txt`, await response.text())
}
