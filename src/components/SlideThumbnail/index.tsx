import { useGameStore } from '../../stores/gameStore'
import {
    SlideThumbnailBox,
    SlideThumbnailContainer,
    SlideThumbnailEngineType,
    SlideThumbnailImage,
    SlideThumbnailPageNum,
    SlideThumbnailText,
} from './styles'

interface SlideThumbnailProps {
    index: number
    image: string
    engine: string
    selected: boolean
    onSelect: () => void
}
export function SlideThumbnail({ image, index, engine, selected, onSelect }: SlideThumbnailProps) {
    const base_url = useGameStore((state) => state.base_url)
    return (
        <SlideThumbnailContainer>
            <SlideThumbnailBox selected={selected} onClick={onSelect}>
                <SlideThumbnailImage src={base_url + image} />
                <SlideThumbnailText>
                    <SlideThumbnailPageNum>P. {index}</SlideThumbnailPageNum>
                    <SlideThumbnailEngineType>{engine}</SlideThumbnailEngineType>
                </SlideThumbnailText>
            </SlideThumbnailBox>
        </SlideThumbnailContainer>
    )
}

