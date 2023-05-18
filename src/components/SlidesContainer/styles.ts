import styled from 'styled-components'
import { SIDEMENU_WIDTH } from '../../utils/constants'

interface SlideThumbnailContainerProps {
  menuOpened: boolean
}
export const SlidesContainerElement = styled.div<SlideThumbnailContainerProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  transition: transform 320ms ease-in-out;
  transform: translateX(${({ menuOpened }) => (menuOpened ? SIDEMENU_WIDTH + 'px' : '0')});
  img {
    width: 100%;
    height: 100%;
  }
  .text-sticker {
    p {
      margin-top: 0;
    }
  }
`

export const AllSlidesContainer = styled.div`
  display: block;
`

