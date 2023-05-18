import styled from 'styled-components'
interface LoaderContainerProps {
  state: string
  color?: string | undefined
  rgb?: string | undefined
}
export const OverlayContainer = styled.div<LoaderContainerProps>`
  width: 100%;
  height: 100%;
  background: ${({ color, rgb }) => (rgb ? rgb : color ? '#' + color : 'white')};
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s;
  opacity: ${({ state }) => (state === 'entered' ? 1 : 0)};
  display: ${({ state }) => (state === 'exited' ? 'none' : 'flex')};
  z-index: 1;
  user-select: none;
`

