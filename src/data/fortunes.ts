export type Fortune = {
  id: string
  japanese: string
  reading: string
  meaning: string
  message: string
  weight: number
}

export const fortunes: readonly Fortune[] = [
  {
    id: 'daikichi',
    japanese: '大吉',
    reading: 'Dai-kichi',
    meaning: 'Great blessing',
    message: 'An unexpected opportunity brings good news. A first step taken today is likely to go well.',
    weight: 15,
  },
  {
    id: 'chukichi',
    japanese: '中吉',
    reading: 'Chū-kichi',
    meaning: 'Middle blessing',
    message: 'A conversation leads somewhere promising. Accept an invitation; a new friendship may follow.',
    weight: 20,
  },
  {
    id: 'shokichi',
    japanese: '小吉',
    reading: 'Shō-kichi',
    meaning: 'Small blessing',
    message: 'A small surprise will improve your day. Something you thought you had lost may find its way back.',
    weight: 20,
  },
  {
    id: 'kichi',
    japanese: '吉',
    reading: 'Kichi',
    meaning: 'Blessing',
    message: 'Your plans are moving in a good direction. Steady effort will bring the result you are hoping for.',
    weight: 20,
  },
  {
    id: 'suekichi',
    japanese: '末吉',
    reading: 'Sue-kichi',
    meaning: 'A blessing to come',
    message: 'Good news will take a little longer to arrive. A delayed plan turns out better with a little patience.',
    weight: 15,
  },
  {
    id: 'kyo',
    japanese: '凶',
    reading: 'Kyō',
    meaning: 'Misfortune',
    message: 'A plan may meet a small setback. Avoid rushing a decision; a different approach will serve you better.',
    weight: 10,
  },
]

export function drawFortune(previousId?: string): Fortune {
  const available = fortunes.filter((fortune) => fortune.id !== previousId)
  const totalWeight = available.reduce((sum, fortune) => sum + fortune.weight, 0)
  const random = new Uint32Array(1)
  crypto.getRandomValues(random)
  let choice = (random[0] / 2 ** 32) * totalWeight

  for (const fortune of available) {
    choice -= fortune.weight
    if (choice < 0) return fortune
  }
  return available[available.length - 1]
}
