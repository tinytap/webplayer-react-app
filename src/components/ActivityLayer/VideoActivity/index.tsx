import { ActivitySettings } from '../../../stores/activitiesStoreTypes'
import { VideoContainer } from './styles'
import { getLocalVideo, getYoutubeVideoId } from '../../../utils'
import ReactPlayer from 'react-player'
import { usePlayerStore } from '../../../stores/playerStore'
import { useEffect } from 'react'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../../utils/constants'

const YOUTUBE_VIDEO_WIDTH = 527
const YOUTUBE_VIDEO_HEIGHT = 297
const LOCAL_VIDEO_WIDTH = 480
const LOCAL_VIDEO_HEIGHT = 360

interface VideoActivityProps {
  activitySettings: ActivitySettings
  moveToNextSlide: (index: number | undefined) => void
  baseUrl: string
}

export function VideoActivity({ activitySettings, moveToNextSlide, baseUrl }: VideoActivityProps) {
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

  const videoWidth = isLocalVideo ? LOCAL_VIDEO_WIDTH : YOUTUBE_VIDEO_WIDTH
  const videoHeight = isLocalVideo ? LOCAL_VIDEO_HEIGHT : YOUTUBE_VIDEO_HEIGHT

  const iframeStyle = {
    width: videoWidth,
    height: videoHeight,
    top: (PLAYER_HEIGHT - videoHeight) / 2,
    left: (PLAYER_WIDTH - videoWidth) / 2,
    transform: `matrix(${activitySettings.transform[0]},${activitySettings.transform[1]},${activitySettings.transform[2]},${activitySettings.transform[3]},${activitySettings.transform[4]},${activitySettings.transform[5]})`,
  }

  return (
    <VideoContainer iframeStyle={iframeStyle}>
      <ReactPlayer
        playing
        allowFullScreen
        stopOnUnmount
        onEnded={() => moveToNextSlide(activitySettings.linkToPage)}
        width={PLAYER_WIDTH}
        height={PLAYER_HEIGHT}
        url={videoPath}
        title="YouTube video player"
      />
    </VideoContainer>
  )
}

