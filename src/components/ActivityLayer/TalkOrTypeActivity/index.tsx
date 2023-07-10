import { Activity } from '../../../stores/activitiesStoreTypes'
import { updateShapesStatus } from '../../../utils'
import { useShapesStatus } from '../../../hooks/useShapesStatus'
import { InputShape } from '../shapes/InputShape'
import { Html } from 'react-konva-utils'
import { useSlideSounds } from '../../../hooks/useSlideSounds'

interface TalkOrTypeActivityProps {
  moveToNextSlide: (index?: number) => void
  soundUrl: string
  isActive: boolean
  activity: Activity
  baseUrl: string
  onWrongAnswer: () => void
}

export function TalkOrTypeActivity({
  moveToNextSlide,
  soundUrl,
  isActive,
  activity,
  baseUrl,
  onWrongAnswer,
}: TalkOrTypeActivityProps) {
  const { playSound } = useSlideSounds({
    isActive: isActive,
    introUrl: soundUrl,
  })

  const { setShapeStatus } = useShapesStatus({ shapes: activity.shapes, moveToNextSlide })

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
            onWrongAnswer={onWrongAnswer}
            playShapeSound={playSound}
          />
        )
      })}
    </Html>
  )
}

