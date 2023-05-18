import { getServerBase, getStaticServerBase, getStaticSoundPath } from './service-utils'

export const playerColors = {
    cyan: '#61c2e9',
    lightCyan: '#81ceed',
    white: '#fff',
}

export const textColors = {
    cyan: '#28c0ff',
    white: '#fff',
}
const SLIDE_ENGINE = 'S' //slide
const READING_ENGINE = 'R' //reading
const SOUNDBOARD_ENGINE = 'A' //soundboard
const VIDEO_ENGINE = 'V' //video
const PUZZLE_ENGINE = 'P' //puzzle
const QUESTIONS_ENGINE = 'Q' //puzzle
const TEXTINPUT_ENGINE = 'T' //text input

export const engineTypes = {
    S: 'slide',
    R: 'reading',
    A: 'soundboard',
    V: 'video',
    P: 'puzzle',
    Q: 'questions',
    T: 'text input',
}

export const SERVER_BASE = getServerBase()
export const STATIC_BASE = getStaticServerBase()
export const STATIC_SOUNDS_BASE = getStaticSoundPath()

export const PLAYER_WIDTH = 1024
export const PLAYER_HEIGHT = 768

export const BG_MUSIC_VOLUME = 0.04
export const SIDEMENU_WIDTH = 276

