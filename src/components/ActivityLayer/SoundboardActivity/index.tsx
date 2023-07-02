import { useEffect, useState } from 'react'
import { Group, Rect } from 'react-konva'
import useSound from 'use-sound'
import { Activity } from '../../../stores/activitiesStoreTypes'
import { PLAYER_HEIGHT, PLAYER_WIDTH, SHOW_HINT_TIME_S } from '../../../utils/constants'
import DefaultWrongAnswer from '../../../assets/sounds/defaultWrongAnswer.mp3'
import { AnswerShape } from '../shapes/AnswerShape'

interface ClickedShapes {
  [shapePk: number]: { didClickShape: boolean; linkToPage?: number }
}

interface SoundboardActivityProps {
  moveToNextSlide: (index?: number) => void
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
}: SoundboardActivityProps) {
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

      if (linkToPage !== undefined) {
        moveToNextSlide(linkToPage)
        return
      }
      if (allShapesAreClicked) {
        moveToNextSlide()
      }
    }
    slideNavigate()
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
    <Group>
      <Rect x={0} y={0} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} onClick={onNoShapeClick} />
      {activity.shapes.map((shape, i) => {
        return (
          <AnswerShape
            shape={shape}
            baseUrl={baseUrl}
            key={`shape_${shape.pk}_${i}`}
            onShowShape={onShowShape}
            isFunMode={activity.settings.soundFunMode !== false}
            showShapeForce={showHints}
          />
        )
      })}
    </Group>
  )
}

