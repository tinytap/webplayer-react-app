import { Group as KonvaGroupType } from 'konva/lib/Group'
import { useEffect, useRef, useState } from 'react'
import { Group, Shape as KonvaShape } from 'react-konva'
import useSound from 'use-sound'
import { Shape } from '../../../../stores/activitiesStoreTypes'
import { drawShape, pulseShape } from '../../../../utils'
import { playerColors } from '../../../../utils/constants'
import DefaultGoodAnswer from '../../../../assets/sounds/defaultGoodAnswer.mp3'

interface AnswerShapeProps {
  shape: Shape
  baseUrl: string
  onShowShape: (pk: number, linkToPage?: number) => void
  isFunMode?: boolean
  showShapeForce?: boolean
  stopIntroSound: () => void
}

export const AnswerShape = ({
  shape,
  baseUrl,
  onShowShape,
  isFunMode = true,
  showShapeForce = false,
  stopIntroSound,
}: AnswerShapeProps) => {
  const shapeRef = useRef<KonvaGroupType>(null)
  const [showShape, setShowShape] = useState(false)
  const soundUrl = shape.filePathRecording1 ? baseUrl + shape.filePathRecording1 : DefaultGoodAnswer

  const [play, { stop }] = useSound(soundUrl, {
    onend: () => onShowShape(shape.pk, shape.settings?.linkToPage),
  })

  const onClick = () => {
    setShowShape(true)
    // TODO: add confetti
    stopIntroSound()
    stop()
    play()

    if (!shapeRef.current) {
      return
    }

    pulseShape(shapeRef.current, shape)
  }

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

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

