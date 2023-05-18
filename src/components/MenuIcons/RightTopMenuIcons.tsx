import { BackgroundMusicIcon } from '../BackgroundMusicIcon'
import { FullscreenIcon } from '../FullscreenIcon'
import { RefreshIcon } from '../RefreshIcon'
import { RightTopMenuIconsContainer } from './styles'
interface RightTopMenuIconsProps {
    //children: ReactElement
}
export function RightTopMenuIcons({}: RightTopMenuIconsProps) {
    return (
        <RightTopMenuIconsContainer className={'right-top-menu'}>
            <FullscreenIcon />
            <RefreshIcon />
            <BackgroundMusicIcon />
        </RightTopMenuIconsContainer>
    )
}

