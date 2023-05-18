import styled from 'styled-components'
const base = `
  position: absolute;
  z-index: 50;
  padding: 10px;
  display: flex;
  gap: 6px;
`
export const RightTopMenuIconsContainer = styled.div`
  ${base}
  top: 0;
  right: 0;
`
export const LeftTopMenuIconsContainer = styled.div`
  ${base}
  top: 0;
  left: 0;
`
export const RightBottomMenuIconsContainer = styled.div`
  ${base}
  bottom: 0;
  right: 0;
`
export const LeftBottomMenuIconsContainer = styled.div`
  ${base}
  bottom: 0;
  left: 0;
`

