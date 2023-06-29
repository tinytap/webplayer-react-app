import styled, { css } from 'styled-components'
import { SHAKE_SPEED_MS, SIDEMENU_WIDTH } from '../../utils/constants'

const shakeAnimation = css`
  @keyframes shake-animation {
    0% {
      margin-left: 0;
    }
    11% {
      margin-left: -8px;
    }
    22% {
      margin-left: 8px;
    }
    33% {
      margin-left: -7px;
    }
    44% {
      margin-left: 7px;
    }
    56% {
      margin-left: -6px;
    }
    67% {
      margin-left: 6px;
    }
    78% {
      margin-left: -5px;
    }
    89% {
      margin-left: 5px;
    }
    100% {
      margin-left: 0;
    }
  }
`
interface SlideThumbnailContainerProps {
  menuOpened: boolean
  shakePlayer: boolean
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

  ${({ shakePlayer }) =>
    shakePlayer &&
    css`
      animation-name: shake-animation;
      animation-duration: ${SHAKE_SPEED_MS}ms;
      animation-iteration-count: 1;

      ${shakeAnimation}
    `}
`

export const AllSlidesContainer = styled.div`
  display: block;
`

