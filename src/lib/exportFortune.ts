import type { Fortune } from '../data/fortunes'
import { fortuneColors } from '../data/fortunes'

const ink = '#302e29'

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
  const { accent, tint } = fortuneColors(fortune.id)
  const logo = new Image()
  logo.src = '/sakuran-logo.png'
  await Promise.all([
    document.fonts.load('600 132px "Cormorant Garamond"'),
    document.fonts.load(`700 304px "Shippori Mincho"`, fortune.japanese),
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

  ctx.fillStyle = tint
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  ctx.arc(540, 505, 320, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.strokeStyle = accent
  ctx.lineWidth = 3
  ctx.strokeRect(55, 55, 970, 1330)
  for (const [x, y] of [[55, 55], [1025, 1385]]) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(Math.PI / 4)
    ctx.fillStyle = accent
    ctx.fillRect(-10, -10, 20, 20)
    ctx.restore()
  }

  ctx.drawImage(logo, 343, 106, 70, 70)
  ctx.fillStyle = ink
  ctx.textAlign = 'left'
  ctx.font = '500 25px "DM Sans", sans-serif'
  ctx.fillText('SPECTRUM 2026', 437, 148)

  ctx.textAlign = 'center'
  ctx.fillStyle = accent
  ctx.font = '500 27px "DM Sans", sans-serif'
  ctx.fillText(fortune.reading.toUpperCase(), 540, 291)
  ctx.font = `700 ${fortune.japanese.length === 1 ? 352 : 304}px "Shippori Mincho", serif`
  ctx.fillText(fortune.japanese, 540, 628)
  ctx.font = '600 132px "Cormorant Garamond", serif'
  const meaningBottom = wrappedText(ctx, fortune.meaning, 540, 790, 800, 118)

  const dividerY = meaningBottom + 62
  ctx.strokeStyle = accent
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(372, dividerY)
  ctx.lineTo(500, dividerY)
  ctx.moveTo(580, dividerY)
  ctx.lineTo(708, dividerY)
  ctx.stroke()
  ctx.globalAlpha = 1
  ctx.save()
  ctx.translate(540, dividerY)
  ctx.rotate(Math.PI / 4)
  ctx.fillRect(-8, -8, 16, 16)
  ctx.restore()

  ctx.fillStyle = ink
  ctx.font = '400 38px "DM Sans", sans-serif'
  wrappedText(ctx, fortune.message, 540, dividerY + 84, 780, 57)

  ctx.fillStyle = accent
  ctx.font = '500 26px "DM Sans", sans-serif'
  ctx.fillText('@sjccnyp', 540, 1318)

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
