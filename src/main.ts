import process from 'node:process'

import { Dispatcher, filters } from '@mtcute/dispatcher'
import { TelegramClient } from '@mtcute/node'

import env from './env.js'
import { getButtons, isNight, retryGetCallbackAnswer, sleep } from './extra.js'
import { tr } from './i18n/index.js'

const tg = new TelegramClient({
    apiId: env.API_ID,
    apiHash: env.API_HASH,
    storage: 'bot-data/session',
})

const dp = Dispatcher.for(tg)
const delay = 1000
const timeout = 30000

dp.onNewMessage(filters.userId(env.BOT_ID), async (msg) => {
    const configText = tr(msg, 'configText').toString()

    if (msg.text.includes(configText)) {
        const buttons = getButtons(msg)
        const cbButtons = buttons.filter(b => b._ === 'keyboardButtonCallback')
        const maxPlayerSectionText = tr(msg, 'maxPlayersSection').toString()
        const maxPlayerButton = cbButtons.find(b => b.text.includes(maxPlayerSectionText))

        if (!maxPlayerButton) {
            throw new Error('Max player button is not found')
        }
        await sleep(delay)
        await retryGetCallbackAnswer(msg, maxPlayerButton.data)
    }
})
dp.onEditMessage(filters.userId(env.BOT_ID), async (msg) => {
    const maxPlayerText = tr(msg, 'maxPlayersText').toString()

    if (msg.text.includes(maxPlayerText)) {
        const maxPlayers = isNight() ? env.NIGHT_PLAYERS : env.DAY_PLAYERS
        const buttons = getButtons(msg)
        const cbButtons = buttons.filter(b => b._ === 'keyboardButtonCallback')
        const newMaxPlayersButton = cbButtons.find(b => b.text.includes(String(maxPlayers)))

        if (!newMaxPlayersButton) {
            throw new Error(`${maxPlayers} total players button is not found`)
        }
        await sleep(delay)
        const answer = await retryGetCallbackAnswer(msg, newMaxPlayersButton.data)
        console.log(answer)
        process.exit()
    }
})

const user = await tg.start({ session: env.SESSION })
console.log('Logged in as', user.displayName)
const msg = await tg.sendText(env.GROUP_ID, '/config@astarothrobot')
await sleep(delay)
await tg.deleteMessages([msg])

setTimeout(() => process.exit(), timeout)
