import { ActionButton } from '../ActionButton'
import { BackgroundMusicIconContainer } from './styles'
import SvgIcon from '../SvgIcon'
import useSound from 'use-sound'
import { useGameStore } from '../../stores/gameStore'
import { useEffect } from 'react'
import { usePlayerStore } from '../../stores/playerStore'
import { STATIC_SOUNDS_BASE, BG_MUSIC_VOLUME } from '../../utils/constants'

export function BackgroundMusicIcon() {
  const backgroundMusicPath = useGameStore((state) => {
    const backgroundMusicFile = state.music
    const backgroundMusic = backgroundMusicFile
      ? backgroundMusicFile.includes('MediaResources')
        ? STATIC_SOUNDS_BASE + backgroundMusicFile
        : backgroundMusicFile
      : ''

    return backgroundMusic
  })
  const gameStarted = usePlayerStore((state) => state.gameStarted)
  const backgroundMusicPlaying = usePlayerStore((state) => state.backgroundMusicPlaying)
  const backgroundMusicMuted = usePlayerStore((state) => state.backgroundMusicMuted)
  const setBackgroundMusicMute = usePlayerStore((state) => state.setBackgroundMusicMute)

  const [playBackgroundMusic, { sound }] = useSound(backgroundMusicPath, { volume: BG_MUSIC_VOLUME, loop: true })

  const handleMusicIconClick = () => {
    if (backgroundMusicMuted) {
      setBackgroundMusicMute(false)
    } else {
      setBackgroundMusicMute(true)
    }
  }

  useEffect(() => {
    if (!backgroundMusicPath) return
    if (gameStarted && !backgroundMusicPlaying) {
      playBackgroundMusic()
      //sound.fade(0, BG_MUSIC_VOLUME, 200)
    }

    return () => {
      if (!sound || !sound.stop) return
      sound.stop()
    }
  }, [gameStarted, backgroundMusicPath, backgroundMusicPlaying, playBackgroundMusic, sound])

  useEffect(() => {
    if (!backgroundMusicPath || !sound) return
    if (!backgroundMusicMuted) {
      sound.fade(0, BG_MUSIC_VOLUME, 200)
    } else {
      sound.fade(BG_MUSIC_VOLUME, 0, 200)
    }
  }, [backgroundMusicPath, sound, backgroundMusicMuted])

  return (
    <ActionButton animation={'scale'} onClick={handleMusicIconClick}>
      <BackgroundMusicIconContainer>
        <SvgIcon
          iconName={backgroundMusicMuted ? 'music-off' : 'music-on'}
          svgProp={{ stroke: 'transparent', fill: 'white' }}
        />
      </BackgroundMusicIconContainer>
    </ActionButton>
  )
}

