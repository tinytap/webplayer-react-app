import { Transition } from 'react-transition-group'

import { OverlayContainer } from './styles'
import { useRef } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useActivitiesStore } from '../../stores/activitiesStore'

export function GameOverlay() {
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

