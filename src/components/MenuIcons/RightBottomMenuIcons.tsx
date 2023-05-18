import { useGameStore } from '../../stores/gameStore'
import { PageNavigationIcon } from '../PageNavigationIcon'
import { RightBottomMenuIconsContainer } from './styles'
interface RightBottomMenuIconsProps {
  //children: ReactElement
}
export function RightBottomMenuIcons({}: RightBottomMenuIconsProps) {
  const isLastSlide = useGameStore((state) => state.isLastSlide)
  return (
    <RightBottomMenuIconsContainer className={'right-bottom-menu'}>
      <PageNavigationIcon type="next" shown={!isLastSlide} />
    </RightBottomMenuIconsContainer>
  )
}

