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
        break
      case 'fade':
        return `
        opacity: ${state === 'entered' ? '1' : state === 'entering' ? '0' : state === 'exiting' ? '1' : '0'};
        transform: translateX(0);
        transition: opacity 1s ease-in-out;
        `
        break
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

