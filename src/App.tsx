import { useEffect, useLayoutEffect, useState } from 'react'
import { GameCover } from './components/GameCover'
import { Player } from './components/Player'
import { SideMenu } from './components/SideMenu'
import { useGameStore } from './stores/gameStore'
import { usePlayerStore } from './stores/playerStore'
import { getRandomItemFromArray } from './utils/generic-utils'

function App() {
  console.log('APP RENDER')
  return (
    <>
      <Player />
    </>
  )
}

export default App

