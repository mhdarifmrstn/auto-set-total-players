import type { MessageContext } from '@mtcute/dispatcher'
import type { Message } from '@mtcute/node'
import { tl } from '@mtcute/node'

import env from './env.js'

export function isNight(): boolean {
    const now = new Date()
    const utcHour = now.getUTCHours()
    const localHour = (utcHour + env.TIMEZONE_OFFSET + 24) % 24

    if (env.NIGHT_START < env.NIGHT_END) {
        return localHour >= env.NIGHT_START && localHour < env.NIGHT_END
    } else {
        return localHour >= env.NIGHT_START || localHour < env.NIGHT_END
    }
}

export function getButtons(msg: Message): tl.TypeKeyboardButton[] {
    if (msg.markup && 'type' in msg.markup) {
        if (msg.markup.type === 'inline') {
            const buttons = msg.markup.buttons.flat()
            return buttons
        }
    }
    return []
}

export async function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms))
}

export async function retryGetCallbackAnswer(msg: Omit<MessageContext, never>, data: string | Uint8Array<ArrayBufferLike>, retries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await msg.client.getCallbackAnswer({ message: msg, data })
        } catch (error) {
            const isTimeout
        = error instanceof tl.RpcError
            && error.code === 400
            && error.text === 'TIMEOUT'

            if (!isTimeout || attempt === retries) {
                throw error
            }

            console.warn(`getCallbackAnswer timeout, retrying (${attempt}/${retries})...`)
            await new Promise(res => setTimeout(res, delay))
        }
    }

    throw new Error('Unreachable code — retry logic failed unexpectedly')
}
