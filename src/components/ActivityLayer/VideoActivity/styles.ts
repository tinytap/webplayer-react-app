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
  & iframe {
    ${({ iframeStyle }) =>
      iframeStyle &&
      css`
        position: absolute;
        width: ${iframeStyle.width}px;
        height: ${iframeStyle.height}px;
        top: ${iframeStyle.top}px;
        left: ${iframeStyle.left}px;
        transform: ${iframeStyle.transform};
      `}
  }

  & video {
    padding: 0 20px;
    box-sizing: border-box;
  }
`

