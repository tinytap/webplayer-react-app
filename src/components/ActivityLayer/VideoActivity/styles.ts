import styled, { css } from 'styled-components'

export const VideoContainer = styled.div<{
  iframeStyle?: {
    width: number
    height: number
    top: number
    left: number
    transform: string
  }
}>`
  & iframe,
  video {
    ${({ iframeStyle }) =>
      iframeStyle &&
      css`
        position: absolute;
        width: ${iframeStyle.width}px !important;
        height: ${iframeStyle.height}px !important;
        top: ${iframeStyle.top}px;
        left: ${iframeStyle.left}px;
        transform: ${iframeStyle.transform};
      `}
  }
`

