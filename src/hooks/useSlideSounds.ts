import { useCallback, useEffect, useState } from 'react'
import useSound from 'use-sound'
import DefaultGoodAnswer from '../assets/sounds/defaultGoodAnswer.mp3'
import { PLAY_ACTIVITY_SOUND_AGAIN_TIME_S } from '../utils/constants'

interface usePlayIntroProps {
  isActive: boolean
  introUrl: string
  introWithLoop?: boolean
  onIntroEnd?: () => void
}

export function useSlideSounds({ isActive, introUrl, introWithLoop = false, onIntroEnd }: usePlayIntroProps) {
  const [startIntoTimer, setStartIntoTimer] = useState(false)

  const [play, { stop }] = useSound(introUrl, {
    onend: () => {
      if (onIntroEnd) {
        onIntroEnd()
      }

      setStartIntoTimer(true)
    },
  })

  const playIntro = useCallback(() => {
    stop()
    setStartIntoTimer(false)
    play()
  }, [stop, play])

  const { playSound: playSlideSound } = usePlayeSound({ isActive: isActive })

  const playSound = useCallback(
    (props: PlaySound) => {
      stop()
      playSlideSound(props)
    },
    [stop, playSlideSound],
  )

  useEffect(() => {
    if (!isActive) {
      return
    }
    playIntro()
    return () => {
      stop()
    }
  }, [isActive, playIntro, stop])

  useEffect(() => {
    if (!startIntoTimer || !introWithLoop) {
      return
    }
    let isMounted = false

    setTimeout(() => {
      if (isMounted) {
        return
      }
      playIntro()
    }, PLAY_ACTIVITY_SOUND_AGAIN_TIME_S * 1000)

    return () => {
      isMounted = true
    }
  }, [startIntoTimer, playIntro, introWithLoop])

  return { playIntroAgain: playIntro, stopIntro: stop, setStartIntoTimer, playSound }
}

export interface PlaySound {
  onend?: () => void
  soundUrl: string
  fireOnendOnSoundStop?: boolean
  id?: string
  didEnd?: boolean
  isLoaded?: boolean
  playSound?: boolean
}

interface usePlayeSoundProps {
  isActive: boolean
}

function usePlayeSound({ isActive }: usePlayeSoundProps) {
  const [playSoundObj, setPlaySoundObj] = useState<PlaySound>({
    soundUrl: DefaultGoodAnswer,
  })

  const [play, { stop }] = useSound(playSoundObj.soundUrl, {
    onend: () => {
      setPlaySoundObj((oldV) => ({ ...oldV, didEnd: true }))
    },
    onload: () => {
      setPlaySoundObj((oldV) => ({ ...oldV, isLoaded: true }))
    },
  })

  useEffect(() => {
    if (!playSoundObj.soundUrl || !playSoundObj.playSound || !playSoundObj.isLoaded || playSoundObj.didEnd) {
      return
    }

    play()
    return () => {
      stop()
    }
  }, [playSoundObj, stop, play])
  useEffect(() => {
    if (!playSoundObj.didEnd || !playSoundObj.onend) {
      return
    }
    playSoundObj.onend()
  }, [playSoundObj])

  useEffect(() => {
    if (isActive) {
      return
    }
    stop()
  }, [isActive, stop])

  const playSound = useCallback(({ onend, soundUrl, fireOnendOnSoundStop, id }: PlaySound) => {
    setPlaySoundObj((oldV) => {
      if (oldV.fireOnendOnSoundStop && oldV.onend && oldV.id !== id && !oldV.didEnd) {
        oldV.onend()
      }

      return {
        onend: onend,
        soundUrl: soundUrl,
        fireOnendOnSoundStop: fireOnendOnSoundStop,
        id: id,
        didEnd: false,
        isLoaded: soundUrl === oldV.soundUrl,
        playSound: true,
      }
    })
  }, [])

  return {
    playSound,
  }
}

