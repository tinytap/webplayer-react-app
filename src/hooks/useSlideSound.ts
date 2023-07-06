import { useCallback, useEffect, useState } from 'react'
import useSound from 'use-sound'
import DefaultGoodAnswer from '../assets/sounds/defaultGoodAnswer.mp3'

export interface SlideSoundObj {
  onend?: () => void
  soundUrl: string
  fireOnendOnSoundStop?: boolean
  id?: string
  didEnd?: boolean
  isLoaded?: boolean
  playSound?: boolean
}

export function useSlideSound() {
  const [slideSoundObj, setSlideSoundObj] = useState<SlideSoundObj>({
    soundUrl: DefaultGoodAnswer,
  })

  const [play, { stop }] = useSound(slideSoundObj.soundUrl, {
    onend: () => {
      setSlideSoundObj((oldV) => ({ ...oldV, didEnd: true }))
    },
    onload: () => {
      setSlideSoundObj((oldV) => ({ ...oldV, isLoaded: true }))
    },
  })

  useEffect(() => {
    if (!slideSoundObj.soundUrl || !slideSoundObj.playSound || !slideSoundObj.isLoaded || slideSoundObj.didEnd) {
      return
    }

    play()
    return () => {
      stop()
    }
  }, [slideSoundObj, stop, play])
  useEffect(() => {
    if (!slideSoundObj.didEnd || !slideSoundObj.onend) {
      return
    }
    slideSoundObj.onend()
  }, [slideSoundObj])

  const playSlideSound = useCallback(
    ({ onend, soundUrl, fireOnendOnSoundStop, id }: SlideSoundObj) => {
      if (
        slideSoundObj.fireOnendOnSoundStop &&
        slideSoundObj.onend &&
        slideSoundObj.id !== id &&
        !slideSoundObj.didEnd
      ) {
        slideSoundObj.onend()
      }

      setSlideSoundObj({
        onend: onend,
        soundUrl: soundUrl,
        fireOnendOnSoundStop: fireOnendOnSoundStop,
        id: id,
        didEnd: false,
        isLoaded: soundUrl === slideSoundObj.soundUrl,
        playSound: true,
      })
    },
    [slideSoundObj],
  )

  return {
    playSlideSound,
  }
}

