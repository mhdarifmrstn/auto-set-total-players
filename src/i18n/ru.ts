import type { OtherLanguageWrap } from '@mtcute/i18n'

import type { en } from './en.js'

export const ru = {
    helloWorld: 'Привет, мир!',
} satisfies OtherLanguageWrap<typeof en>
