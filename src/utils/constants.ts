import { getServerBase, getStaticServerBase, getStaticSoundPath } from './service-utils'

export const playerColors = {
  cyan: '#61c2e9',
  lightCyan: '#81ceed',
  white: '#fff',
  rightAnswerGrean: '#79c843',
  rightAnswerGrey: '#33333388',
}

export const textColors = {
  cyan: '#28c0ff',
  white: '#fff',
}
export type SLIDE_ENGINE = 'S' //slide
export type READING_ENGINE = 'R' //reading
export type SOUNDBOARD_ENGINE = 'A' //soundboard
export type VIDEO_ENGINE = 'V' //video
export type PUZZLE_ENGINE = 'P' //puzzle
export type QUESTIONS_ENGINE = 'Q' //puzzle
export type TEXTINPUT_ENGINE = 'T' //text input

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

export const SHAKE_SPEED_MS = 400
export const SHOW_HINT_TIME_S = 2
export const SHOW_HINTS_QUESTIONS_ACTIVITY = true
export const PLAY_ACTIVITY_SOUND_AGAIN_TIME_S = 30
export const PUZZLE_OFFSET_SHAPE_DETECT_PX = 40