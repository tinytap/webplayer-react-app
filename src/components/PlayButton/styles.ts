import styled from 'styled-components'
export const PlayButtonCover = styled.div`
    width: auto;
    height: auto;
    min-height: 73px;
    min-width: 74px;
    box-sizing: border-box;
    cursor: pointer;
    border: none;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    transition: transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
    box-shadow: rgb(0 0 0 / 15%) 0 0 1px 0px, rgb(0 0 0 / 20%) 0 0 22px 0;
    outline: none;
    position: relative;
    z-index: 1;
    gap: 5px;
    padding: 10px 10px 5px 10px;

    &:hover {
        transform: scale(1.15);
        box-shadow: rgb(0 0 0 / 15%) 0 0 1px 0px, rgb(0 0 0 / 12%) 0 0 12px 3px;
    }
    &:active {
        transform: scale(1.1);
        box-shadow: rgb(0 0 0 / 15%) 0 0 1px 0px, rgb(0 0 0 / 18%) 0 0 6px 3px;
    }
`
export const PlayButtonIcon = styled.img`
    width: auto;
    height: 32px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    user-select: none;
`
export const PlayButtonText = styled.div`
    font-family: 'MikadoMedium', sans-serif, Arial;
    color: #72bdeb;
    user-select: none;
    font-size: 14px;
    font-weight: 600;
`

