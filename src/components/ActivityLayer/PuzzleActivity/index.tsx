import { Group } from 'react-konva'
import { useShapesStatus } from '../../../hooks/useShapesStatus'
import { useSlideSounds } from '../../../hooks/useSlideSounds'
import { Activity } from '../../../stores/activitiesStoreTypes'
import { updateShapesStatus } from '../../../utils'
import { PuzzleShape, PuzzleShapeHole } from '../shapes/PuzzleShape'

interface PuzzleActivityProps {
  moveToNextSlide: (index?: number) => void
  soundUrl: string
  isActive: boolean
  activity: Activity
  baseUrl: string
  onWrongAnswer: () => void
  slidePathImage: string
}

export function PuzzleActivity({
  activity,
  slidePathImage,
  isActive,
  soundUrl,
  baseUrl,
  onWrongAnswer,
  moveToNextSlide,
}: PuzzleActivityProps) {
  const { playSound } = useSlideSounds({
    isActive: isActive,
    introUrl: soundUrl,
  })

  const { shapesStatus, setShapeStatus } = useShapesStatus({ shapes: activity.shapes, moveToNextSlide })

  const onShapeRightSoundEnd = (shapePk: number) => {
    updateShapesStatus({ setClickedShapes: setShapeStatus, shapePk, linkToPage: activity.settings.linkToPage })
    // TODO: add fireworks when all pieces are in the right place
  }

  if (!activity.shapes || !activity.shapes.length) {
    return <></>
  }

  return (
    <Group>
      {activity.shapes.map((shape, i) => {
        if (shapesStatus && shapesStatus[shape.pk]?.didClickShape) {
          return null
        }

        return <PuzzleShapeHole shape={shape} key={`shape_hole_${shape.pk}_${i}`} />
      })}
      {activity.shapes.map((shape, i) => {
        if (shapesStatus && shapesStatus[shape.pk]?.didClickShape) {
          return null
        }

        return (
          <PuzzleShape
            shape={shape}
            key={`shape_${shape.pk}_${i}`}
            slidePathImage={slidePathImage}
            easyMode={!!activity.settings.showShapeV2}
            isActive={isActive}
            bounceBack={!!activity.settings.soundFunModeV2}
            baseUrl={baseUrl}
            onWrongAnswer={onWrongAnswer}
            showHint={!activity.settings.DisableHints}
            onRightSoundEnd={onShapeRightSoundEnd}
            is3D={!!activity.settings.ShapePuzzleThemeV2}
            playSlideSound={playSound}
          />
        )
      })}
    </Group>
  )
}

