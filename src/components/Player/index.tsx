import { useEffect, useLayoutEffect } from 'react'
import useDebounce from '../../hooks/useDebounce'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useGameStore } from '../../stores/gameStore'
import { usePlayerStore } from '../../stores/playerStore'
import { GameCover } from '../GameCover'
import { LoaderScreen } from '../Loader'
import { SideMenu } from '../SideMenu'
import { SlidesContainer } from '../SlidesContainer'
import { PlayerContainer } from './styles'

export function Player() {
  const getStructureFile = useGameStore((state) => state.retrieveGameStructure)

  const playerScale = usePlayerStore((state) => state.scale)
  const updatePlayerScale = usePlayerStore((state) => state.updatePlayerScale)

  const windowSize = useWindowSize()
  const debouncedWindowSize = useDebounce(windowSize, 150)

  useLayoutEffect(() => {
    getStructureFile()
  }, [getStructureFile])

  useEffect(() => {
    updatePlayerScale()
  }, [debouncedWindowSize.width, debouncedWindowSize.height, updatePlayerScale])

  const selectNextSlide = useGameStore((state) => state.selectNextSlide)
  const selectPrevSlide = useGameStore((state) => state.selectPrevSlide)

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.keyCode === 37) {
        selectPrevSlide()
      } else if (event.keyCode === 39) {
        selectNextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectPrevSlide, selectNextSlide])
  console.log('PLAYER RENDER')

  return (
    <>
      <PlayerContainer scale={playerScale}>
        <SideMenu />
        <SlidesContainer />
        <GameCover />
        <LoaderScreen />
      </PlayerContainer>
    </>
  )
}

