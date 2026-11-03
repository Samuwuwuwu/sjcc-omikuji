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
      'You walk in expecting a no and leave with a yes.',
      'The thing you almost gave up on turns around spectacularly.',
      'For once, the best-case scenario might actually happen.',
    ],
    predictions: {
      wishes: [
        'The email you were afraid to open contains the word "congratulations".',
        'You get picked for something you applied for on a whim.',
        'Someone offers you exactly what you were working up the courage to ask for.',
      ],
      studies: [
        'Your project demo works on the first try. Yes, really.',
        'Your efforts bring recognition beyond what you expected.',
        'A difficult challenge becomes the achievement you are proudest of.',
      ],
      romance: [
        'The person you keep making excuses to see starts making excuses to see you.',
        'You find out the feeling was never one-sided.',
        'Someone tells you something you have secretly wanted to hear for a long time.',
      ],
      lostItems: [
        'Your missing item is in the bag you stopped checking.',
        'A friend spots what you lost before you buy a replacement.',
        'A stranger returns something valuable you thought was gone for good.',
        'An old keepsake resurfaces in a place nobody has checked for years.',
        'The thing you were ready to replace turns up, completely unharmed.',
      ],
      travel: [
        'A trip you almost cancel becomes the story you keep telling.',
        'That place you have saved for years finally becomes a booked ticket.',
        'You end up somewhere nobody planned to go, and nobody wants to leave.',
      ],
    },
  },
  {
    id: 'chukichi', japanese: '中吉', reading: 'Chū-kichi', meaning: 'Middle blessing', weight: 20,
    messages: [
      'Someone has good news for you. It might come up casually.',
      'A chance encounter turns out to be surprisingly important.',
      'The next invitation you receive could be worth saying yes to.',
    ],
    predictions: {
      wishes: [
        'A friend has exactly the spare ticket you were looking for.',
        'A plan that kept falling apart finally gets everyone on board.',
        'Someone remembers what you wanted and offers to help.',
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
        'A friend sends you a photo with the message, "Is this yours?"',
        'Someone in the group chat remembers where you left it.',
        'The lost-and-found counter actually has what you are looking for.',
      ],
      travel: [
        'A friend suggests a place that lives up to the hype.',
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
        'Someone agrees to a small favour before you finish explaining.',
      ],
      studies: [
        'You spot a small mistake before it reaches the submission.',
        'One useful sentence in your notes saves a long search.',
        'You notice the typo just before hitting submit.',
        'The answer was on the slide you almost skipped.',
        'Your tutorial ends five minutes early. A gift from the universe.',
      ],
      romance: [
        'A brief conversation leaves you smiling on the way home.',
        'Someone sends a meme that is suspiciously your humour.',
        'They laugh at the joke you almost decided not to send.',
        'A brief conversation leaves you smiling on the way home.',
      ],
      lostItems: [
        'Check between the cushions before blaming the universe.',
        'Your missing pen has rolled just beyond the desk leg.',
        'A pocket you rarely use holds a small surprise.',
      ],
      travel: [
        'You catch the bus just as you reach the stop.',
        'The rain starts exactly after you get indoors.',
        'You get the window seat without even asking.',
      ],
    },
  },
  {
    id: 'kichi', japanese: '吉', reading: 'Kichi', meaning: 'Blessing', weight: 20,
    messages: [
      'The plan works because you did the boring part properly.',
      'You finally get something done that has been sitting on your mind.',
      'Things go the way they are supposed to. Enjoy the rare occasion.',
    ],
    predictions: {
      wishes: [
        'You ask clearly, and the answer is yes.',
        'That plan in your notes finally makes it onto the calendar.',
        'A follow-up message gets you the answer you needed.',
      ],
      studies: [
        'You recognise the question because you actually revised it.',
        'Your group submits everything before midnight for once.',
        'The feedback points out exactly what you were hoping had improved.',
      ],
      romance: [
        'A relaxed conversation goes further than a perfect opener.',
        'Someone you already know starts making time for you.',
        'An ordinary lunch becomes a reason to meet again.',
      ],
      lostItems: [
        'The item is where you last used it, not where you assumed it was.',
        'Retrace your steps. The second place you check is the right one.',
        'Your charger is still plugged in where you left it.',
      ],
      travel: [
        'You reach your destination with enough time to wander around.',
        'Everyone shows up on time. Even the friend who is always late.',
        'The route you planned gets you there without any surprises.',
      ],
    },
  },
  {
    id: 'suekichi', japanese: '末吉', reading: 'Sue-kichi', meaning: 'A blessing to come', weight: 15,
    messages: [
      'The answer is late, but it is a yes.',
      'The first attempt is awkward. The second makes up for it.',
      'Your plans take a detour before arriving somewhere better.',
    ],
    predictions: {
      wishes: [
        'A sold-out slot may reopen. Check again another day.',
        'A plan postponed this week finds a better date later.',
        'You get turned down once, then hear back from somewhere better.',
        'The thing you have been saving for goes on sale right after you decide to wait.',
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
      'The easy way out has a catch. Read the small print.',
      'A rushed decision becomes tomorrow\'s problem.',
      'Today has a talent for exposing things you forgot to double-check.',
    ],
    predictions: {
      wishes: [
        'The thing you wanted sells out while it is still in your cart.',
        'A plan you were counting on falls through at the last minute.',
        'An offer sounds much better before you read the conditions.',
      ],
      studies: [
        'The file named final may not be the final file. Check twice.',
        'The one question you skipped comes back worth ten marks.',
        'The groupmate who has the latest version suddenly goes offline.',
        'The file named final may not be the final file. Check twice.',
        'A groupmate’s “almost done” may need a follow-up.',
      ],
      romance: [
        'You spend twenty minutes decoding a reply that meant exactly what it said.',
        'A message meant for one person finds its way into the wrong chat.',
        'You mistake politeness for a promise and make plans too soon.',
        'One emoji is not enough evidence for your group chat.',
      ],
      lostItems: [
        'An unzipped pocket may cost you a small, useful thing.',
        'Your charger may be about to enjoy a solo library visit.',
        'Someone says, "I put it somewhere safe," and cannot remember where.',
        'The thing you lent to someone has apparently been lent to someone else.',
      ],
      travel: [
        'You board the right bus going in the wrong direction.',
        'The rain starts the moment you realise you left your umbrella behind.',
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
