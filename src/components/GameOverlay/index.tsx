import { Transition } from 'react-transition-group'

import { OverlayContainer } from './styles'
import SpinnerLoader from '../../assets/spinner.gif'
import { useRef } from 'react'
import { usePlayerStore } from '../../stores/playerStore'
import { useGameStore } from '../../stores/gameStore'
import { Album } from '../../stores/gameStoreTypes'
import { PlayButton } from '../PlayButton'
import { useActivitiesStore } from '../../stores/activitiesStore'
interface GameOverlayProps {}
export function GameOverlay({}: GameOverlayProps) {
  const gameStarted = usePlayerStore((state) => state.gameStarted)
  const selectedSlideIndex = useGameStore((state) => state.selectedSlideIndex)
  const activities = useActivitiesStore((state) => state.activities)
  const selectedActivity = activities[selectedSlideIndex || 0]
  const nodeRef = useRef(null)

  return selectedActivity ? (
    <Transition
      in={selectedActivity.paused}
      out={!selectedActivity.paused}
      timeout={100}
      nodeRef={nodeRef}
      unmountOnExit={false}
    >
      {(state: string) => (
        // state change: exited -> entering -> entered -> exiting -> exited
        <OverlayContainer state={state} ref={nodeRef} rgb={'rgb(0 0 0 / 42%)'} />
      )}
    </Transition>
  ) : null
}

