import type { Fortune } from '../data/fortunes'
import { fortuneColors } from '../data/fortunes'

const ink = '#302e29'

function textLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line)
      line = word
    } else line = next
  }
  lines.push(line)
  return lines
}

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

/** A self-contained Story: the image carries its branding even when captions are dropped. */
export async function createFortuneImage(fortune: Fortune): Promise<File> {
  const { accent, tint } = fortuneColors(fortune.id)
  const isTied = fortune.id === 'kyo'
  const logo = new Image()
  logo.src = '/sakuran-logo.png'
  await Promise.all([
    document.fonts.load('600 96px "Cormorant Garamond"'),
    document.fonts.load('700 244px "Shippori Mincho"', fortune.japanese),
    document.fonts.load('400 30px "Shippori Mincho"', fortune.predictions.map(p => p.japanese).join('')),
    document.fonts.load('400 34px "DM Sans"'),
    document.fonts.load('500 24px "DM Sans"'),
    logo.decode(),
  ])

  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Image export is unavailable in this browser.')

  ctx.fillStyle = '#f4f0e7'
  ctx.fillRect(0, 0, 1080, 1920)
  ctx.fillStyle = '#fcf9f0'
  ctx.fillRect(64, 164, 952, 1592)
  ctx.fillStyle = tint
  ctx.globalAlpha = 0.42
  ctx.beginPath()
  ctx.arc(540, 525, 244, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.strokeStyle = accent
  ctx.lineWidth = 2.5
  ctx.strokeRect(64, 164, 952, 1592)
  for (const [x, y] of [[64, 164], [1016, 1756]]) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(Math.PI / 4)
    ctx.fillStyle = accent
    ctx.fillRect(-9, -9, 18, 18)
    ctx.restore()
  }

  ctx.font = '500 24px "DM Sans", sans-serif'
  const brand = 'SJCC / SPECTRUM 2026'
  const brandWidth = ctx.measureText(brand).width
  const brandLeft = (1080 - brandWidth - 82) / 2
  ctx.drawImage(logo, brandLeft, 200, 64, 64)
  ctx.fillStyle = ink
  ctx.textAlign = 'left'
  ctx.fillText(brand, brandLeft + 82, 240)

  ctx.textAlign = 'center'
  ctx.fillStyle = accent
  ctx.font = '500 25px "DM Sans", sans-serif'
  ctx.fillText(fortune.reading.toUpperCase(), 540, 354)
  ctx.font = '700 ' + (fortune.japanese.length === 1 ? 264 : 244) + 'px "Shippori Mincho", serif'
  ctx.fillText(fortune.japanese, 540, 620)
  let meaningSize = 96
  ctx.font = '600 ' + meaningSize + 'px "Cormorant Garamond", serif'
  while (ctx.measureText(fortune.meaning).width > 812 && meaningSize > 72) {
    meaningSize -= 2
    ctx.font = '600 ' + meaningSize + 'px "Cormorant Garamond", serif'
  }
  ctx.fillText(fortune.meaning, 540, 730)
  ctx.fillStyle = ink
  ctx.font = '400 34px "DM Sans", sans-serif'
  const messageBottom = wrappedText(ctx, fortune.message, 540, 800, 790, 46)
  const dividerY = messageBottom + 40
  ctx.strokeStyle = accent
  ctx.globalAlpha = 0.4
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(128, dividerY)
  ctx.lineTo(952, dividerY)
  ctx.stroke()
  ctx.globalAlpha = 1

  const rowsTop = dividerY + 46
  const rowsBottom = isTied ? 1512 : 1580
  let predictionSize = 34
  const plan = () => {
    ctx.font = '400 ' + predictionSize + 'px "DM Sans", sans-serif'
    const lineHeight = Math.round(predictionSize * 1.38)
    const rows = fortune.predictions.map(prediction => {
      const lines = textLines(ctx, prediction.text, 612)
      return { prediction, lines, height: Math.max(92, Math.max(lines.length * lineHeight, 66) + 24) }
    })
    return { rows, lineHeight, height: rows.reduce((sum, row) => sum + row.height, 0) }
  }
  let layout = plan()
  while (layout.height > rowsBottom - rowsTop && predictionSize > 24) {
    predictionSize -= 1
    layout = plan()
  }
  const breathingRoom = Math.max(0, Math.min(12, (rowsBottom - rowsTop - layout.height) / layout.rows.length))
  let rowTop = rowsTop
  ctx.textAlign = 'left'
  for (const { prediction, lines, height } of layout.rows) {
    const baseline = rowTop + predictionSize
    ctx.fillStyle = accent
    ctx.font = '500 24px "DM Sans", sans-serif'
    ctx.fillText(prediction.name, 128, baseline)
    ctx.font = '400 30px "Shippori Mincho", serif'
    ctx.fillText(prediction.japanese, 128, baseline + 39)
    ctx.fillStyle = ink
    ctx.font = '400 ' + predictionSize + 'px "DM Sans", sans-serif'
    lines.forEach((line, index) => ctx.fillText(line, 340, baseline + index * layout.lineHeight))
    rowTop += height + breathingRoom
  }

  if (isTied) {
    ctx.save()
    ctx.translate(0, 350)
    drawTiedRack(ctx)
    ctx.restore()
  }
  ctx.textAlign = 'center'
  ctx.fillStyle = accent
  ctx.font = '500 30px "DM Sans", sans-serif'
  ctx.fillText('@sjccnyp', 540, 1664)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Could not create your image.')), 'image/png')
  })
  return new File([blob], 'sjcc-omikuji-' + fortune.id + (isTied ? '-tied' : '') + '.png', { type: 'image/png' })
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
  let supported = false
  try { supported = typeof navigator.share === 'function' && !!navigator.canShare?.({ files: [file] }) } catch { /* Save is still available. */ }
  if (!supported) {
    downloadFortune(file)
    return 'downloaded'
  }
  try {
    await navigator.share({
      files: [file],
      title: 'My omikuji · SJCC Spectrum 2026',
    })
    return 'shared'
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
    downloadFortune(file)
    return 'downloaded'
  }
}
