import { Group, Rect } from 'react-konva'
import { Activity } from '../../../stores/activitiesStoreTypes'
import { PLAYER_HEIGHT, PLAYER_WIDTH, SHOW_HINTS_QUESTIONS_ACTIVITY } from '../../../utils/constants'
import DefaultWrongAnswer from '../../../assets/sounds/defaultWrongAnswer.mp3'
import { AnswerShape } from '../shapes/AnswerShape'
import { usePlayIntro } from '../../../hooks/usePlayIntro'
import { useShowHints } from '../../../hooks/useShowHints'
import { useState } from 'react'
import { SlideSoundObj } from '../../../hooks/useSlideSound'

interface QuestionsActivityProps {
  onFinishQuestion: () => void
  soundUrl: string
  isActivityActive: boolean
  transitionLoading: boolean
  activity: Activity
  baseUrl: string
  onWrongAnswer: () => void
  playShapeSound: ({ onend, soundUrl }: SlideSoundObj) => void
}

export function QuestionsActivity({
  onFinishQuestion,
  soundUrl,
  isActivityActive,
  transitionLoading,
  activity,
  baseUrl,
  onWrongAnswer,
  playShapeSound,
}: QuestionsActivityProps) {
  const [didFinish, setDidFinish] = useState(false)
  const { showHints, setShowHints } = useShowHints()

  const { playAgain, stop } = usePlayIntro({ soundUrl, isActivityActive, transitionLoading })

  const wrongAnswerSoundUrl = activity.shapes[0]?.filePathRecording2
    ? baseUrl + activity.shapes[0].filePathRecording2
    : DefaultWrongAnswer

  const onNoShapeClick = () => {
    if (didFinish) {
      return
    }
    if (SHOW_HINTS_QUESTIONS_ACTIVITY) {
      setShowHints(true)
    }
    stop()

    playShapeSound({
      soundUrl: wrongAnswerSoundUrl,
      onend: () => playAgain(),
    })
    onWrongAnswer()
  }

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
        onRightSoundEnd={onFinishQuestion}
        showShapeForce={showHints}
        stopIntroSound={stop}
        onRightClick={() => {
          setDidFinish(true)
        }}
        playShapeSound={playShapeSound}
      />
    </Group>
  )
}

