import { Group, Rect } from 'react-konva'
import useSound from 'use-sound'
import { Activity } from '../../../stores/activitiesStoreTypes'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../../utils/constants'
import DefaultWrongAnswer from '../../../assets/sounds/defaultWrongAnswer.mp3'
import { AnswerShape } from '../shapes/AnswerShape'
import { usePlayIntro } from '../../../hooks/usePlayIntro'
import { useShowHints } from '../../../hooks/useShowHints'
import { updateShapesStatus } from '../../../utils'
import { useShapesStatus } from '../../../hooks/useShapesStatus'

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
  const { showHints, setShowHints } = useShowHints()
  const { setShapeStatus } = useShapesStatus({ shapes: activity.shapes, moveToNextSlide })

  const { stop, startTimerAgain } = usePlayIntro({
    soundUrl,
    isActivityActive,
    transitionLoading,
    playIntroAgainWithTimer: !!activity.settings.soundFunModeV2,
    onSoundEnd: () => {
      if (activity.settings.kIsShowSoundboardHintsOnStart) {
        setShowHints(true)
      }
    },
  })

  const [playWrongAnswer, { stop: stopWrongAnswer }] = useSound(DefaultWrongAnswer)

  const onShapeRightSoundEnd = (shapePk: number, linkToPage?: number) => {
    startTimerAgain()

    updateShapesStatus({ setClickedShapes: setShapeStatus, shapePk, linkToPage })
  }

  const onNoShapeClick = () => {
    startTimerAgain()

    if (!isQuizMode) {
      if (!activity.settings.soundHideHints) {
        setShowHints(true)
      }
      return
    }

    stop()
    stopWrongAnswer()
    playWrongAnswer()
    onWrongAnswer()
  }

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
            onRightSoundEnd={onShapeRightSoundEnd}
            isFunMode={activity.settings.soundFunMode !== false}
            showShapeForce={showHints}
            stopIntroSound={stop}
          />
        )
      })}
    </Group>
  )
}

