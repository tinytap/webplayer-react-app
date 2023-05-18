//import MusicOnIcon from '../../assets/icons/music-on.svg'
//import MusicOffIcon from '../../assets/icons/music-off.svg'

import { ActionButton } from '../ActionButton'
import { RefreshIconContainer } from './styles'
import SvgIcon from '../SvgIcon'
import { useGameStore } from '../../stores/gameStore'
interface RefreshIconProps {}
export function RefreshIcon({}: RefreshIconProps) {
  const refreshSelectedSlide = useGameStore((state) => state.refreshSelectedSlide)
  const handleRefreshIconClick = () => {
    refreshSelectedSlide()
    //window.location.reload()
  }

  return (
    <ActionButton animation={'scale'} onClick={handleRefreshIconClick}>
      <RefreshIconContainer>
        <SvgIcon iconName={'refresh'} svgProp={{ stroke: 'transparent', fill: 'white' }} />
      </RefreshIconContainer>
    </ActionButton>
  )
}

