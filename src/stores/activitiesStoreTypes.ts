export interface ActivityState {
  started: boolean
  paused: boolean
  completed: boolean
  score: number
  maxScore: number
  userScore: number
  userMaxScore: number
  userScorePercentage: number
  engineType: 'S' | 'R' | 'A' | 'V' | 'P' | 'Q' | 'T'
  activities?: Activity[]
  doesSlideHaveClickableLayer: boolean
}
export interface ActivitiesState {
  activities: ActivityState[] | []
  getSlideActivityState: (index: number) => ActivityState | undefined
  getAllActivities: () => Activity[] | undefined
  setActivities: (activities: ActivityState[]) => void
  startActivity: (index: number) => void
  pauseActivity: (index: number) => void
  completeActivity: (index: number) => void
}

export interface Shape {
  filePathThumb: string
  settings: {
    originTransform: [number, number, number, number, number, number]
    linkToPage?: number
    textAnswerArray?: string[]
  }
  filePathRecording2: string
  filePathRecording1: string
  path: PathItem[]
  pk: number
}

export interface PathItem {
  y: number
  x: number
  type: number
  cp1x?: number
  cp1y?: number
  cp2x?: number
  cp2y?: number
  cpx?: number
  cpy?: number
}
export interface Activity {
  recordingDuration: number
  filePathIntroRecording: string
  settings: ActivitySettings
  shapes: Shape[]
  pk: number
}

export interface ActivitySettings {
  soundFlatMode?: boolean
  ShapePuzzleThemeV2?: number
  showShapeV2?: boolean
  soundFunModeV2?: boolean
  advance?: boolean
  linkToPage?: number
  videoURL?: string
  transform: [number, number, number, number, number, number]
  soundFunMode?: boolean
  soundHideHints?: boolean
  kIsShowSoundboardHintsOnStart?: boolean
  kShowConfetti?: boolean
  DisableHints?: boolean
  soundShowToolTip?: boolean
}

export interface ActivityData {
  folderPath: string
  pk: number
  activities: Activity[]
}

