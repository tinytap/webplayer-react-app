import styled from 'styled-components'
export const SlideElementContainer = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
`
interface SlideContainerProps {
  selected: boolean
  state: any
  top: boolean
  animate: any
}
export const SlideContainer = styled.div<SlideContainerProps>`
  position: absolute;
  top: 0;
  left: 0;
  ${({ animate, state }) => {
    switch (animate) {
      case 'slide':
        return `
        transform: translateX(
          ${state === 'exited' || state === 'exiting' ? '0' : state === 'entering' ? '100%' : '0'}
        );
        transition: transform 1s ease-in-out;
        `

      case 'fade':
        return `
        opacity: ${state === 'entered' ? '1' : state === 'entering' ? '0' : state === 'exiting' ? '1' : '0'};
        transform: translateX(0);
        transition: opacity 1s ease-in-out;
        `

      default:
        return `
        width:${state === 'entered' ? '100%' : state === 'entering' ? '10px' : state === 'exiting' ? '100%' : '0px'};
        height: ${state === 'entered' ? '100%' : state === 'entering' ? '10px' : state === 'exiting' ? '100%' : '0px'};
        transition: opacity 1s ease-in-out;
        `
    }
  }}

  z-index: ${({ state, selected }) =>
    state === 'exited' || state === 'exiting' ? '-1' : state === 'entering' ? '+1' : selected ? '+1' : '-1'};

  display: ${({ state, top }) => (state === 'exited' ? (top ? 'block' : 'none') : 'flex')};
`
/*
entering: { opacity: 1 },
  entered:  { opacity: 1 },
  exiting:  { opacity: 0 },
  exited:  { opacity: 0 },
*/

export const DebugContainer = styled.div`
  position: absolute;
  z-index: 99999999;
  top: 0;
  left: 0;
  color: white;
  fontsize: 16px;
  margin: 50px 10px 0 10px;
  padding: 20px;
  background: red;
  border-radius: 10px;
  width: 200px;
  p {
    margin: 0;
    font-weight: bold;
  }
`

