import { useEffect } from 'react'
import { Rect, Star } from 'react-konva'
import { Activity, ActivitySettings, ActivityState } from '../../stores/activitiesStoreTypes'
import useSound from 'use-sound'
import { useGameStore } from '../../stores/gameStore'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../utils/constants'

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
    case 'S':
      return <></>

    default:
      return <Star numPoints={10} innerRadius={50} outerRadius={100} x={300} y={300} fill="red" />
  }
}

function ReadingActivity({
  moveToNextSlide,
  soundUrl,
  activityState,
  transitionLoading,
  activitySettings,
}: {
  moveToNextSlide: (index: number | undefined) => void
  soundUrl: string
  activityState: ActivityState
  transitionLoading: boolean
  activitySettings: ActivitySettings
}) {
  const [play, { stop }] = useSound(soundUrl, {
    onend: () => {
      if (!activitySettings.advance || activityState.doesSlideHaveClickableLayer) {
        return
      }
      moveToNextSlide(activitySettings.linkToPage)
    },
  })

  const onClick = () => {
    if (activitySettings.advance || activityState.doesSlideHaveClickableLayer) {
      return
    }
    stop()
    moveToNextSlide(activitySettings.linkToPage)
  }

  useEffect(() => {
    if (!activityState.started || activityState.paused || transitionLoading) {
      stop()
      return
    }

    play()
  }, [activityState, play, transitionLoading])

  return <Rect x={0} y={0} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} onClick={onClick} />
}

