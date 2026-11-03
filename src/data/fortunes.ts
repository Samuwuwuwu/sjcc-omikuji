export const fortuneCategories = [
  { id: 'wishes', name: 'Wishes', japanese: '願事' },
  { id: 'studies', name: 'Studies', japanese: '学問' },
  { id: 'romance', name: 'Romance', japanese: '恋愛' },
  { id: 'lostItems', name: 'Lost items', japanese: '失せ物' },
  { id: 'travel', name: 'Travel', japanese: '旅行' },
] as const

export type CategoryId = typeof fortuneCategories[number]['id']
export type Prediction = typeof fortuneCategories[number] & { text: string }

type FortuneGrade = {
  id: string
  japanese: string
  reading: string
  meaning: string
  weight: number
  messages: readonly [string, string, ...string[]]
  predictions: Record<CategoryId, readonly [string, string, ...string[]]>
}

export type Fortune = Omit<FortuneGrade, 'predictions' | 'messages'> & { message: string; predictions: readonly Prediction[] }

export function fortuneColors(id?: string) {
  if (id === 'daikichi') return { accent: '#926120', tint: '#eddbad' }
  if (id === 'kyo') return { accent: '#4b4952', tint: '#d9d2de' }
  return { accent: '#a94332', tint: '#e4b7a2' }
}

