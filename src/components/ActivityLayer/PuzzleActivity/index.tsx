import { Group } from 'react-konva'
import { usePlayIntro } from '../../../hooks/usePlayIntro'
import { Activity } from '../../../stores/activitiesStoreTypes'
import { PuzzleShape, PuzzleShapeHole } from '../shapes/PuzzleShape'

interface PuzzleActivityProps {
  moveToNextSlide: (index?: number) => void
  soundUrl: string
  isActivityActive: boolean
  transitionLoading: boolean
  activity: Activity
  baseUrl: string
  onWrongAnswer: () => void
  slideThumbnailUrl: string
}

// TODO: jump to page + on finish
export function PuzzleActivity({
  activity,
  slideThumbnailUrl,
  isActivityActive,
  transitionLoading,
  soundUrl,
  baseUrl,
  onWrongAnswer,
}: PuzzleActivityProps) {
  const { stop } = usePlayIntro({
    soundUrl,
    isActivityActive,
    transitionLoading,
    playIntroAgainWithTimer: false,
  })

  if (!activity.shapes || !activity.shapes.length) {
    return <></>
  }

  return (
    <Group>
      {activity.shapes.map((shape, i) => {
        return <PuzzleShapeHole shape={shape} key={`shape_hole_${shape.pk}_${i}`} />
      })}
      {activity.shapes.map((shape, i) => {
        return (
          <PuzzleShape
            shape={shape}
            key={`shape_${shape.pk}_${i}`}
            slideThumbnailUrl={slideThumbnailUrl}
            easyMode={!!activity.settings.showShapeV2}
            slideIsActive={isActivityActive && !transitionLoading}
            bounceBack={!!activity.settings.soundFunModeV2}
            stopIntroSound={stop}
            baseUrl={baseUrl}
            onWrongAnswer={onWrongAnswer}
            showHint={!activity.settings.DisableHints}
          />
        )
      })}
    </Group>
  )
}

