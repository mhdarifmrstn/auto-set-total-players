import process from 'node:process'

import { cleanEnv, num, str } from 'envalid'
import 'dotenv/config'

const env = cleanEnv(process.env, {
    API_ID: num(),
    API_HASH: str(),
    SESSION: str(),
    GROUP_ID: num(),
    BOT_ID: num(),
    NIGHT_PLAYERS: num(),
    DAY_PLAYERS: num(),
})

export default env
