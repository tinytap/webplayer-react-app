import styled from 'styled-components'
import { playerColors, SIDEMENU_WIDTH } from '../../utils/constants'
interface SideMenuProps {
  open: boolean
}
export const SideMenuContainer = styled.div<SideMenuProps>`
  width: ${SIDEMENU_WIDTH}px;
  height: 100%;
  background: ${playerColors.cyan};
  position: relative;
  z-index: 1;
  transform: translateX(${({ open }) => (open ? '0' : '-100%')});
  transition: transform 320ms ease-in-out;
`
export const SideMenuBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const SlidesMenuContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding: 22px 36px;
  overflow-x: hidden;
  overflow-y: auto;
`

export const SideMenuHeaderContainer = styled.div`
  background: ${playerColors.lightCyan};
  padding: 10px;
  display: block;
`

export const GameAuthorBox = styled.div`
  display: grid;
  grid-template-columns: 32px auto minmax(32px, 1fr);

  height: auto;
  position: relative;
  gap: 12px;
`
export const GameAuthorAvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  max-width: 100%;
  height: 36px;
  width: 36px;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
`
export const GameAuthorAvatarLink = styled.a`
  display: block;
  width: 100%;
  height: 100%;
`
export const GameAuthorDetailsContainer = styled.div`
  color: #fff;
  font-weight: 500;
  line-height: 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: space-between;
`
export const GameAuthorDetailsTopLine = styled.div`
  font-size: 12px;
`

export const GameAuthorAvatar = styled.img`
  max-width: 100%;
  height: 36px;
  width: 36px;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
  transition: transform ease-in-out 0.5s;
  ${GameAuthorBox}:hover & {
    transform: scale(1.2);
  }
`
export const GameAuthorDetailsBottomLine = styled.a`
  color: #fff;
  display: block;
  font-size: 16px;
  font-weight: 600;
  width: 128px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  cursor: pointer;
  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`
export const GameAuthorShareContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
export const GameAuthorShareButton = styled.button`
  padding: 8px 4px;
  height: auto;
  max-height: 100%;
  width: 100%;

  border-radius: 4px;
  outline: none;
  border: none;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.3);
  transition: background-color 0.3s ease-in-out;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
  &:active {
    border: 0px transparent none;
  }
`

