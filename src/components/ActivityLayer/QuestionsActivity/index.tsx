import { useEffect, useState } from 'react'
import { Group, Rect } from 'react-konva'
import useSound from 'use-sound'
import { Activity } from '../../../stores/activitiesStoreTypes'
import { PLAYER_HEIGHT, PLAYER_WIDTH, SHOW_HINTS_QUESTIONS_ACTIVITY, SHOW_HINT_TIME_S } from '../../../utils/constants'
import DefaultWrongAnswer from '../../../assets/sounds/defaultWrongAnswer.mp3'
import { AnswerShape } from '../shapes/AnswerShape'

interface QuestionsActivityProps {
  onFinishQuestion: () => void
  soundUrl: string
  isActivityActive: boolean
  transitionLoading: boolean
  activity: Activity
  baseUrl: string
  onWrongAnswer: () => void
}

export function QuestionsActivity({
  onFinishQuestion,
  soundUrl,
  isActivityActive,
  transitionLoading,
  activity,
  baseUrl,
  onWrongAnswer,
}: QuestionsActivityProps) {
  const [showHints, setShowHints] = useState(false)

  const [play, { stop }] = useSound(soundUrl, {
    onend: () => {
      // TODO: play again in 30 seconds if nothing is clicked
    },
  })

  const wrongAnswerSoundUrl = activity.shapes[0]?.filePathRecording2
    ? baseUrl + activity.shapes[0].filePathRecording2
    : DefaultWrongAnswer

  const [playWrongAnswer, { stop: stopWrongAnswer }] = useSound(wrongAnswerSoundUrl, {
    onend: () => {
      // TODO: does not always play again
      play()
    },
  })

  const onNoShapeClick = () => {
    if (SHOW_HINTS_QUESTIONS_ACTIVITY) {
      setShowHints(true)
    }
    stop()
    stopWrongAnswer()
    playWrongAnswer()
    onWrongAnswer()
  }

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
    if (!showHints || !SHOW_HINTS_QUESTIONS_ACTIVITY) {
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
      <AnswerShape
        shape={activity.shapes[0]}
        baseUrl={baseUrl}
        key={`shape_${activity.shapes[0].pk}`}
        onShowShape={onFinishQuestion}
        showShapeForce={showHints}
        stopIntroSound={stop}
      />
    </Group>
  )
}

