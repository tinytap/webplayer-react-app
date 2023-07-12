import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { getGameId, getStructureFilePath } from '../utils'
import { GameStore, Slide } from './gameStoreTypes'
import { useActivitiesStore } from './activitiesStore'
import { ActivityState } from './activitiesStoreTypes'

const STORAGE_NAME = 'localGameStore' + getGameId()
// const devMiddlewares = (f: any) => devtools(f) as any
const devMiddlewaresPersist = (f: any) =>
  devtools(
    persist(f, {
      name: STORAGE_NAME,
      getStorage: () => sessionStorage, // Use the browser's session storage
      partialize: ({ base_url, slides, music, pk, shuffleType, album, author, settings }: GameStore) => ({
        base_url,
        slides,
        album,
        author,
        music,
        pk,
        shuffleType,
        settings,
      }),
    }),
  ) as any

const defaultActivityState: ActivityState = {
  started: false,
  paused: true,
  completed: false,
  score: 0,
  maxScore: 100,
  userScore: 0,
  userMaxScore: 100,
  userScorePercentage: 0,
  engineType: 'S',
}

export const useGameStore = create<GameStore>()(
  devMiddlewaresPersist((set: any, get: any) => ({
    loading: false,
    transitionLoading: false,
    gameReady: false,
    selectedSlide: undefined,
    selectedSlideIndex: undefined,
    lastSelectedSlideIndex: 0,
    lastSelectedSlide: {},
    slides: [],
    album: undefined,
    author: undefined,
    isLastSlide: false,
    isFirstSlide: false,
    settings: {},
    refreshSelectedSlide: () => {
      /*
      set((state: GameStore) => {
        const usePlayerStoreState = usePlayerStore.getState()
        console.log(usePlayerStoreState, 'usePlayerStoreState')
        const selectedSlideIndex = state.selectedSlideIndex || 0
        const activities = useActivitiesStore.getState().activities
        activities[selectedSlideIndex] = { ...defaultActivityState, started: true }
        return { ...state, activities }
      })*/
    },
    setTransitionLoading: (state: boolean) => {
      set({ transitionLoading: state })
    },
    retrieveGameStructure: async () => {
      const currentSlides = get().slides
      if (currentSlides && currentSlides.length) {
        const useActivitiesStoreState = useActivitiesStore.getState()
        const gameActivities = currentSlides.map((slide: any) => {
          return {
            ...defaultActivityState,
            activities: slide.activities,
            engineType: slide.engineType,
          }
        })
        useActivitiesStoreState.setActivities(gameActivities)
        set({
          slides: currentSlides,
          selectedSlideIndex: 0,
          lastSelectedSlideIndex: 0,
          lastSelectedSlide: currentSlides[0],
          isLastSlide: false,
          isFirstSlide: true,
          selectedSlide: currentSlides[0],
          gameReady: true,
        })
      } else {
        const structureFilePath = getStructureFilePath()
        const game = await (await fetch(structureFilePath)).json().then((response) => {
          if (response.data) {
            window.gameId = response.data.pk
            return response.data
          } else if (response.structure) {
            window.gameId = response.structure.pk
            return response
          }
          window.gameId = response.pk
          return response
        })

        const {
          structure: { slides, musicFile: music, shuffleType, pk, settings },
          base_url,
          album_store,
        } = game

        let author = {} as any
        let ready = false
        let age_group_text = null
        let cover_color = null
        let cover_image = null
        let share_image = null
        let unique_id = null
        let structure_json = null
        let description = null
        let name = null
        let link = null
        let categories_urls = null

        if (album_store) {
          const { album } = album_store
          author = album.fields.author
          ready = album.fields.ready
          age_group_text = album.fields.age_group_text
          cover_color = album.fields.cover_color
          cover_image = album.fields.cover_image
          share_image = album.fields.share_image
          unique_id = album.fields.unique_id
          structure_json = album.fields.structure_json
          description = album.fields.description
          name = album.fields.name
          link = album.fields.link
          categories_urls = album.fields.categories_urls
        }

        const { username, picture, first_name, last_name, bio, cover_photo, user_pk, id, certified, referral_code } =
          author

        //console.log('got structure:', { ...game })

        const useActivitiesStoreState = useActivitiesStore.getState()
        const gameActivities = currentSlides.map((slide: any) => {
          return {
            ...defaultActivityState,
            activities: slide.activities,
            engineType: slide.engineType,
          }
        })

        useActivitiesStoreState.setActivities(gameActivities)

        set({
          base_url,
          slides,
          music,
          shuffleType,
          pk,
          settings,
          lastSelectedSlideIndex: 0,
          selectedSlideIndex: 0,
          isLastSlide: false,
          isFirstSlide: true,
          lastSelectedSlide: slides[0],
          selectedSlide: slides[0],
          gameReady: true,
          album: {
            ready,
            age_group_text,
            cover_color,
            cover_image,
            share_image,
            unique_id,
            structure_json,
            description,
            name,
            link,
            categories_urls: categories_urls,
          },
          author: {
            username,
            picture,
            first_name,
            last_name,
            bio,
            cover_photo,
            user_pk,
            id,
            certified,
            referral_code,
          },
        })
      }
    },
    setSlides: (slides: Slide[]) => set((/*state*/) => ({ slides: slides })),
    selectSlideIndex: (slideIndex: number, paused: boolean = false) =>
      set((state: GameStore) => {
        if (state.transitionLoading) {
          return { ...state }
        }
        const isLastSlide = state.slides && slideIndex === state.slides.length - 1
        const isFirstSlide = slideIndex === 0
        useActivitiesStore.getState().pauseActivity(state?.selectedSlideIndex ? state.selectedSlideIndex : 0)
        if (paused) {
          useActivitiesStore.getState().pauseActivity(slideIndex)
        } else {
          useActivitiesStore.getState().startActivity(slideIndex)
        }
        return {
          lastSelectedSlideIndex: state.selectedSlideIndex,
          lastSelectedSlide: state.selectedSlide,
          selectedSlideIndex: slideIndex,
          selectedSlide: state.slides ? state.slides[slideIndex] : undefined,
          isLastSlide,
          isFirstSlide,
          transitionLoading: true,
        }
      }),
    selectSlide: (slide: Slide, paused: boolean = false) =>
      set((state: GameStore) => {
        if (state.transitionLoading) {
          return { ...state }
        }
        const slideIndex = state.slides ? state.slides.findIndex((x: any) => x.pk === slide.pk) : 0
        const isLastSlide = state.slides && slideIndex === state.slides.length - 1
        const isFirstSlide = slideIndex === 0

        useActivitiesStore.getState().pauseActivity(state?.selectedSlideIndex ? state.selectedSlideIndex : 0)
        if (paused) {
          useActivitiesStore.getState().pauseActivity(slideIndex)
        } else {
          useActivitiesStore.getState().startActivity(slideIndex)
        }
        return {
          lastSelectedSlideIndex: state.selectedSlideIndex,
          lastSelectedSlide: state.selectedSlide,
          selectedSlideIndex: slideIndex,
          selectedSlide: slide,
          isLastSlide,
          isFirstSlide,
          transitionLoading: true,
        }
      }),
    selectNextSlide: () => {
      set((state: GameStore) => {
        if (state.transitionLoading) {
          return { ...state }
        }
        const currentSlideIndex = state.selectedSlideIndex || 0
        const slides = state.slides || []
        let nextSlide = 0
        if (currentSlideIndex >= 0 && currentSlideIndex < slides.length) {
          nextSlide = currentSlideIndex + 1
        }

        if (nextSlide > slides.length - 1) {
          return { ...state }
        }
        const isFirstSlide = nextSlide === 0
        const isLastSlide = nextSlide === slides.length - 1
        useActivitiesStore.getState().pauseActivity(state?.selectedSlideIndex ? state.selectedSlideIndex : 0)
        useActivitiesStore.getState().startActivity(nextSlide)
        return {
          lastSelectedSlideIndex: state.selectedSlideIndex,
          lastSelectedSlide: state.selectedSlide,
          selectedSlideIndex: nextSlide,
          selectedSlide: state.slides ? state.slides[nextSlide] : undefined,
          isLastSlide,
          isFirstSlide,
          transitionLoading: true,
        }
      })
    },
    selectPrevSlide: () =>
      set((state: GameStore) => {
        if (state.transitionLoading) {
          return { ...state }
        }
        const currentSlideIndex = state.selectedSlideIndex
        const slides = state.slides || []
        let prevSlide = 0
        if (currentSlideIndex && currentSlideIndex >= 0) {
          prevSlide = currentSlideIndex - 1
        }
        const isLastSlide = prevSlide === slides.length - 1
        const isFirstSlide = prevSlide === 0
        useActivitiesStore.getState().pauseActivity(state?.selectedSlideIndex ? state.selectedSlideIndex : 0)
        useActivitiesStore.getState().startActivity(prevSlide)
        return {
          lastSelectedSlideIndex: state.selectedSlideIndex,
          lastSelectedSlide: state.selectedSlide,
          selectedSlide: state.slides ? state.slides[prevSlide] : undefined,
          selectedSlideIndex: prevSlide,
          isLastSlide,
          isFirstSlide,
          transitionLoading: true,
        }
      }),
  })),
)

