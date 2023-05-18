import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { useBearStore } from './stores/bearsStore-zustand-example'
import useSound from 'use-sound'
import boopSfx from './assets/pop.mp3'
import boopSfx2 from './assets/pfff.mp3'

function App() {
    const [playBoopSound] = useSound(boopSfx)
    const [playBoop2Sound] = useSound(boopSfx2)
    const count = useBearStore((state) => state.bears)
    const setCount = useBearStore((state) => state.increase)
    const handleClick = () => {
        playBoopSound()
        setCount(2)
    }
    useEffect(() => {
        if (count === 10) {
            playBoop2Sound()
        }
    }, [count])

    return (
        <div className="App">
            <div className="card">
                <button onClick={handleClick}>count is {count}</button>
            </div>
        </div>
    )
}

export default App

