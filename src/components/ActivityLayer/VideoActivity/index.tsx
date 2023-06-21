import { ActivitySettings } from '../../../stores/activitiesStoreTypes'
import { VideoContainer } from './styles'
import { getLocalVideo, getYoutubeVideoId } from '../../../utils'
import ReactPlayer from 'react-player'
import { usePlayerStore } from '../../../stores/playerStore'
import { useEffect } from 'react'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../../utils/constants'

const IFRAME_VIDEO_WIDTH = 527
const IFRAME_VIDEO_HEIGHT = 297

interface VideoActivityProps {
  activitySettings: ActivitySettings
  selectNextSlide: () => void
  baseUrl: string
}

export function VideoActivity({ activitySettings, selectNextSlide, baseUrl }: VideoActivityProps) {
  const tempMuteBackgroundMusic = usePlayerStore((state) => state.tempMuteBackgroundMusic)

  useEffect(() => {
    const returnMusicToOldValue = tempMuteBackgroundMusic()

    return () => {
      return returnMusicToOldValue()
    }
  }, [tempMuteBackgroundMusic])

  if (!activitySettings.videoURL) {
    return <></>
  }

  const isLocalVideo = activitySettings.videoURL.startsWith('local://')

  const videoPath = isLocalVideo
    ? getLocalVideo(baseUrl, activitySettings.videoURL)
    : `https://www.youtube.com/embed/${getYoutubeVideoId(activitySettings.videoURL)}`

  const iframeStyle = isLocalVideo
    ? undefined
    : {
        width: IFRAME_VIDEO_WIDTH,
        height: IFRAME_VIDEO_HEIGHT,
        top: (PLAYER_HEIGHT - IFRAME_VIDEO_HEIGHT) / 2,
        left: (PLAYER_WIDTH - IFRAME_VIDEO_WIDTH) / 2,
        transform: `matrix(${activitySettings.transform[0]},${activitySettings.transform[1]},${activitySettings.transform[2]},${activitySettings.transform[3]},${activitySettings.transform[4]},${activitySettings.transform[5]})`,
      }

  return (
    <VideoContainer iframeStyle={iframeStyle}>
      <ReactPlayer
        playing
        allowFullScreen
        stopOnUnmount
        onEnded={selectNextSlide}
        width={PLAYER_WIDTH}
        height={PLAYER_HEIGHT}
        url={videoPath}
        title="YouTube video player"
      />
    </VideoContainer>
  )
}

