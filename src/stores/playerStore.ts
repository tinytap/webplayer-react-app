import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { getGameId, getStructureFilePath } from '../utils'
import { calculatePlayerScale } from '../utils/tt-utils'

interface PlayerState {
  isLoading: boolean
  gameStarted: boolean
  backgroundMusicPlaying: boolean
  backgroundMusicMuted: boolean
  scale: number
  menuOpen: boolean
  setMenuOpenState: (openState: boolean) => void
  setBackgroundMusicPlayState: (playingState: boolean) => void
  setBackgroundMusicMute: (muteState: boolean) => void
  setGameStarted: (gameStartState: boolean) => void
  setIsLoading: (loadingState: boolean) => void
  updatePlayerScale: () => void
}
const STORAGE_NAME = 'mainPlayerState'
const devMiddlewares = (f: any) =>
  devtools(
    persist(f, {
      name: STORAGE_NAME,
      getStorage: () => sessionStorage, // Use the browser's session storage
      partialize: ({}: /*isLoading*/ PlayerState) => ({
        //isLoading,
      }),
    }),
  ) as any

export const usePlayerStore = create<PlayerState>()(
  devMiddlewares((set: any, get: any) => ({
    isLoading: true,
    gameStarted: false,
    backgroundMusicPlaying: false,
    backgroundMusicMuted: false,
    scale: calculatePlayerScale(),
    menuOpen: false,

    setMenuOpenState: (openState: boolean) =>
      set(() => ({
        menuOpen: openState,
      })),
    updatePlayerScale: () =>
      set(() => ({
        scale: calculatePlayerScale(),
      })),
    setGameStarted: (gameStartState: boolean) =>
      set(() => ({
        gameStarted: gameStartState,
      })),
    setBackgroundMusicPlayState: (playingState: boolean) =>
      set(() => ({
        backgroundMusicPlaying: playingState,
      })),
    setBackgroundMusicMute: (muteState: boolean) =>
      set(() => ({
        backgroundMusicMuted: muteState,
      })),
    setIsLoading: (loadingState: boolean) =>
      set(() => ({
        isLoading: loadingState,
      })),
  })),
)

