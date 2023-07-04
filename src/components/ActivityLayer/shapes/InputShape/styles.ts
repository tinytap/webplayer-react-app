import styled, { css } from 'styled-components'
import { playerColors } from '../../../../utils/constants'

const INPUT_PADDING = 5

const emptyAnswerAnimation = css`
  @keyframes empty-input-animation {
    0% {
      background-color: ${playerColors.inputColor};
    }
    50% {
      background-color: #cacaca;
    }
    100% {
      background-color: ${playerColors.inputColor};
    }
  }
`

const wrongAnswerAnimation = css`
  @keyframes wrong-input-animation {
    0% {
      background-color: ${playerColors.inputColor};
    }
    50% {
      background-color: #f8c4c4;
    }
    100% {
      background-color: ${playerColors.inputColor};
    }
  }
`

// TODO: fix font-size
export const Input = styled.input<{ x: number; y: number; w: number; h: number }>`
  font-family: arial;
  position: absolute;
  border-radius: 7px;
  padding: ${INPUT_PADDING}px;
  background-color: ${playerColors.inputColor};
  text-align: center;
  color: #222;
  ${(props) => css`
    top: ${props.y}px;
    left: ${props.x}px;
    width: ${props.w - (INPUT_PADDING + 1) * 2}px;
    height: ${props.h - (INPUT_PADDING + 1) * 2}px;
    font-size: ${props.h - (INPUT_PADDING + 1) * 4}px;
  `}

  animation-duration: 3s;
  animation-iteration-count: infinite;

  &.right {
    background: #90ef8f;
    border: 1px solid #89ca88;
  }

  &.wrong {
    animation-name: wrong-input-animation;
    ${wrongAnswerAnimation}
  }

  &.empty {
    animation-name: empty-input-animation;
    ${emptyAnswerAnimation}
  }
`

