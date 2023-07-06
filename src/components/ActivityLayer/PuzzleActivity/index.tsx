import { Group } from 'react-konva'
import { usePlayIntro } from '../../../hooks/usePlayIntro'
import { useShapesStatus } from '../../../hooks/useShapesStatus'
import { SlideSoundObj } from '../../../hooks/useSlideSound'
import { Activity } from '../../../stores/activitiesStoreTypes'
import { updateShapesStatus } from '../../../utils'
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
  playShapeSound: ({ onend, soundUrl }: SlideSoundObj) => void
}

export function PuzzleActivity({
  activity,
  slideThumbnailUrl,
  isActivityActive,
  transitionLoading,
  soundUrl,
  baseUrl,
  onWrongAnswer,
  moveToNextSlide,
  playShapeSound,
}: PuzzleActivityProps) {
  const { stop } = usePlayIntro({
    soundUrl,
    isActivityActive,
    transitionLoading,
    playIntroAgainWithTimer: false,
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
            slideThumbnailUrl={slideThumbnailUrl}
            easyMode={!!activity.settings.showShapeV2}
            slideIsActive={isActivityActive && !transitionLoading}
            bounceBack={!!activity.settings.soundFunModeV2}
            stopIntroSound={stop}
            baseUrl={baseUrl}
            onWrongAnswer={onWrongAnswer}
            showHint={!activity.settings.DisableHints}
            onRightSoundEnd={onShapeRightSoundEnd}
            playShapeSound={playShapeSound}
            is3D={!!activity.settings.ShapePuzzleThemeV2}
          />
        )
      })}
    </Group>
  )
}

