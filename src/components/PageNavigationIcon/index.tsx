import { ActionButton } from '../ActionButton'
import { PageNavigationContainer, PageNavigationIconContainer } from './styles'
import SvgIcon from '../SvgIcon'
import { useGameStore } from '../../stores/gameStore'
import { useCallback, useEffect, useRef } from 'react'
import { Transition } from 'react-transition-group'
interface PageNavigationIconProps {
  type: 'next' | 'prev'
  shown?: boolean
}
export function PageNavigationIcon({ type, shown }: PageNavigationIconProps) {
  const nodeRef = useRef(null)
  const selectNextSlide = useGameStore((state) => state.selectNextSlide)
  const selectPrevSlide = useGameStore((state) => state.selectPrevSlide)

  const handlePageNavigationIconClick = useCallback(() => {
    switch (type) {
      case 'next':
        selectNextSlide()
        break
      case 'prev':
        selectPrevSlide()
        break
    }
  }, [type, selectNextSlide, selectPrevSlide])

  return (
    <Transition in={shown} out={!shown} timeout={100} nodeRef={nodeRef} unmountOnExit={false}>
      {(state: string) => (
        <PageNavigationContainer ref={nodeRef} state={state}>
          <ActionButton animation={'scale'} onClick={handlePageNavigationIconClick}>
            <PageNavigationIconContainer>
              <SvgIcon iconName={`slide-${type}`} svgProp={{ stroke: 'transparent', fill: 'white' }} />
            </PageNavigationIconContainer>
          </ActionButton>
        </PageNavigationContainer>
      )}
    </Transition>
  )
}

