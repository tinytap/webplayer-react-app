import React from 'react'
import { SlideSoundObj } from '../../hooks/useSlideSound'

interface PlayerContextProps {
  playSlideSound: (props: SlideSoundObj) => void
}

export const PlayerContext = React.createContext<PlayerContextProps>({ playSlideSound: () => {} })

