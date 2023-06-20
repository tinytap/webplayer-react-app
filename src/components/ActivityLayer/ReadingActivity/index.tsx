import { useEffect } from 'react'
import { Rect } from 'react-konva'
import useSound from 'use-sound'
import { ActivitySettings, ActivityState } from '../../../stores/activitiesStoreTypes'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../../utils/constants'

interface ReadingActivityProps {
  moveToNextSlide: (index: number | undefined) => void
  soundUrl: string
  activityState: ActivityState
  transitionLoading: boolean
  activitySettings: ActivitySettings
}

export function ReadingActivity({
  moveToNextSlide,
  soundUrl,
  activityState,
  transitionLoading,
  activitySettings,
}: ReadingActivityProps) {
  const [play, { stop }] = useSound(soundUrl, {
    onend: () => {
      if (!activitySettings.advance || activityState.doesSlideHaveClickableLayer) {
        return
      }
      moveToNextSlide(activitySettings.linkToPage)
    },
  })

  const onClick = () => {
    if (activitySettings.advance || activityState.doesSlideHaveClickableLayer) {
      return
    }
    stop()
    moveToNextSlide(activitySettings.linkToPage)
  }

  useEffect(() => {
    if (!activityState.started || activityState.paused || transitionLoading) {
      stop()
      return
    }

    play()
  }, [activityState, play, transitionLoading, stop])

  return <Rect x={0} y={0} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} onClick={onClick} />
}

