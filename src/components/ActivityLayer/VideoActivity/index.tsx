import { ActivitySettings } from '../../../stores/activitiesStoreTypes'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../../utils/constants'
import { Html } from 'react-konva-utils'
import { IFRAME_MARGIN_TOP_PERCENTAGE, VideoContainer } from './styles'
import { youtubeParser } from '../../../utils'
import ReactPlayer from 'react-player'

interface VideoActivityProps {
  activitySettings: ActivitySettings
  selectNextSlide: () => void
}

export function VideoActivity({ activitySettings, selectNextSlide }: VideoActivityProps) {
  if (!activitySettings.videoURL) {
    return <></>
  }

  const videoId = youtubeParser(activitySettings.videoURL)

  return (
    <Html>
      <VideoContainer>
        <ReactPlayer
          playing
          allowFullScreen
          stopOnUnmount
          onEnded={selectNextSlide}
          width={PLAYER_WIDTH}
          height={PLAYER_HEIGHT * (1 - IFRAME_MARGIN_TOP_PERCENTAGE * 2)}
          url={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
        />
      </VideoContainer>
    </Html>
  )
}

