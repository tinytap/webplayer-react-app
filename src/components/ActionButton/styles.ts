import styled from 'styled-components'
interface ActionButtonContainerProps {
    animation: 'fade' | 'scale' | undefined
}
export const ActionButtonContainer = styled.div<ActionButtonContainerProps>`
    cursor: pointer;
    height: 34px;
    width: 34px;
    background-color: rgba(0, 0, 0, 0.2);
    opacity: 0.8;
    transition: background-color 320ms ease-in-out, opacity 320ms ease-in-out, transform 320ms ease-in-out;
    border-radius: 5px;
    &:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.25);
        transform: scale(${({ animation }) => (animation === 'scale' ? 1.1 : 1)});
    }
    svg {
        width: 100%;
        height: 100%;
    }
`

