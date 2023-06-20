import { Star } from 'react-konva'
import { Activity, ActivityState } from '../../stores/activitiesStoreTypes'
import { useGameStore } from '../../stores/gameStore'
import { ReadingActivity } from './ReadingActivity'
import { VideoActivity } from './VideoActivity'

interface ActivityLayerProps {
  baseUrl: string
  engine: 'S' | 'R' | 'A' | 'V' | 'P' | 'Q' | 'T'
  /*| 'slide'
    | 'reading'
    | 'soundboard'
    | 'video'
    | 'puzzle'
    | 'questions'
    | 'text input'*/
  activity: Activity
  activityState: ActivityState
}

export function ActivityLayer({ baseUrl, activity, activityState, engine }: ActivityLayerProps) {
  const transitionLoading = useGameStore((state) => state.transitionLoading)
  const soundUrl = baseUrl + activity.filePathIntroRecording
  const selectNextSlide = useGameStore((state) => state.selectNextSlide)
  const selectSlideIndex = useGameStore((state) => state.selectSlideIndex)

  const moveToNextSlide = (index: number | undefined) => {
    if (index !== undefined) {
      selectSlideIndex(index)
    } else {
      selectNextSlide()
    }
  }

  switch (engine) {
    case 'R':
      return (
        <ReadingActivity
          soundUrl={soundUrl}
          activityState={activityState}
          transitionLoading={transitionLoading}
          activitySettings={activity.settings}
          moveToNextSlide={moveToNextSlide}
        />
      )
    case 'V':
      return <VideoActivity activitySettings={activity.settings} />
    case 'S':
      return <></>

    default:
      return <Star numPoints={10} innerRadius={50} outerRadius={100} x={300} y={300} fill="red" />
  }
}

