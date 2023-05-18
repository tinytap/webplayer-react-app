import { useGameStore } from '../../stores/gameStore'
import { PageNavigationIcon } from '../PageNavigationIcon'
import { LeftBottomMenuIconsContainer } from './styles'
interface LeftBottomMenuIconsProps {
  //children: ReactElement
}
export function LeftBottomMenuIcons({}: LeftBottomMenuIconsProps) {
  const isFirstSlide = useGameStore((state) => state.isFirstSlide)
  return (
    <LeftBottomMenuIconsContainer className={'left-bottom-menu'}>
      <PageNavigationIcon type="prev" shown={!isFirstSlide} />
    </LeftBottomMenuIconsContainer>
  )
}

