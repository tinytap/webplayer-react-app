import { BackgroundMusicIcon } from '../BackgroundMusicIcon'
import { FullscreenIcon } from '../FullscreenIcon'
import { RefreshIcon } from '../RefreshIcon'
import { RightTopMenuIconsContainer } from './styles'

export function RightTopMenuIcons() {
    return (
        <RightTopMenuIconsContainer className={'right-top-menu'}>
            <FullscreenIcon />
            <RefreshIcon />
            <BackgroundMusicIcon />
        </RightTopMenuIconsContainer>
    )
}

