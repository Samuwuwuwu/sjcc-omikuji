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

function drawTiedRack(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.strokeStyle = '#8d6b56'
  ctx.lineCap = 'round'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(365, 1288)
  ctx.lineTo(365, 1176)
  ctx.moveTo(715, 1288)
  ctx.lineTo(715, 1176)
  ctx.moveTo(354, 1188)
  ctx.lineTo(726, 1188)
  ctx.stroke()
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(365, 1235)
  ctx.lineTo(715, 1235)
  ctx.stroke()
  ctx.translate(540, 1235)
  ctx.fillStyle = '#fcf9f0'
  ctx.strokeStyle = '#8e8186'
  for (const points of [
    [[-53, -21], [-6, -8], [-2, 6], [-56, -6]],
    [[3, -7], [53, 11], [47, 25], [-6, 7]],
    [[-9, -10], [10, -6], [7, 12], [-12, 7]],
  ]) {
    ctx.beginPath()
    points.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  ctx.restore()
}

/** The overall message, five predictions, and ending use local fonts without network calls. */
export async function createFortuneImage(fortune: Fortune): Promise<File> {
  const { accent, tint } = fortuneColors(fortune.id)
  const isTied = fortune.id === 'kyo'
  const japaneseText = fortune.japanese + fortune.predictions.map((prediction) => prediction.japanese).join('')
  const logo = new Image()
  logo.src = '/sakuran-logo.png'
  await Promise.all([
    document.fonts.load('600 78px "Cormorant Garamond"'),
    document.fonts.load('700 176px "Shippori Mincho"', fortune.japanese),
    document.fonts.load('400 30px "Shippori Mincho"', japaneseText),
    document.fonts.load('400 31px "DM Sans"'),
    document.fonts.load('500 24px "DM Sans"'),
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
  ctx.globalAlpha = 0.42
  ctx.beginPath()
  ctx.arc(540, 355, 205, 0, Math.PI * 2)
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

  ctx.drawImage(logo, 343, 92, 70, 70)
  ctx.fillStyle = ink
  ctx.textAlign = 'left'
  ctx.font = '500 25px "DM Sans", sans-serif'
  ctx.fillText('SPECTRUM 2026', 437, 134)
  ctx.textAlign = 'center'
  ctx.fillStyle = accent
  ctx.font = '500 24px "DM Sans", sans-serif'
  ctx.fillText(fortune.reading.toUpperCase(), 540, 191)
  ctx.font = `700 ${fortune.japanese.length === 1 ? 192 : 176}px "Shippori Mincho", serif`
  ctx.fillText(fortune.japanese, 540, 377)
  ctx.font = '600 78px "Cormorant Garamond", serif'
  ctx.fillText(fortune.meaning, 540, 463)
  ctx.fillStyle = ink
  ctx.font = '400 31px "DM Sans", sans-serif'
  const messageBottom = wrappedText(ctx, fortune.message, 540, 524, 800, 42)
  const dividerY = messageBottom + 36

  ctx.strokeStyle = accent
  ctx.globalAlpha = 0.4
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(126, dividerY)
  ctx.lineTo(954, dividerY)
  ctx.stroke()
  ctx.globalAlpha = 1

  let rowY = dividerY + 62
  ctx.textAlign = 'left'
  for (const prediction of fortune.predictions) {
    ctx.fillStyle = accent
    ctx.font = '500 24px "DM Sans", sans-serif'
    ctx.fillText(prediction.name, 126, rowY)
    ctx.font = '400 30px "Shippori Mincho", serif'
    ctx.fillText(prediction.japanese, 126, rowY + 39)
    ctx.fillStyle = ink
    ctx.font = '400 31px "DM Sans", sans-serif'
    const bottom = wrappedText(ctx, prediction.text, 340, rowY, 610, 43)
    rowY = Math.max(rowY + 113, bottom + 55)
  }

  if (isTied) drawTiedRack(ctx)
  ctx.textAlign = 'center'
  ctx.fillStyle = accent
  ctx.font = '500 26px "DM Sans", sans-serif'
  ctx.fillText('@sjccnyp', 540, 1344)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Could not create your image.')), 'image/png')
  })
  return new File([blob], `sjcc-omikuji-${fortune.id}${isTied ? '-tied' : ''}.png`, { type: 'image/png' })
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
