import { useEffect, useState } from 'react'
import { Group, Rect, Shape as KonvaShape } from 'react-konva'
import useSound from 'use-sound'
import { Activity, Shape } from '../../../stores/activitiesStoreTypes'
import { drawShape } from '../../../utils'
import { playerColors, PLAYER_HEIGHT, PLAYER_WIDTH, SHOW_HINT_TIME_S } from '../../../utils/constants'
import DefaultGoodAnswer from '../../../assets/sounds/defaultGoodAnswer.mp3'
import DefaultWrongAnswer from '../../../assets/sounds/defaultWrongAnswer.mp3'

interface ClickedShapes {
  [shapePk: number]: { didClickShape: boolean; linkToPage?: number }
}

interface ReadingActivityProps {
  moveToNextSlide: (index: number | undefined) => void
  soundUrl: string
  isActivityActive: boolean
  transitionLoading: boolean
  activity: Activity
  baseUrl: string
  isQuizMode: boolean
  onWrongAnswer: () => void
}

export function SoundboardActivity({
  moveToNextSlide,
  soundUrl,
  isActivityActive,
  transitionLoading,
  activity,
  baseUrl,
  isQuizMode,
  onWrongAnswer,
}: ReadingActivityProps) {
  const [showHints, setShowHints] = useState(false)
  const [clickedShapes, setClickedShapes] = useState<ClickedShapes>({})

  const [play, { stop }] = useSound(soundUrl, {
    onend: () => {
      if (activity.settings.kIsShowSoundboardHintsOnStart) {
        setShowHints(true)
      }
    },
  })
  const [playWrongAnswer, { stop: stopWrongAnswer }] = useSound(DefaultWrongAnswer)

  const onShowShape = (shapePk: number, linkToPage?: number) => {
    setClickedShapes((oldValue) => {
      const newValue = { ...oldValue }
      if (newValue[shapePk] !== undefined && !newValue[shapePk].didClickShape) {
        newValue[shapePk].didClickShape = true
        newValue[shapePk].linkToPage = linkToPage
        return newValue
      }

      return oldValue
    })
  }

  const onNoShapeClick = () => {
    if (!isQuizMode) {
      if (!activity.settings.soundHideHints) {
        setShowHints(true)
      }
      return
    }

    stopWrongAnswer()
    playWrongAnswer()
    onWrongAnswer()
  }

  useEffect(() => {
    const data: ClickedShapes = {}
    activity.shapes.forEach((s) => {
      if (!s.path || !s.path.length) {
        return
      }
      data[s.pk] = { didClickShape: false }
    })
    setClickedShapes(data)
  }, [activity.shapes])

  useEffect(() => {
    if (!isActivityActive || transitionLoading) {
      stop()
      return
    }

    play()

    return () => {
      stop()
    }
  }, [isActivityActive, play, transitionLoading, stop])

  useEffect(() => {
    let isMounted = false

    const slideNavigate = () => {
      let allShapesAreClicked = true
      let linkToPage: number | undefined = undefined

      for (const prop in clickedShapes) {
        const value = clickedShapes[prop]
        if (!value.didClickShape) {
          allShapesAreClicked = false
        } else if (value.linkToPage !== undefined) {
          linkToPage = value.linkToPage
        }
      }

      setTimeout(() => {
        if (isMounted) {
          return
        }
        if (linkToPage !== undefined) {
          moveToNextSlide(linkToPage)
          return
        }
        if (allShapesAreClicked) {
          moveToNextSlide(undefined)
        }
      }, 1000)
    }
    slideNavigate()

    return () => {
      isMounted = true
    }
  }, [clickedShapes, moveToNextSlide])

  useEffect(() => {
    let isMounted = false
    if (!showHints) {
      return
    }

    setTimeout(() => {
      if (isMounted) {
        return
      }
      setShowHints(false)
    }, SHOW_HINT_TIME_S * 1000)

    return () => {
      isMounted = true
    }
  }, [setShowHints, showHints])

  if (!activity.shapes || !activity.shapes.length) {
    return <></>
  }

  return (
    <>
      <Rect x={0} y={0} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} onClick={onNoShapeClick} />
      {activity.shapes.map((shape, i) => {
        return (
          <ShapeCanvas
            shape={shape}
            baseUrl={baseUrl}
            key={`shape_${shape.pk}_${i}`}
            onShowShape={onShowShape}
            isFunMode={!!activity.settings.soundFunMode}
            showShapeForce={showHints}
          />
        )
      })}
    </>
  )
}

interface ShapeCanvasProps {
  key: string
  shape: Shape
  baseUrl: string
  onShowShape: (pk: number, linkToPage?: number) => void
  isFunMode: boolean
  showShapeForce: boolean
}

const ShapeCanvas = ({ shape, baseUrl, onShowShape, isFunMode, showShapeForce }: ShapeCanvasProps) => {
  const [showShape, setShowShape] = useState(false)
  const soundUrl = shape.filePathRecording1 ? baseUrl + shape.filePathRecording1 : undefined

  const [play, { stop }] = useSound(soundUrl ?? DefaultGoodAnswer, {
    onend: () => onShowShape(shape.pk, shape.settings?.linkToPage),
  })

  const onClick = () => {
    setShowShape(true)
    // TODO: add confetti
    // TODO: add shape get bigger
    stop()
    play()
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
    <Group>
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

