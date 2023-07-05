import { Group as KonvaGroupType } from 'konva/lib/Group'
import { useRef, useState } from 'react'
import { Group, Shape as KonvaShape } from 'react-konva'
import { Shape } from '../../../../stores/activitiesStoreTypes'
import { drawShape, pulseShape } from '../../../../utils'
import { playerColors } from '../../../../utils/constants'
import DefaultGoodAnswer from '../../../../assets/sounds/defaultGoodAnswer.mp3'
import { ShapeSoundObj } from '../..'

interface AnswerShapeProps {
  shape: Shape
  baseUrl: string
  onRightSoundEnd: (pk: number, linkToPage?: number) => void
  onRightClick?: () => void
  isFunMode?: boolean
  showShapeForce?: boolean
  stopIntroSound: () => void
  playShapeSound: ({ onend, soundUrl }: ShapeSoundObj) => void
}

export const AnswerShape = ({
  shape,
  baseUrl,
  onRightSoundEnd,
  onRightClick,
  isFunMode = true,
  showShapeForce = false,
  stopIntroSound,
  playShapeSound,
}: AnswerShapeProps) => {
  const shapeRef = useRef<KonvaGroupType>(null)
  const [showShape, setShowShape] = useState(false)
  const soundUrl = shape.filePathRecording1 ? baseUrl + shape.filePathRecording1 : DefaultGoodAnswer

  const onClick = () => {
    if (onRightClick) {
      onRightClick()
    }
    setShowShape(true)
    // TODO: add confetti
    stopIntroSound()

    playShapeSound({
      soundUrl: soundUrl,
      onend: () => onRightSoundEnd(shape.pk, shape.settings?.linkToPage),
      fireOnendOnSoundStop: true,
    })

    if (!shapeRef.current) {
      return
    }

    pulseShape(shapeRef.current, shape)
  }

  if (!shape.path || !shape.path.length) {
    return <></>
  }

  return (
    <Group ref={shapeRef}>
      <KonvaShape
        id={`konva_shape_${shape.pk}`}
        onClick={onClick}
        lineCap="round"
        lineJoin="round"
        stroke={
          showShape || showShapeForce
            ? isFunMode
              ? playerColors.rightAnswerGrean
              : playerColors.rightAnswerGrey
            : 'transparent'
        }
        strokeWidth={10}
        shadowBlur={25}
        sceneFunc={(ctx, canvas) => {
          drawShape(ctx, shape)

          ctx.fillStrokeShape(canvas)
        }}
      />
      <Group globalCompositeOperation={'destination-out'}>
        <KonvaShape
          id={`konva_shape_erase_${shape.pk}`}
          onClick={onClick}
          lineCap="round"
          lineJoin="round"
          strokeWidth={0}
          stroke={'black'}
          sceneFunc={(ctx, canvas) => {
            drawShape(ctx, shape)
            ctx.fill()
            ctx.fillStrokeShape(canvas)
          }}
        />
      </Group>
    </Group>
  )
}

