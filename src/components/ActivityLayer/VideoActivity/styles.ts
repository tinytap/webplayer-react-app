import styled from 'styled-components'
import { PLAYER_HEIGHT } from '../../../utils/constants'

export const IFRAME_MARGIN_TOP_PERCENTAGE = 1 / 8

export const VideoContainer = styled.div`
  margin-top: calc(${PLAYER_HEIGHT}px * ${IFRAME_MARGIN_TOP_PERCENTAGE});
`

