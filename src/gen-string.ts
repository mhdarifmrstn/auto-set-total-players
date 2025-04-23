import { TelegramClient } from '@mtcute/node'

import env from './env.js'

const tg = new TelegramClient({
    apiId: env.API_ID,
    apiHash: env.API_HASH,
})
const user = await tg.start({
    phone: () => tg.input('Phone > '),
    code: () => tg.input('Code > '),
    password: () => tg.input('Password > '),
})
console.log('Logged in as', user.displayName)
console.log(await tg.exportSession())
