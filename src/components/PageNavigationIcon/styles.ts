import styled from 'styled-components'
interface PageNavigationProps {
  state: string
}
export const PageNavigationContainer = styled.div<PageNavigationProps>`
  transition: opacity 0.32s ease-in-out;
  opacity: ${({ state }) => (state === 'entered' ? 1 : 0)};
  display: ${({ state }) => (state === 'exited' ? 'none' : 'flex')};
`
export const PageNavigationIconContainer = styled.div``

