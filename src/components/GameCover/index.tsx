import { Transition } from 'react-transition-group'

import { CoverContainer, CoverImage } from './styles'
import SpinnerLoader from '../../assets/spinner.gif'
import { useRef } from 'react'
import { usePlayerStore } from '../../stores/playerStore'
import { useGameStore } from '../../stores/gameStore'
import { Album } from '../../stores/gameStoreTypes'
import { PlayButton } from '../PlayButton'
interface GameCoverProps {}
export function GameCover({}: GameCoverProps) {
  const gameStarted = usePlayerStore((state) => state.gameStarted)
  const startGame = usePlayerStore((state) => state.setGameStarted)

  const album = useGameStore((state) => state.album) as Album
  const nodeRef = useRef(null)
  const handleStartGame = () => {
    startGame(true)
  }
  return (
    <Transition in={!gameStarted} out={!!gameStarted} timeout={1000} nodeRef={nodeRef} unmountOnExit={false}>
      {(state: string) => (
        // state change: exited -> entering -> entered -> exiting -> exited
        <CoverContainer state={state} ref={nodeRef} color={album && album.cover_color ? album.cover_color : undefined}>
          {album && album.cover_image ? <CoverImage src={album.cover_image} /> : null}
          <PlayButton onClick={handleStartGame} />
        </CoverContainer>
      )}
    </Transition>
  )
}

