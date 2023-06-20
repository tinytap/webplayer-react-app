import { ActivitySettings } from '../../../stores/activitiesStoreTypes'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../../utils/constants'
import { Html } from 'react-konva-utils'
import { VideoIframe } from './styles'

interface VideoActivityProps {
  activitySettings: ActivitySettings
}

export function VideoActivity({ activitySettings }: VideoActivityProps) {
  if (!activitySettings.videoURL) {
    return <></>
  }

  return (
    <Html>
      <VideoIframe
        width={PLAYER_WIDTH}
        height={PLAYER_HEIGHT * (6 / 8)}
        allowFullScreen
        frameBorder={0}
        title="YouTube video player"
        //TODO: add the youtube video to the iframe
      />
    </Html>
  )
}

