import {
  PUZZLE_ENGINE,
  QUESTIONS_ENGINE,
  READING_ENGINE,
  SLIDE_ENGINE,
  SOUNDBOARD_ENGINE,
  TEXTINPUT_ENGINE,
  VIDEO_ENGINE,
} from '../utils/constants'

export interface Slide {
  activities: any
  engineType:
    | SLIDE_ENGINE
    | READING_ENGINE
    | SOUNDBOARD_ENGINE
    | VIDEO_ENGINE
    | PUZZLE_ENGINE
    | QUESTIONS_ENGINE
    | TEXTINPUT_ENGINE
  filePath: string
  filePathImage: string
  filePathImageThumb: string
  hidden: boolean
  layers: any
  pk: number
  settings: any
  tags: string
}
export interface Category {
  url: string
  id: number
  parent: {
    url: string
    id: number
    title: string
  }
  title: string
}

export interface Author {
  username: string
  picture: string
  first_name: string
  last_name: string
  bio: string
  cover_photo: string
  user_pk: number
  id: number
  certified: boolean
  referral_code: number
}
export interface Album {
  ready: number
  age_group_text: string
  cover_color: string
  cover_image: string
  share_image: string
  unique_id: string
  structure_json: string
  description: string
  name: string
  link: string

  categories_urls: Category[]
}

export interface GameStore {
  loading: boolean
  transitionLoading: boolean
  gameReady: boolean
  base_url: string
  music: string | undefined
  pk: number | undefined
  shuffleType: any
  settings: {
    quizParameters?: {
      activityTimeLimit: number
      globalLivesLimit: number
      globalTimeLimit: number
      quizModeEnabled: boolean
    }
  }
  isFirstSlide: boolean
  isLastSlide: boolean
  selectedSlide: Slide | undefined
  selectedSlideIndex: number | undefined
  lastSelectedSlide: Slide | undefined
  lastSelectedSlideIndex: number | undefined
  slides: Slide[] | undefined
  album: Album | undefined
  author: Author | undefined
  setTransitionLoading: (s: boolean) => void
  retrieveGameStructure: () => void
  setSlides: (slides: Slide[]) => void
  selectSlide: (slide: Slide) => void
  selectSlideIndex: (index: number, paused?: boolean) => void
  selectPrevSlide: () => void
  selectNextSlide: () => void
  refreshSelectedSlide: () => void
}

