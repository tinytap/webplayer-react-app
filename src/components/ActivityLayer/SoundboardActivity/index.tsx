import { Group, Rect } from 'react-konva'
import { Activity } from '../../../stores/activitiesStoreTypes'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../../utils/constants'
import DefaultWrongAnswer from '../../../assets/sounds/defaultWrongAnswer.mp3'
import { AnswerShape } from '../shapes/AnswerShape'
import { useShowHints } from '../../../hooks/useShowHints'
import { updateShapesStatus } from '../../../utils'
import { useShapesStatus } from '../../../hooks/useShapesStatus'
import { useSlideSounds } from '../../../hooks/useSlideSounds'

interface SoundboardActivityProps {
  moveToNextSlide: (index?: number) => void
  soundUrl: string
  isActive: boolean
  activity: Activity
  baseUrl: string
  isQuizMode: boolean
  onWrongAnswer: () => void
}

export function SoundboardActivity({
  moveToNextSlide,
  soundUrl,
  isActive,
  activity,
  baseUrl,
  isQuizMode,
  onWrongAnswer,
}: SoundboardActivityProps) {
  const { showHints, setShowHints } = useShowHints()
  const { setShapeStatus } = useShapesStatus({ shapes: activity.shapes, moveToNextSlide })

  const { setStartIntoTimer, playSound } = useSlideSounds({
    isActive: isActive,
    introUrl: soundUrl,
    introWithLoop: !!activity.settings.soundFunModeV2,
    onIntroEnd: () => {
      if (activity.settings.kIsShowSoundboardHintsOnStart) {
        setShowHints(true)
      }
    },
  })

  const onShapeRightSoundEnd = (shapePk: number, linkToPage?: number) => {
    setStartIntoTimer(true)

    updateShapesStatus({ setClickedShapes: setShapeStatus, shapePk, linkToPage })
  }

  const onNoShapeClick = () => {
    if (!isQuizMode) {
      if (!activity.settings.soundHideHints) {
        setShowHints(true)
      }
      return
    }

    setStartIntoTimer(false)
    playSound({ soundUrl: DefaultWrongAnswer, onend: () => setStartIntoTimer(true) })
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
            playShapeSound={playSound}
            onRightClick={() => {
              setStartIntoTimer(false)
            }}
          />
        )
      })}
    </Group>
  )
}

