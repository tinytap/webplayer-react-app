import { useCallback, useEffect, useState } from 'react'
import useSound from 'use-sound'
import { PLAY_ACTIVITY_SOUND_AGAIN_TIME_S } from '../utils/constants'

interface IntroPlayerProps {
  isActivityActive: boolean
  transitionLoading: boolean
  soundUrl: string
  playIntroAgainWithTimer?: boolean
  onSoundEnd?: () => void
}

export function usePlayIntro({
  isActivityActive,
  transitionLoading,
  soundUrl,
  playIntroAgainWithTimer = true,
  onSoundEnd,
}: IntroPlayerProps) {
  const [didIntoEnd, setDidIntoEnd] = useState(false)
  const [playIntro, setPlayIntro] = useState(0)

  const [play, { stop }] = useSound(soundUrl, {
    onend: () => {
      if (onSoundEnd) {
        onSoundEnd()
      }

      if (playIntroAgainWithTimer) {
        setDidIntoEnd(true)
      }
    },
  })

  const playAgain = useCallback(() => {
    setPlayIntro(Math.random())
  }, [])

  useEffect(() => {
    if (!isActivityActive || transitionLoading) {
      stop()
      return
    }

    setDidIntoEnd(false)
    play()

    return () => {
      stop()
    }
  }, [isActivityActive, play, transitionLoading, stop, playIntro])

  useEffect(() => {
    if (!didIntoEnd) {
      return
    }
    let isMounted = false

    setTimeout(() => {
      if (isMounted) {
        return
      }
      playAgain()
    }, PLAY_ACTIVITY_SOUND_AGAIN_TIME_S * 1000)

    return () => {
      isMounted = true
    }
  }, [play, didIntoEnd, playAgain])

  return { playAgain, stop }
}

