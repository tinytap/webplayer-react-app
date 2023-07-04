import { Group, Shape as KonvaShape, Image } from 'react-konva'
import { Shape } from '../../../../stores/activitiesStoreTypes'
import { drawShape } from '../../../../utils'
import { PLAYER_HEIGHT, PLAYER_WIDTH, PUZZLE_OFFSET_SHAPE_DETECT_PX } from '../../../../utils/constants'
import { useImage } from '../../../../hooks/useImage'
import { KonvaEventObject } from 'konva/lib/Node'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Group as KonvaGroupType } from 'konva/lib/Group'
import useSound from 'use-sound'
import DefaultWrongAnswer from '../../../../assets/sounds/DefaultWrongAnswer.mp3'
import defaultGoodAnswer from '../../../../assets/sounds/defaultGoodAnswer.mp3'

interface PuzzleShapeProps {
  shape: Shape
  slideThumbnailUrl: string
  easyMode: boolean
  slideIsActive: boolean
  bounceBack: boolean
  stopIntroSound: () => void
  baseUrl: string
  onWrongAnswer: () => void
}

// TODO: 3d shapes
// TODO: hints
export const PuzzleShape = ({
  shape,
  slideThumbnailUrl,
  easyMode,
  slideIsActive,
  bounceBack,
  stopIntroSound,
  baseUrl,
  onWrongAnswer,
}: PuzzleShapeProps) => {
  const [didFinish, setDidFinish] = useState(false)
  const shapeRef = useRef<KonvaGroupType>(null)
  const [image] = useImage(slideThumbnailUrl)

  const soundUrl = shape.filePathRecording1 ? baseUrl + shape.filePathRecording1 : undefined

  const [play, { stop }] = useSound(soundUrl ?? '')
  const [playWrongAnswer, { stop: stopWrongAnswer }] = useSound(DefaultWrongAnswer)
  const [playRightAnswer] = useSound(defaultGoodAnswer)

  const moveShape = useCallback(
    (location: 'to-right-place' | 'to-origin-place', duration?: number) => {
      const shapeNode = shapeRef.current

      if (!shapeNode) {
        return
      }

      if (location === 'to-origin-place') {
        shapeNode.to({
          x: shape.settings.originTransform[4],
          y: shape.settings.originTransform[5],
          duration: duration,
        })
      } else {
        shapeNode.to({
          x: 0,
          y: 0,
          duration: duration,
        })
      }
    },
    [shape],
  )

  useEffect(() => {
    if (slideIsActive && easyMode) {
      moveShape('to-origin-place', 1)
    } else if (easyMode) {
      moveShape('to-right-place', 0)
    } else {
      moveShape('to-origin-place', 0)
    }
  }, [easyMode, moveShape, slideIsActive])

  if (!shape.path || !shape.path.length) {
    return <></>
  }

  const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const isRightLocaion =
      Math.abs(e.target.attrs.x) < PUZZLE_OFFSET_SHAPE_DETECT_PX &&
      Math.abs(e.target.attrs.y) < PUZZLE_OFFSET_SHAPE_DETECT_PX

    if (soundUrl) {
      stop()
    } else {
      stopIntroSound()
    }
    stopWrongAnswer()

    if (isRightLocaion) {
      setDidFinish(true)
      playRightAnswer()
      moveShape('to-right-place')
      return
    }

    playWrongAnswer()
    onWrongAnswer()

    if (bounceBack) {
      moveShape('to-origin-place')
    }
  }

  const onDragStart = () => {
    if (soundUrl) {
      stopIntroSound()
      stop()
      play()
    }
  }

  return (
    <Group
      ref={shapeRef}
      clipFunc={function (ctx) {
        drawShape(ctx, shape)
      }}
      draggable={!didFinish}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
    >
      <Image width={PLAYER_WIDTH} height={PLAYER_HEIGHT} image={image} />
    </Group>
  )
}

export const PuzzleShapeHole = ({ shape }: { shape: Shape }) => {
  if (!shape.path || !shape.path.length) {
    return <></>
  }

  return (
    <KonvaShape
      lineCap="round"
      lineJoin="round"
      fill={'black'}
      stroke={'#00000033'}
      strokeWidth={1}
      sceneFunc={(ctx, canvas) => {
        drawShape(ctx, shape)

        ctx.fillStrokeShape(canvas)
      }}
    />
  )
}
