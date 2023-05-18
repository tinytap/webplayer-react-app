import { ActionButton } from '../ActionButton'
import { SideMenuIconContainer } from './styles'
import SvgIcon from '../SvgIcon'
import { usePlayerStore } from '../../stores/playerStore'
interface SideMenuIconProps {}
export function SideMenuIcon({}: SideMenuIconProps) {
  const menuOpen = usePlayerStore((state) => state.menuOpen)
  const setMenuOpenState = usePlayerStore((state) => state.setMenuOpenState)
  const handleSideMenuIconClick = () => {
    setMenuOpenState(!menuOpen)
  }

  return (
    <ActionButton animation={'scale'} onClick={handleSideMenuIconClick}>
      <SideMenuIconContainer>
        <SvgIcon iconName={`menu`} svgProp={{ stroke: 'transparent', fill: 'white' }} />
      </SideMenuIconContainer>
    </ActionButton>
  )
}

