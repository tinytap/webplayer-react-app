import styled, { css } from 'styled-components'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../utils/constants'

const BUBBLE_PADDING = 16

export const FixedContainer = styled.div<{
  rect: { x: number; y: number; w: number; h: number }
  color: string
  bubbleSize: {
    h?: number
    w?: number
  }
  visible: boolean
}>`
  pointer-events: none;
  position: fixed;
  text-align: center;
  padding: ${BUBBLE_PADDING}px;
  max-width: 700px;
  min-width: 100px;
  font-size: 16px;
  border-radius: 10px;
  font-family: Helvetica, Arial, 'Coustard', 'Lucida Grande';
  color: white;
  line-height: 26px;
  transition: all 400ms linear;
  opacity: ${({ visible }) => (visible ? 1 : 0)};

  ${({ rect, color, bubbleSize }) => {
    if (!bubbleSize.h || !bubbleSize.w) {
      return ''
    }

    let top = 0
    if (PLAYER_HEIGHT - (rect.y + rect.h) < rect.y) {
      top = rect.y - bubbleSize.h - BUBBLE_PADDING
    } else {
      top = rect.y + rect.h + BUBBLE_PADDING
    }

    const centerX = (rect.x * 2 + rect.w) / 2
    let left = centerX - bubbleSize.w / 2

    if (left - bubbleSize.w / 2 < 0) {
      left = 0
    } else if (left + bubbleSize.w / 2 > PLAYER_WIDTH) {
      left = PLAYER_WIDTH - bubbleSize.w
    }

    return css`
      top: ${top}px;
      left: ${left}px;
      background-color: ${color};
    `
  }}

  &:after {
    position: absolute;
    content: '';
    width: ${BUBBLE_PADDING}px;
    height: ${BUBBLE_PADDING}px;
    opacity: ${({ visible }) => (visible ? 1 : 0)};
    transition: all 400ms linear;

    ${({ rect, color, bubbleSize }) => {
      if (!bubbleSize.w) {
        return ''
      }

      let positionY = ''
      let transform = 'rotate(45deg)'
      if (PLAYER_HEIGHT - (rect.y + rect.h) < rect.y) {
        positionY = 'bottom: 0'
        transform = `translateY(${BUBBLE_PADDING / 2}px)` + transform
      } else {
        positionY = 'top: 0'
        transform = `translateY(-${BUBBLE_PADDING / 2}px)` + transform
      }

      return css`
        background-color: ${color};
        transform: ${transform};
        left: ${bubbleSize.w / 2 - BUBBLE_PADDING / 2}px;
        ${positionY};
        transform-origin: center;
      `
    }}
  }
`

