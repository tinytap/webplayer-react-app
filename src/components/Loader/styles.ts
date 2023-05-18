import styled from 'styled-components'
interface LoaderContainerProps {
    state: string
}
export const LoaderContainer = styled.div<LoaderContainerProps>`
    width: 100%;
    height: 100%;
    background: white;
    position: fixed;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
    opacity: ${({ state }) => (state === 'entered' ? 1 : 0)};
    display: ${({ state }) => (state === 'exited' ? 'none' : 'flex')};
    z-index: 10;
`
export const LoaderSpinner = styled.img`
    width: 125px;
    height: 125px;
    background: transparent;
`

