import styled from 'styled-components'
import { textColors } from '../../utils/constants'
interface SlideThumbnailContainerProps {
    selected: boolean
}
export const SlideThumbnailContainer = styled.div`
    width: 100%;
    display: block;
    padding: 12px 0;
`
export const SlideThumbnailBox = styled.div<SlideThumbnailContainerProps>`
    overflow: hidden;
    border-radius: 20px;
    box-sizing: border-box;
    transition: box-shadow 0.5s ease-in-out;
    box-shadow: ${({ selected }) => (selected ? '0 0 0 5px yellow' : '0 0 0 transparent')};
    display: flex;
    flex-direction: column;
    cursor: pointer;
`

export const SlideThumbnailImage = styled.img`
    max-width: 100%;
`
export const SlideThumbnailText = styled.div`
    background: white;
    padding: 2px 18px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    font-family: 'MikadoRegular', sans-serif, Arial;
    color: ${textColors.cyan};
    font-size: 14px;
`

export const SlideThumbnailPageNum = styled.div``
export const SlideThumbnailEngineType = styled.div`
    text-transform: capitalize;
    font-family: 'MikadoMedium', sans-serif, Arial;
`

