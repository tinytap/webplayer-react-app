import { PlayButtonCover, PlayButtonIcon, PlayButtonText } from './styles'
import PlayIconSVG from '../../assets/logo_tinytap.svg'
interface PlayButtonProps {
    onClick: () => void
}
export function PlayButton({ onClick }: PlayButtonProps) {
    return (
        <PlayButtonCover onClick={onClick}>
            <PlayButtonIcon src={PlayIconSVG} />
            <PlayButtonText>TinyTap</PlayButtonText>
        </PlayButtonCover>
    )
}

