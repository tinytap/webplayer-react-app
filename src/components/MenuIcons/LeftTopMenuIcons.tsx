import { PageNavigationIcon } from '../PageNavigationIcon'
import { SideMenuIcon } from '../SideMenuIcon'
import { LeftTopMenuIconsContainer } from './styles'
interface LeftTopMenuIconsProps {
    //children: ReactElement
}
export function LeftTopMenuIcons({}: LeftTopMenuIconsProps) {
    return (
        <LeftTopMenuIconsContainer className={'left-top-menu'}>
            <SideMenuIcon />
        </LeftTopMenuIconsContainer>
    )
}

