import { useGameStore } from '../../stores/gameStore'
import { PageNavigationIcon } from '../PageNavigationIcon'
import { RightBottomMenuIconsContainer } from './styles'

export function RightBottomMenuIcons() {
  const isLastSlide = useGameStore((state) => state.isLastSlide)
  return (
    <RightBottomMenuIconsContainer className={'right-bottom-menu'}>
      <PageNavigationIcon type="next" shown={!isLastSlide} />
    </RightBottomMenuIconsContainer>
  )
}

