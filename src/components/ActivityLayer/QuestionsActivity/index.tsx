import { Group, Rect } from 'react-konva'
import { Activity } from '../../../stores/activitiesStoreTypes'
import { PLAYER_HEIGHT, PLAYER_WIDTH, SHOW_HINTS_QUESTIONS_ACTIVITY } from '../../../utils/constants'
import DefaultWrongAnswer from '../../../assets/sounds/defaultWrongAnswer.mp3'
import { AnswerShape } from '../shapes/AnswerShape'
import { useShowHints } from '../../../hooks/useShowHints'
import { useState } from 'react'
import { useSlideSounds } from '../../../hooks/useSlideSounds'

interface QuestionsActivityProps {
  onFinishQuestion: () => void
  soundUrl: string
  isActive: boolean
  activity: Activity
  baseUrl: string
  onWrongAnswer: () => void
}

export function QuestionsActivity({
  onFinishQuestion,
  soundUrl,
  isActive,
  activity,
  baseUrl,
  onWrongAnswer,
}: QuestionsActivityProps) {
  const [didFinish, setDidFinish] = useState(false)
  const { showHints, setShowHints } = useShowHints()

  const { playSound, playIntroAgain, setStartIntoTimer } = useSlideSounds({
    isActive: isActive,
    introUrl: soundUrl,
    introWithLoop: true,
  })

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
    setStartIntoTimer(false)

    playSound({
      soundUrl: wrongAnswerSoundUrl,
      onend: () => playIntroAgain(),
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
        onRightClick={() => setDidFinish(true)}
        playShapeSound={playSound}
      />
    </Group>
  )
}

