import { Transition } from 'react-transition-group'

import { LoaderContainer, LoaderSpinner } from './styles'
import SpinnerLoader from '../../assets/spinner.gif'
import { useEffect, useRef } from 'react'
import { usePlayerStore } from '../../stores/playerStore'
import { useGameStore } from '../../stores/gameStore'
interface LoaderScreenProps {
  //shown: boolean
}
export function LoaderScreen({}: LoaderScreenProps) {
  const gameReady = useGameStore((state) => state.gameReady)
  const loadingGame = usePlayerStore((state) => state.isLoading)
  const setIsLoading = usePlayerStore((state) => state.setIsLoading)

  const nodeRef = useRef(null)
  useEffect(() => {
    if (!!gameReady && !!loadingGame) {
      setIsLoading(false)
    }
  }, [gameReady])

  return (
    <Transition in={loadingGame} timeout={1000} nodeRef={nodeRef} unmountOnExit={true}>
      {(state: string) => (
        // state change: exited -> entering -> entered -> exiting -> exited
        <LoaderContainer state={state} ref={nodeRef}>
          <LoaderSpinner src={SpinnerLoader} />
        </LoaderContainer>
      )}
    </Transition>
  )
}

