import { Group } from 'react-konva'
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
// TODO: wrong answer
// TODO: add sounds
export function PuzzleActivity({
  activity,
  slideThumbnailUrl,
  isActivityActive,
  transitionLoading,
}: PuzzleActivityProps) {
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
          />
        )
      })}
    </Group>
  )
}

