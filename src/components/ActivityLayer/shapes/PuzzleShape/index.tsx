import { Group, Shape as KonvaShape, Image } from 'react-konva'
import { Shape } from '../../../../stores/activitiesStoreTypes'
import { drawShape, moveShape } from '../../../../utils'
import { PLAYER_HEIGHT, PLAYER_WIDTH, PUZZLE_OFFSET_SHAPE_DETECT_PX } from '../../../../utils/constants'
import { useImage } from '../../../../hooks/useImage'
import { KonvaEventObject } from 'konva/lib/Node'
import { useEffect, useRef, useState } from 'react'
import { Group as KonvaGroupType } from 'konva/lib/Group'
import DefaultWrongAnswer from '../../../../assets/sounds/DefaultWrongAnswer.mp3'
import defaultGoodAnswer from '../../../../assets/sounds/defaultGoodAnswer.mp3'
import { ShapeSoundObj } from '../..'

interface PuzzleShapeProps {
  shape: Shape
  slideThumbnailUrl: string
  easyMode: boolean
  slideIsActive: boolean
  bounceBack: boolean
  stopIntroSound: () => void
  baseUrl: string
  onWrongAnswer: () => void
  showHint: boolean
  onRightSoundEnd: (pk: number) => void
  playShapeSound: ({ onend, soundUrl }: ShapeSoundObj) => void
}

// TODO: 3d shapes
export const PuzzleShape = ({
  shape,
  slideThumbnailUrl,
  easyMode,
  slideIsActive,
  bounceBack,
  stopIntroSound,
  baseUrl,
  onWrongAnswer,
  showHint,
  onRightSoundEnd,
  playShapeSound,
}: PuzzleShapeProps) => {
  const [didFinish, setDidFinish] = useState(false)
  const shapeRef = useRef<KonvaGroupType>(null)
  const [image] = useImage(slideThumbnailUrl)

  const soundUrl = shape.filePathRecording1 ? baseUrl + shape.filePathRecording1 : undefined

  const shapeHintRef = useRef<KonvaGroupType>(null)
  const [wrongAnswerObj, setWrongAnswerObj] = useState({ showHint: false, count: 0 })

  useEffect(() => {
    if (slideIsActive && easyMode) {
      moveShape({ shapeNode: shapeRef.current, location: 'to-origin-place', duration: 1, shape })
    } else if (easyMode) {
      moveShape({ shapeNode: shapeRef.current, location: 'to-right-place', duration: 0, shape })
    } else {
      moveShape({ shapeNode: shapeRef.current, location: 'to-origin-place', duration: 0, shape })
    }
  }, [easyMode, slideIsActive, shape])

  useEffect(() => {
    if (!wrongAnswerObj.showHint) {
      return
    }
    moveShape({
      shapeNode: shapeHintRef.current,
      location: 'to-right-place',
      duration: 1,
      onFinish: () =>
        setWrongAnswerObj((oldV) => {
          return { showHint: false, count: oldV.count }
        }),
      shape,
    })
  }, [wrongAnswerObj, shape])

  if (!shape.path || !shape.path.length) {
    return <></>
  }

  const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const isRightLocaion =
      Math.abs(e.target.attrs.x) < PUZZLE_OFFSET_SHAPE_DETECT_PX &&
      Math.abs(e.target.attrs.y) < PUZZLE_OFFSET_SHAPE_DETECT_PX

    if (!soundUrl) {
      stopIntroSound()
    }

    setWrongAnswerObj((oldV) => {
      const newCount = oldV.count + 1
      return { showHint: newCount % 3 === 0 && showHint, count: newCount }
    })

    if (isRightLocaion) {
      // TODO: add confetti
      setDidFinish(true)
      playShapeSound({
        soundUrl: defaultGoodAnswer,
        onend: () => onRightSoundEnd(shape.pk),
        fireOnendOnSoundStop: true,
        id: `right_${shape.pk}`,
      })
      moveShape({ shapeNode: shapeRef.current, location: 'to-right-place', shape })
      return
    }

    playShapeSound({ soundUrl: DefaultWrongAnswer })
    onWrongAnswer()

    if (bounceBack) {
      moveShape({ shapeNode: shapeRef.current, location: 'to-origin-place', shape })
    }
  }

  const onDragStart = () => {
    if (soundUrl) {
      stopIntroSound()
      playShapeSound({ soundUrl })
    }
  }

  return (
    <Group>
      {wrongAnswerObj.showHint && shapeRef.current && (
        // the shape hint
        <Group
          ref={shapeHintRef}
          clipFunc={function (ctx) {
            drawShape(ctx, shape.path)
          }}
          x={shapeRef.current.attrs.x}
          y={shapeRef.current.attrs.y}
          opacity={0.5}
        >
          <Image width={PLAYER_WIDTH} height={PLAYER_HEIGHT} image={image} />
        </Group>
      )}
      <Group
        ref={shapeRef}
        clipFunc={function (ctx) {
          drawShape(ctx, shape.path)
        }}
        draggable={!didFinish}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
      >
        <Image width={PLAYER_WIDTH} height={PLAYER_HEIGHT} image={image} />
      </Group>
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
        drawShape(ctx, shape.path)

        ctx.fillStrokeShape(canvas)
      }}
    />
  )
}

