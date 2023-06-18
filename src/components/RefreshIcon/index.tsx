import { ActionButton } from '../ActionButton'
import { RefreshIconContainer } from './styles'
import SvgIcon from '../SvgIcon'
import { useGameStore } from '../../stores/gameStore'

export function RefreshIcon() {
  const refreshSelectedSlide = useGameStore((state) => state.refreshSelectedSlide)
  const handleRefreshIconClick = () => {
    refreshSelectedSlide()
  }

  return (
    <ActionButton animation={'scale'} onClick={handleRefreshIconClick}>
      <RefreshIconContainer>
        <SvgIcon iconName={'refresh'} svgProp={{ stroke: 'transparent', fill: 'white' }} />
      </RefreshIconContainer>
    </ActionButton>
  )
}

