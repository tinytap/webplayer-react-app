import { useEffect, useState } from 'react'
import { Shape as KonvaShape } from 'react-konva'
import useSound from 'use-sound'
import { Activity, Shape } from '../../../stores/activitiesStoreTypes'
import { drawPoint, eraseInnerShape } from '../../../utils'
import { playerColors } from '../../../utils/constants'

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
}

export function SoundboardActivity({
  moveToNextSlide,
  soundUrl,
  isActivityActive,
  transitionLoading,
  activity,
  baseUrl,
}: ReadingActivityProps) {
  const [clickedShapes, setClickedShapes] = useState<ClickedShapes>({})

  const [play, { stop }] = useSound(soundUrl, {
    onend: () => {
      // TODO: call again if needed / some other sound
    },
  })

  const onShowShape = (shapePk: number, linkToPage?: number) => {
    setClickedShapes((oldValue) => {
      const newValue = { ...oldValue }
      if (newValue[shapePk] !== undefined) {
        newValue[shapePk].didClickShape = true
        newValue[shapePk].linkToPage = linkToPage
        return newValue
      }

      return oldValue
    })
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

    return () => {
      isMounted = true
    }
  }, [clickedShapes, moveToNextSlide])

  if (!activity.shapes || !activity.shapes.length) {
    return <></>
  }

  // TODO: add wrong answers
  return (
    <>
      {activity.shapes.map((shape, i) => {
        return <ShapeCanvas shape={shape} baseUrl={baseUrl} key={`shape_${shape.pk}_${i}`} onShowShape={onShowShape} />
      })}
    </>
  )
}

const ShapeCanvas = ({
  shape,
  baseUrl,
  onShowShape,
}: {
  key: string
  shape: Shape
  baseUrl: string
  onShowShape: (pk: number, linkToPage?: number) => void
}) => {
  const [showShape, setShowShape] = useState(false)
  const soundUrl = shape.filePathRecording1 ? baseUrl + shape.filePathRecording1 : undefined

  const [play, { stop }] = useSound(soundUrl ?? '', {
    onend: () => onShowShape(shape.pk, shape.settings?.linkToPage),
  })

  const onClick = () => {
    if (showShape) {
      return
    }
    setShowShape(true)

    if (!soundUrl) {
      onShowShape(shape.pk, shape.settings?.linkToPage)
      return
    }
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
    <KonvaShape
      id={`konva_shape_${shape.pk}`}
      onClick={onClick}
      lineCap="round"
      lineJoin="round"
      sceneFunc={(ctx, canvas) => {
        ctx.rect(0, 0, canvas.getAttr('width'), canvas.getAttr('height'))
        ctx.beginPath()

        for (let i in shape.path) {
          const point = shape.path[i]
          drawPoint(point, ctx)
        }

        if (showShape) {
          ctx.shadowBlur = 50
          ctx.shadowColor = 'black'
          ctx.lineWidth = 10
          ctx.strokeStyle = playerColors.rightAnswerGrean
          ctx.stroke()
          ctx.restore()
          ctx.beginPath()

          eraseInnerShape(ctx, shape.path)
        }

        ctx.fillStrokeShape(canvas)
      }}
    />
  )
}

