import { ActionButton } from '../ActionButton'
import { BackgroundMusicIconContainer } from './styles'
import SvgIcon from '../SvgIcon'
import useSound from 'use-sound'
import { useGameStore } from '../../stores/gameStore'
import { useEffect } from 'react'
import { usePlayerStore } from '../../stores/playerStore'
import { STATIC_SOUNDS_BASE, BG_MUSIC_VOLUME } from '../../utils/constants'

interface BackgroundMusicIconProps {}
export function BackgroundMusicIcon({}: BackgroundMusicIconProps) {
    const backgroundMusicFile = useGameStore((state) => state.music)
    const base_url = useGameStore((state) => state.base_url)
    const gameStarted = usePlayerStore((state) => state.gameStarted)
    const backgroundMusicPlaying = usePlayerStore((state) => state.backgroundMusicPlaying)
    const backgroundMusicMuted = usePlayerStore((state) => state.backgroundMusicMuted)
    const setBackgroundMusicMute = usePlayerStore((state) => state.setBackgroundMusicMute)

    const backgroundMusicPath = backgroundMusicFile
        ? backgroundMusicFile.includes('MediaResources')
            ? STATIC_SOUNDS_BASE + backgroundMusicFile
            : backgroundMusicFile
        : ''
    const [playBackgroundMusic, { sound }] = useSound(backgroundMusicPath, { volume: BG_MUSIC_VOLUME, loop: true })

    const handleMusicIconClick = () => {
        console.log(sound, 'backgroundMusic')
        if (!backgroundMusicPath || !sound) return
        if (backgroundMusicMuted) {
            sound.fade(0, BG_MUSIC_VOLUME, 200)
            setBackgroundMusicMute(false)
        } else {
            sound.fade(BG_MUSIC_VOLUME, 0, 200)
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
    }, [gameStarted])

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

