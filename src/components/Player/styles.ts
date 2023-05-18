import styled from 'styled-components'
interface PlayerContainerProps {
  scale: number
}
export const PlayerContainer = styled.div<PlayerContainerProps>`
  //max-height: 100vh;
  overflow: hidden;
  width: 1024px;
  height: 768px;
  position: relative;
  z-index: 0;
  transform-origin: top left;
  transform: scale(${({ scale }) => (scale ? scale : 1)});
`

