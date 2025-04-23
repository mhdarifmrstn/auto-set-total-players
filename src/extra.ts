import type { Message, tl } from '@mtcute/node'

export function isNight(): boolean {
    const now = new Date()
    const utcHour = now.getUTCHours()
    const wibHour = (utcHour + 7) % 24

    return wibHour >= 1 && wibHour < 9
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
