import { useEffect, useLayoutEffect } from 'react'
import useDebounce from '../../hooks/useDebounce'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useGameStore } from '../../stores/gameStore'
import { usePlayerStore } from '../../stores/playerStore'
//import { getRandomItemFromArray } from '../../utils'
import { GameCover } from '../GameCover'
import { LoaderScreen } from '../Loader'
//import { LeftBottomMenuIcons, LeftTopMenuIcons, RightBottomMenuIcons, RightTopMenuIcons } from '../MenuIcons'
import { SideMenu } from '../SideMenu'
import { SlidesContainer } from '../SlidesContainer'
import { PlayerContainer } from './styles'
import { GameOverlay } from '../GameOverlay'

interface PlayerProps {}
export function Player({}: PlayerProps) {
  const getStructureFile = useGameStore((state) => state.retrieveGameStructure)

  const playerScale = usePlayerStore((state) => state.scale)
  const updatePlayerScale = usePlayerStore((state) => state.updatePlayerScale)

  const windowSize = useWindowSize()
  const debouncedWindowSize = useDebounce(windowSize, 150)

  useLayoutEffect(() => {
    getStructureFile()
  }, [])

  useEffect(() => {
    updatePlayerScale()
  }, [debouncedWindowSize.width, debouncedWindowSize.height])

  const selectNextSlide = useGameStore((state) => state.selectNextSlide)
  const selectPrevSlide = useGameStore((state) => state.selectPrevSlide)
  const handleKeyPress = (event: any) => {
    if (event.keyCode == '37') {
      selectPrevSlide()
    } else if (event.keyCode == '39') {
      selectNextSlide()
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])
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

