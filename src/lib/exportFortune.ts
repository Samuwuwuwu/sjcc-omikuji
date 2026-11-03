import type { Fortune } from '../data/fortunes'

const ink = '#302e29'
const vermilion = '#a94332'

function wrappedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (line && ctx.measureText(next).width > maxWidth) {
      ctx.fillText(line, x, y)
      y += lineHeight
      line = word
    } else line = next
  }
  ctx.fillText(line, x, y)
  return y
}

/** Canvas uses local fonts and primitives; export needs no screenshot library or network. */
export async function createFortuneImage(fortune: Fortune): Promise<File> {
  const logo = new Image()
  logo.src = '/sakuran-logo.png'
  await Promise.all([
    document.fonts.load('400 64px "Cormorant Garamond"'),
    document.fonts.load(`400 180px "Shippori Mincho"`, fortune.japanese),
    document.fonts.load('400 34px "DM Sans"'),
    logo.decode(),
  ])

  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1440
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Image export is unavailable in this browser.')

  ctx.fillStyle = '#f4f0e7'
  ctx.fillRect(0, 0, 1080, 1440)

  // Deterministic paper flecks keep the keepsake tactile at full resolution.
  let seed = 26
  for (let i = 0; i < 24000; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    const x = (seed / 2 ** 32) * 1080
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    const y = (seed / 2 ** 32) * 1440
    ctx.fillStyle = i % 2 ? '#66513309' : '#ffffff65'
    ctx.fillRect(x, y, 1.4, 1.4)
  }

  ctx.strokeStyle = vermilion
  ctx.lineWidth = 2
  ctx.strokeRect(54, 54, 972, 1332)
  ctx.strokeRect(65, 65, 950, 1310)
  ctx.textAlign = 'center'
  ctx.fillStyle = ink
  ctx.font = '500 24px "DM Sans", sans-serif'
  ctx.fillText('SPECTRUM 2026', 540, 137)
  ctx.strokeStyle = '#a9433240'
  ctx.beginPath()
  ctx.moveTo(132, 183)
  ctx.lineTo(948, 183)
  ctx.stroke()

  ctx.fillStyle = vermilion
  ctx.font = '400 28px "Cormorant Garamond", serif'
  ctx.fillText(fortune.reading.toUpperCase(), 540, 288)
  ctx.font = '400 200px "Shippori Mincho", serif'
  ctx.fillText(fortune.japanese, 540, 520)
  ctx.fillStyle = ink
  ctx.font = '400 66px "Cormorant Garamond", serif'
  ctx.fillText(fortune.meaning, 540, 642)

  ctx.strokeStyle = '#a9433260'
  ctx.beginPath()
  ctx.moveTo(390, 713)
  ctx.lineTo(690, 713)
  ctx.stroke()
  ctx.font = '400 34px "DM Sans", sans-serif'
  wrappedText(ctx, fortune.message, 540, 808, 700, 54)

  ctx.drawImage(logo, 484, 1200, 112, 112)
  ctx.fillStyle = '#625c52'
  ctx.font = '400 22px "DM Sans", sans-serif'
  ctx.fillText('@sjccnyp', 540, 1340)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Could not create your image.')), 'image/png')
  })

  return new File([blob], `sjcc-omikuji-${fortune.id}.png`, { type: 'image/png' })
}

export function downloadFortune(file: File): void {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  document.body.append(link)
  link.click()
  link.remove()
  // Keep the object alive long enough for Safari to consume the download.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

/** The file is prepared during the reveal, so share() retains the tap's user activation. */
export async function shareFortune(file: File): Promise<'shared' | 'downloaded' | 'cancelled'> {
  if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
    downloadFortune(file)
    return 'downloaded'
  }

  try {
    await navigator.share({
      files: [file],
      title: 'Spectrum 2026 · Omikuji',
      text: 'My omikuji at Spectrum 2026. @sjccnyp',
    })
    return 'shared'
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
    downloadFortune(file)
    return 'downloaded'
  }
}
