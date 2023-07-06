import { Star } from 'react-konva'
import { useSlideSound } from '../../hooks/useSlideSound'
import { Activity, ActivityState } from '../../stores/activitiesStoreTypes'
import { useGameStore } from '../../stores/gameStore'
import { usePlayerStore } from '../../stores/playerStore'
import { PuzzleActivity } from './PuzzleActivity'
import { QuestionsActivity } from './QuestionsActivity'
import { ReadingActivity } from './ReadingActivity'
import { SoundboardActivity } from './SoundboardActivity'
import { TalkOrTypeActivity } from './TalkOrTypeActivity'
import { VideoActivity } from './VideoActivity'

interface ActivityLayerProps {
  baseUrl: string
  engine: 'S' | 'R' | 'A' | 'V' | 'P' | 'Q' | 'T'
  /*| 'slide'
    | 'reading'
    | 'soundboard'
    | 'video'
    | 'puzzle'
    | 'questions'
    | 'text input'*/
  activity: Activity
  activityState: ActivityState
  onMoveToNextActivity: () => boolean
  slideThumbnailUrl: string
}

export function ActivityLayer({
  baseUrl,
  activity,
  activityState,
  engine,
  onMoveToNextActivity,
  slideThumbnailUrl,
}: ActivityLayerProps) {
  const transitionLoading = useGameStore((state) => state.transitionLoading)
  const soundUrl = baseUrl + activity.filePathIntroRecording
  const selectNextSlide = useGameStore((state) => state.selectNextSlide)
  const selectSlideIndex = useGameStore((state) => state.selectSlideIndex)
  const onWrongAnswerEvent = usePlayerStore((state) => () => state.setWrongAnswerEvent(true))
  const isQuizMode = useGameStore((state) => {
    if (
      state.settings.quizParameters &&
      state.settings.quizParameters.quizModeEnabled &&
      (state.settings.quizParameters.activityTimeLimit || state.settings.quizParameters.globalTimeLimit)
    ) {
      return true
    }
    return false
  })

  const { playSlideSound } = useSlideSound()

  const moveToNextSlide = (index?: number) => {
    if (index !== undefined) {
      selectSlideIndex(index)
    } else {
      selectNextSlide()
    }
  }

  switch (engine) {
    case 'R':
      return (
        <ReadingActivity
          soundUrl={soundUrl}
          activityState={activityState}
          transitionLoading={transitionLoading}
          activitySettings={activity.settings}
          moveToNextSlide={moveToNextSlide}
        />
      )
    case 'S':
      return <></>
    case 'A':
      return (
        <SoundboardActivity
          moveToNextSlide={moveToNextSlide}
          soundUrl={soundUrl}
          isActivityActive={!activityState.paused && !!activityState.started}
          transitionLoading={transitionLoading}
          activity={activity}
          baseUrl={baseUrl}
          isQuizMode={isQuizMode}
          onWrongAnswer={onWrongAnswerEvent}
          playShapeSound={playSlideSound}
        />
      )
    case 'Q':
      return (
        <QuestionsActivity
          onFinishQuestion={() => {
            const didMove = onMoveToNextActivity()
            if (didMove) {
              return
            }
            moveToNextSlide()
          }}
          soundUrl={soundUrl}
          isActivityActive={!activityState.paused && !!activityState.started}
          transitionLoading={transitionLoading}
          activity={activity}
          baseUrl={baseUrl}
          onWrongAnswer={onWrongAnswerEvent}
          playShapeSound={playSlideSound}
        />
      )
    case 'P':
      return (
        <PuzzleActivity
          moveToNextSlide={moveToNextSlide}
          soundUrl={soundUrl}
          isActivityActive={!activityState.paused && !!activityState.started}
          transitionLoading={transitionLoading}
          activity={activity}
          baseUrl={baseUrl}
          onWrongAnswer={onWrongAnswerEvent}
          slideThumbnailUrl={slideThumbnailUrl}
          playShapeSound={playSlideSound}
        />
      )
    case 'T':
      return (
        <TalkOrTypeActivity
          moveToNextSlide={moveToNextSlide}
          soundUrl={soundUrl}
          isActivityActive={!activityState.paused && !!activityState.started}
          transitionLoading={transitionLoading}
          activity={activity}
          baseUrl={baseUrl}
          onWrongAnswer={onWrongAnswerEvent}
          playShapeSound={playSlideSound}
        />
      )
    case 'V':
      return <VideoActivity activitySettings={activity.settings} moveToNextSlide={moveToNextSlide} baseUrl={baseUrl} />

    default:
      return <Star numPoints={10} innerRadius={50} outerRadius={100} x={300} y={300} fill="red" />
  }
}

