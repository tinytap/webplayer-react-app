import { ActivitySettings } from '../../../stores/activitiesStoreTypes'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../../utils/constants'
import { Html } from 'react-konva-utils'
import { IFRAME_MARGIN_TOP_PERCENTAGE, VideoIframe } from './styles'
import { youtubeParser } from '../../../utils'

interface VideoActivityProps {
  activitySettings: ActivitySettings
}

export function VideoActivity({ activitySettings }: VideoActivityProps) {
  if (!activitySettings.videoURL) {
    return <></>
  }

  const videoId = youtubeParser(activitySettings.videoURL)

  return (
    <Html>
      <VideoIframe
        width={PLAYER_WIDTH}
        height={PLAYER_HEIGHT * (1 - IFRAME_MARGIN_TOP_PERCENTAGE * 2)}
        src={`https://www.youtube.com/embed/${videoId}?autoPlay=1&autoHide=1&controls=0`}
        allowFullScreen
        frameBorder={0}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    </Html>
  )
}

