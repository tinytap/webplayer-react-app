import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { calculatePlayerScale } from '../utils/tt-utils'
import { useGameStore } from './gameStore'
import { useActivitiesStore } from './activitiesStore'

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
  tempMuteBackgroundMusic: () => () => void
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
      partialize: ({}: PlayerState) => ({}), // eslint-disable-line
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
      set((state: PlayerState) => {
        const selectedSlide = useGameStore.getState().selectedSlideIndex || 0

        const startActivity = useActivitiesStore.getState().startActivity
        const pauseActivity = useActivitiesStore.getState().pauseActivity

        if (openState) {
          pauseActivity(selectedSlide)
        } else {
          startActivity(selectedSlide)
        }
        return {
          menuOpen: openState,
        }
      }),

    updatePlayerScale: () =>
      set(() => ({
        scale: calculatePlayerScale(),
      })),

    setGameStarted: (gameStartState: boolean) =>
      set((state: PlayerState) => {
        const selectedSlideIndex = useGameStore.getState().selectedSlideIndex || 0
        const startActivity = useActivitiesStore.getState().startActivity
        const pauseActivity = useActivitiesStore.getState().pauseActivity

        if (gameStartState) {
          console.log('gameStarted | selectedSlide:', selectedSlideIndex)
          startActivity(selectedSlideIndex)
        } else {
          console.log('slidePaused | selectedSlide:', selectedSlideIndex)
          pauseActivity(selectedSlideIndex)
        }
        return { gameStarted: gameStartState }
      }),
    setBackgroundMusicPlayState: (playingState: boolean) =>
      set(() => ({
        backgroundMusicPlaying: playingState,
      })),
    setBackgroundMusicMute: (muteState: boolean) =>
      set(() => ({
        backgroundMusicMuted: muteState,
      })),
    tempMuteBackgroundMusic: () => {
      const oldValue = get().backgroundMusicMuted
      set(() => ({
        backgroundMusicMuted: true,
      }))

      return () => {
        set(() => ({
          backgroundMusicMuted: oldValue,
        }))
      }
    },
    setIsLoading: (loadingState: boolean) =>
      set(() => ({
        isLoading: loadingState,
      })),
  })),
)

