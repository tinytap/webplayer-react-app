import { Activity } from '../../../stores/activitiesStoreTypes'
import { usePlayIntro } from '../../../hooks/usePlayIntro'
import { updateShapesStatus } from '../../../utils'
import { useShapesStatus } from '../../../hooks/useShapesStatus'
import { InputShape } from '../shapes/InputShape'
import { ShapeSoundObj } from '..'
import { Html } from 'react-konva-utils'

interface TalkOrTypeActivityProps {
  moveToNextSlide: (index?: number) => void
  soundUrl: string
  isActivityActive: boolean
  transitionLoading: boolean
  activity: Activity
  baseUrl: string
  onWrongAnswer: () => void
  playShapeSound: ({ onend, soundUrl }: ShapeSoundObj) => void
}

export function TalkOrTypeActivity({
  moveToNextSlide,
  soundUrl,
  isActivityActive,
  transitionLoading,
  activity,
  baseUrl,
  onWrongAnswer,
  playShapeSound,
}: TalkOrTypeActivityProps) {
  const { setShapeStatus } = useShapesStatus({ shapes: activity.shapes, moveToNextSlide })

  const { stop } = usePlayIntro({
    soundUrl,
    isActivityActive,
    transitionLoading,
    playIntroAgainWithTimer: false,
  })

  const onShapeRightSoundEnd = (shapePk: number) => {
    updateShapesStatus({ setClickedShapes: setShapeStatus, shapePk, linkToPage: activity.settings.linkToPage })
    // TODO: add fireworks when all pieces are answered
  }

  if (!activity.shapes || !activity.shapes.length) {
    return <></>
  }

  return (
    <Html>
      {activity.shapes.map((shape, i) => {
        return (
          <InputShape
            shape={shape}
            baseUrl={baseUrl}
            key={`shape_${shape.pk}_${i}`}
            onRightSoundEnd={onShapeRightSoundEnd}
            showHints={activity.settings.soundShowToolTip !== false}
            stopIntroSound={stop}
            onWrongAnswer={onWrongAnswer}
            playShapeSound={playShapeSound}
          />
        )
      })}
    </Html>
  )
}

