import { ActionButton } from '../ActionButton'
import { FullscreenIconContainer } from './styles'
import SvgIcon from '../SvgIcon'
import { useCallback, useEffect, useState } from 'react'

export function FullscreenIcon() {
  const [isFullScreen, setFullScreen] = useState(false)
  const handleFullscreenIconClick = useCallback(async () => {
    if (!isFullScreen) {
      try {
        document.body.requestFullscreen().then(async () => {
          try {
            await window.screen.orientation.lock('landscape')
          } catch (e) {
            console.log(e)
          }
        })
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        document.exitFullscreen()
      } catch (e) {
        console.log(e)
      }
    }
  }, [isFullScreen])

  useEffect(() => {
    function handleFullscreenChange(e: any) {
      if (document.fullscreenElement) {
        setFullScreen(true)
      } else {
        setFullScreen(false)
      }
    }
    window.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => window.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <ActionButton animation={'scale'} onClick={handleFullscreenIconClick}>
      <FullscreenIconContainer>
        <SvgIcon
          iconName={isFullScreen ? 'fullscreen-reverse' : 'fullscreen'}
          svgProp={{ stroke: 'transparent', fill: 'white' }}
        />
      </FullscreenIconContainer>
    </ActionButton>
  )
}