export const fortunes: readonly FortuneGrade[] = [
  {
    id: 'daikichi', japanese: '大吉', reading: 'Dai-kichi', meaning: 'Great blessing', weight: 15,
    messages: [
      'An ordinary day has an unusually good surprise in store.',
      'Something you nearly passed over turns out to be your lucky break.',
      'The timing is on your side, especially when you say yes.',
    ],
    predictions: {
      wishes: [
        'That idea in your notes app gets an unexpected yes.',
        'A wish kept quiet finds an opening through a friend.',
        'The booth you nearly skip has exactly what you wanted.',
      ],
      studies: [
        'A topic finally clicks when you explain it to a classmate.',
        'The question you practised turns up when it matters.',
        'Your project demo works on the first try. Yes, really.',
      ],
      romance: [
        'Your crush finds a good reason to keep the chat going.',
        'A hello at Spectrum turns into a much longer conversation.',
        'Someone remembers a tiny detail you thought they missed.',
      ],
      lostItems: [
        'Your missing item is in the bag you stopped checking.',
        'A friend spots what you lost before you buy a replacement.',
        'Check your jacket pocket. Past you was oddly organised.',
      ],
      travel: [
        'An unplanned detour becomes the best part of your outing.',
        'You catch the bus just as you reach the stop.',
        'An invitation takes you somewhere worth a full camera roll.',
      ],
    },
  },
  {
    id: 'chukichi', japanese: '中吉', reading: 'Chū-kichi', meaning: 'Middle blessing', weight: 20,
    messages: [
      'A small introduction opens a surprisingly useful door.',
      'Good news arrives through someone already in your circle.',
      'Plans go better with a little help from your friends.',
    ],
    predictions: {
      wishes: [
        'A friend knows the person who can move your plan along.',
        'An invitation brings a small wish closer to happening.',
        'The slot you wanted opens up after a change of plans.',
      ],
      studies: [
        'A classmate shares an example that untangles your notes.',
        'Your group finds a useful answer in an old lecture slide.',
        'An extra rehearsal makes your presentation feel easier.',
      ],
      romance: [
        'A shared interest gives you an easy reason to message.',
        'Someone saves you a seat. Notice who it is.',
        'A group outing gives two of you a moment to talk.',
      ],
      lostItems: [
        'Ask the friend who borrowed your bag for a minute.',
        'Someone has put your lost item somewhere sensible.',
        'The lost-and-found desk has better news than expected.',
      ],
      travel: [
        'A friend suggests a place that lives up to the photos.',
        'The cheaper route leaves room in your budget for dessert.',
        'Leaving ten minutes earlier gets you the good seat.',
      ],
    },
  },
  {
    id: 'shokichi', japanese: '小吉', reading: 'Shō-kichi', meaning: 'Small blessing', weight: 20,
    messages: [
      'A tiny win lands just when the day needs one.',
      'Nothing dramatic. Just a few things going pleasantly right.',
      'A small surprise makes the usual routine more interesting.',
    ],
    predictions: {
      wishes: [
        'One small part of your plan falls neatly into place.',
        'The snack you wanted is still there when you come back.',
        'A modest request gets a quicker answer than expected.',
      ],
      studies: [
        'You spot a small mistake before it reaches the submission.',
        'One useful sentence in your notes saves a long search.',
        'A short revision session clears up one stubborn question.',
      ],
      romance: [
        'A brief conversation leaves you smiling on the way home.',
        'Someone sends a meme that is suspiciously your humour.',
        'A small compliment lands better than a rehearsed line.',
      ],
      lostItems: [
        'Check between the cushions before blaming the universe.',
        'Your missing pen has rolled just beyond the desk leg.',
        'A pocket you rarely use holds a small surprise.',
      ],
      travel: [
        'A familiar route reveals a café you had never noticed.',
        'A short outing gives you one photo you will keep.',
        'You find shade exactly when the afternoon gets too warm.',
      ],
    },
  },
  {
    id: 'kichi', japanese: '吉', reading: 'Kichi', meaning: 'Blessing', weight: 20,
    messages: [
      'A plan you have been working on begins to come together.',
      'The next step is less complicated than you expected.',
      'An ordinary effort brings a quietly satisfying result.',
    ],
    predictions: {
      wishes: [
        'A plan made in the group chat finally gets a date.',
        'A polite follow-up brings the answer you were waiting for.',
        'A wish moves forward once you ask the practical question.',
      ],
      studies: [
        'The practice question you redo becomes a familiar friend.',
        'Your group finishes on time with fewer last-minute edits.',
        'A tutor points you towards the example you actually need.',
      ],
      romance: [
        'A relaxed conversation goes further than a perfect opener.',
        'Someone you already know starts making time for you.',
        'An ordinary lunch becomes a reason to meet again.',
      ],
      lostItems: [
        'Retrace the walk from your last class, slowly this time.',
        'Look under the notebook you have been carrying all day.',
        'Your lost item turns up before the day is over.',
      ],
      travel: [
        'The route you know gets you there with time to spare.',
        'A planned outing goes smoothly once everyone confirms.',
        'Your usual stop is the right one for a good afternoon.',
      ],
    },
  },
  {
    id: 'suekichi', japanese: '末吉', reading: 'Sue-kichi', meaning: 'A blessing to come', weight: 15,
    messages: [
      'A good thing takes the scenic route before reaching you.',
      'The answer arrives later, with a detail worth waiting for.',
      'A delay makes room for a better version of your plan.',
    ],
    predictions: {
      wishes: [
        'The reply takes longer, but the invitation still arrives.',
        'A sold-out slot may reopen. Check again another day.',
        'A plan postponed this week finds a better date later.',
      ],
      studies: [
        'A confusing topic makes sense after your next tutorial.',
        'Feedback on this draft makes the next version stronger.',
        'The method that feels slow now saves time in the next task.',
      ],
      romance: [
        'A slow reply turns into a proper conversation later.',
        'A familiar face becomes more interesting over a few meetings.',
        'The right moment to ask arrives after the busy week.',
      ],
      lostItems: [
        'A forgotten item returns through someone you have not asked.',
        'It may turn up during your next proper desk clear-out.',
        'Leave your name at lost-and-found; news may come later.',
      ],
      travel: [
        'A delayed outing is better with the friend who joins later.',
        'Waiting out the rain improves the rest of your afternoon.',
        'A postponed trip finds better weather on its new date.',
      ],
    },
  },
  {
    id: 'kyo', japanese: '凶', reading: 'Kyō', meaning: 'Misfortune', weight: 10,
    messages: [
      'A small mix-up may turn a simple plan into extra admin.',
      'Something you assumed was sorted may need another look.',
      'The day has a few loose ends. Check the easily missed details.',
    ],
    predictions: {
      wishes: [
        'Your wishlist item may sell out while you compare options.',
        'A vague plan earns a vague reply. Pick an actual date.',
        'A favour gets delayed; keep a second option handy.',
      ],
      studies: [
        'A missing citation may be trickier than the hard question.',
        'The file named final may not be the final file. Check twice.',
        'A groupmate’s “almost done” may need a follow-up.',
      ],
      romance: [
        'A message may be read in a tone you did not intend.',
        'One emoji is not enough evidence for your group chat.',
        'A late reply could derail a plan; confirm before heading out.',
      ],
      lostItems: [
        'An unzipped pocket may cost you a small, useful thing.',
        'Your charger may be about to enjoy a solo library visit.',
        'The missing item is under the mess you keep moving aside.',
      ],
      travel: [
        'A familiar route may have a delay. Leave a little earlier.',
        'The wrong exit could turn a short walk into an expedition.',
        'A low battery may interrupt your directions halfway there.',
      ],
    },
  },
]

export function drawFortune(previousId?: string): Fortune {
  const available = fortunes.filter((fortune) => fortune.id !== previousId)
  const totalWeight = available.reduce((sum, fortune) => sum + fortune.weight, 0)
  const random = new Uint32Array(fortuneCategories.length + 2)
  crypto.getRandomValues(random)
  let choice = (random[0] / 2 ** 32) * totalWeight
  let selected = available[available.length - 1]

  for (const fortune of available) {
    choice -= fortune.weight
    if (choice < 0) {
      selected = fortune
      break
    }
  }

  const { predictions: options, messages, ...grade } = selected
  return {
    ...grade,
    message: messages[Math.floor((random[1] / 2 ** 32) * messages.length)],
    predictions: fortuneCategories.map((category, index) => {
      const pool = options[category.id]
      return { ...category, text: pool[Math.floor((random[index + 2] / 2 ** 32) * pool.length)] }
    }),
  }
}
