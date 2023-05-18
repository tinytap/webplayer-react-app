import styled from 'styled-components'
interface PlayerContainerProps {
  scale: number
}
export const PlayerContainer = styled.div<PlayerContainerProps>`
  //max-height: 100vh;
  overflow: hidden;
  width: 1024px;
  height: 768px;
  position: absolute;
  left: 50%;
  z-index: 0;
  transform-origin: center top;
  transform: translateX(-50%) scale(${({ scale }) => (scale ? scale : 1)});
`

