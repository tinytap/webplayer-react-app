import { useMemo, useState } from 'react'
import { Star } from 'react-konva'
import { useActivitiesStore } from '../../stores/activitiesStore'
import { Activity, ActivityState } from '../../stores/activitiesStoreTypes'
import { useGameStore } from '../../stores/gameStore'
import { shakeContainer } from '../../utils'
import { PuzzleActivity } from './PuzzleActivity'
import { QuestionsActivity } from './QuestionsActivity'
import { ReadingActivity } from './ReadingActivity'
import { SoundboardActivity } from './SoundboardActivity'
import { TalkOrTypeActivity } from './TalkOrTypeActivity'
import { VideoActivity } from './VideoActivity'

interface ActivitiesLayerProps {
  selected: boolean
  slideIndex: number
  isPrevSlide: boolean
  transitionLoading: boolean
  base_url: string
  slidePathImage: string
  interactiveLayers: any[]
}

export const ActivitiesLayer = ({
  selected,
  slideIndex,
  isPrevSlide,
  transitionLoading,
  base_url,
  slidePathImage,
  interactiveLayers,
}: ActivitiesLayerProps) => {
  // Retrieve slide activity for the current slide
  const slideActivityState = useActivitiesStore((state) => state.getSlideActivityState(slideIndex))
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)

  const ActivityElement = useMemo(() => {
    if (
      !slideActivityState?.activities ||
      !slideActivityState.activities.length ||
      (!selected && !isPrevSlide) ||
      (isPrevSlide && !transitionLoading)
    ) {
      setCurrentActivityIndex(0)
      return <></>
    }
    const activity = slideActivityState.activities[currentActivityIndex]

    if (!activity) {
      setCurrentActivityIndex(0)
      return <></>
    }

    return (
      <ActivityLayer
        engine={slideActivityState.engineType}
        key={activity.pk + '_activity'}
        baseUrl={base_url}
        activity={activity}
        activityState={{ ...slideActivityState, activities: undefined }}
        onMoveToNextActivity={() => {
          const newActivityIndex = currentActivityIndex + 1

          if (newActivityIndex < slideActivityState.activities!.length) {
            setCurrentActivityIndex(newActivityIndex)
            return true
          }
          return false
        }}
        slidePathImage={base_url + slidePathImage}
        transitionLoading={transitionLoading}
        interactiveLayers={interactiveLayers}
      />
    )
  }, [
    selected,
    slideActivityState,
    base_url,
    currentActivityIndex,
    slidePathImage,
    isPrevSlide,
    transitionLoading,
    interactiveLayers,
  ])

  return ActivityElement
}

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
  slidePathImage: string
  transitionLoading: boolean
  interactiveLayers: any[]
}

function ActivityLayer({
  baseUrl,
  activity,
  activityState,
  engine,
  onMoveToNextActivity,
  slidePathImage,
  transitionLoading,
  interactiveLayers,
}: ActivityLayerProps) {
  const soundUrl = baseUrl + activity.filePathIntroRecording
  const selectNextSlide = useGameStore((state) => state.selectNextSlide)
  const selectSlideIndex = useGameStore((state) => state.selectSlideIndex)
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

  const onWrongAnswerEvent = () => {
    shakeContainer()
  }

  const moveToNextSlide = (index?: number) => {
    if (index !== undefined) {
      selectSlideIndex(index)
    } else {
      selectNextSlide()
    }
  }

  const isActivityActive = !activityState.paused && !!activityState.started && !transitionLoading

  switch (engine) {
    case 'R':
      return (
        <ReadingActivity
          soundUrl={soundUrl}
          isActive={isActivityActive}
          activitySettings={activity.settings}
          moveToNextSlide={moveToNextSlide}
          interactiveLayers={interactiveLayers}
        />
      )
    case 'S':
      return <></>
    case 'A':
      return (
        <SoundboardActivity
          moveToNextSlide={moveToNextSlide}
          soundUrl={soundUrl}
          isActive={isActivityActive}
          activity={activity}
          baseUrl={baseUrl}
          isQuizMode={isQuizMode}
          onWrongAnswer={onWrongAnswerEvent}
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
          isActive={isActivityActive}
          activity={activity}
          baseUrl={baseUrl}
          onWrongAnswer={onWrongAnswerEvent}
        />
      )
    case 'P':
      return (
        <PuzzleActivity
          moveToNextSlide={moveToNextSlide}
          soundUrl={soundUrl}
          isActive={isActivityActive}
          activity={activity}
          baseUrl={baseUrl}
          onWrongAnswer={onWrongAnswerEvent}
          slidePathImage={slidePathImage}
        />
      )
    case 'T':
      return (
        <TalkOrTypeActivity
          moveToNextSlide={moveToNextSlide}
          soundUrl={soundUrl}
          isActive={isActivityActive}
          activity={activity}
          baseUrl={baseUrl}
          onWrongAnswer={onWrongAnswerEvent}
        />
      )
    case 'V':
      return <VideoActivity activitySettings={activity.settings} moveToNextSlide={moveToNextSlide} baseUrl={baseUrl} />

    default:
      return <Star numPoints={10} innerRadius={50} outerRadius={100} x={300} y={300} fill="red" />
  }
}

