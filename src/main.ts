import { Dispatcher, filters } from '@mtcute/dispatcher'
import { TelegramClient } from '@mtcute/node'

import * as env from './env.js'
import { tr } from './i18n/index.js'

const tg = new TelegramClient({
    apiId: env.API_ID,
    apiHash: env.API_HASH,
    storage: 'bot-data/session',
})

const dp = Dispatcher.for(tg)

dp.onNewMessage(filters.start, async (msg) => {
    await msg.answerText(tr(msg, 'helloWorld'))
})

const user = await tg.start()
console.log('Logged in as', user.username)
