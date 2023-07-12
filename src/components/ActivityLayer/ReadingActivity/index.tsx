import { Rect } from 'react-konva'
import { useSlideSounds } from '../../../hooks/useSlideSounds'
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
  useSlideSounds({
    isActive: activityState.started && !activityState.paused && !transitionLoading,
    introUrl: soundUrl,
    onIntroEnd: () => {
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
    moveToNextSlide(activitySettings.linkToPage)
  }

  return <Rect x={0} y={0} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} onClick={onClick} />
}

