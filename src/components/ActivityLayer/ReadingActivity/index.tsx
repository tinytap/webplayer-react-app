import { Rect } from 'react-konva'
import { useSlideSounds } from '../../../hooks/useSlideSounds'
import { ActivitySettings } from '../../../stores/activitiesStoreTypes'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../../utils/constants'

interface ReadingActivityProps {
  moveToNextSlide: (index: number | undefined) => void
  soundUrl: string
  isActive: boolean
  activitySettings: ActivitySettings
  doesSlideHaveClickableLayer?: boolean
}

export function ReadingActivity({
  moveToNextSlide,
  soundUrl,
  isActive,
  activitySettings,
  doesSlideHaveClickableLayer = false,
}: ReadingActivityProps) {
  useSlideSounds({
    isActive: isActive,
    introUrl: soundUrl,
    onIntroEnd: () => {
      if (!activitySettings.advance || doesSlideHaveClickableLayer) {
        return
      }
      moveToNextSlide(activitySettings.linkToPage)
    },
  })

  const onClick = () => {
    if (activitySettings.advance || doesSlideHaveClickableLayer) {
      return
    }
    moveToNextSlide(activitySettings.linkToPage)
  }

  return <Rect x={0} y={0} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} onClick={onClick} />
}

