import { engineTypes, PLAYER_HEIGHT, PLAYER_WIDTH } from './constants'

export const getEngineString = (etype: 'S' | 'R' | 'A' | 'V' | 'P' | 'Q' | 'T') => {
  const engine = engineTypes[etype] as string | undefined
  if (engine) return engine
  return engineTypes['S']
}

export const calculatePlayerScale = () => {
  const playerScale = Math.min(window.innerWidth / PLAYER_WIDTH, window.innerHeight / PLAYER_HEIGHT)
  return playerScale
}

