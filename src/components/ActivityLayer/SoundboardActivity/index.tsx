import { Group, Rect } from 'react-konva'
import { Activity } from '../../../stores/activitiesStoreTypes'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../../utils/constants'
import DefaultWrongAnswer from '../../../assets/sounds/defaultWrongAnswer.mp3'
import { AnswerShape } from '../shapes/AnswerShape'
import { usePlayIntro } from '../../../hooks/usePlayIntro'
import { useShowHints } from '../../../hooks/useShowHints'
import { updateShapesStatus } from '../../../utils'
import { useShapesStatus } from '../../../hooks/useShapesStatus'
import { SlideSoundObj } from '../../../hooks/useSlideSound'

interface SoundboardActivityProps {
  moveToNextSlide: (index?: number) => void
  soundUrl: string
  isActivityActive: boolean
  transitionLoading: boolean
  activity: Activity
  baseUrl: string
  isQuizMode: boolean
  onWrongAnswer: () => void
  playSlideSound: (props: SlideSoundObj) => void
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
  playSlideSound,
}: SoundboardActivityProps) {
  const { showHints, setShowHints } = useShowHints()
  const { setShapeStatus } = useShapesStatus({ shapes: activity.shapes, moveToNextSlide })

  const { stop, setStartIntoWithTimer } = usePlayIntro({
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

  const onShapeRightSoundEnd = (shapePk: number, linkToPage?: number) => {
    setStartIntoWithTimer(true)

    updateShapesStatus({ setClickedShapes: setShapeStatus, shapePk, linkToPage })
  }

  const onNoShapeClick = () => {
    setStartIntoWithTimer(true)

    if (!isQuizMode) {
      if (!activity.settings.soundHideHints) {
        setShowHints(true)
      }
      return
    }

    stop()
    playSlideSound({ soundUrl: DefaultWrongAnswer })
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
            playShapeSound={playSlideSound}
            onRightClick={() => setStartIntoWithTimer(false)}
          />
        )
      })}
    </Group>
  )
}

