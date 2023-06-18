import { useGameStore } from '../../stores/gameStore'
import { PageNavigationIcon } from '../PageNavigationIcon'
import { LeftBottomMenuIconsContainer } from './styles'

export function LeftBottomMenuIcons() {
  const isFirstSlide = useGameStore((state) => state.isFirstSlide)
  return (
    <LeftBottomMenuIconsContainer className={'left-bottom-menu'}>
      <PageNavigationIcon type="prev" shown={!isFirstSlide} />
    </LeftBottomMenuIconsContainer>
  )
}

