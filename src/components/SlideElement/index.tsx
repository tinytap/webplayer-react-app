import React, { useRef } from 'react'
import { Stage, Layer, Star } from 'react-konva'
import { Transition } from 'react-transition-group'
import { useGameStore } from '../../stores/gameStore'

import { Slide } from '../../stores/gameStoreTypes'
import { propsAreEqual } from '../../utils'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../utils/constants'
import { LoaderSpinner } from '../Loader/styles'
import { BackgroundLayer } from './BackgroundLayer'
import { StickerLayer } from './StickerLayer'
import { SlideContainer } from './styles'
import { TextLayer } from './TextLayer'
import { AnimationStickerLayer } from './AnimationStickerLayer'

interface Layer {
  type: string
  filename?: string
  pk: string
}

interface SlideProps {
  slide: Slide | undefined
  index: number
  top: boolean
  shown: boolean
  playable: boolean
}

interface LayerProps {
  layer: Layer
  layerIndex: number
  slideIndex: number
  slideBase: string
}

const LAYER_COMPONENTS: Record<string, React.ComponentType<LayerProps>> = {
  bg: BackgroundLayer,
  img: StickerLayer,
  txt: TextLayer,
  anim: AnimationStickerLayer,
}

const SlideLayer = ({ layer, layerIndex, slideBase, slideIndex }: LayerProps) => {
  const LayerComponent =
    LAYER_COMPONENTS[layer.type] ||
    (() => (
      <Star
        x={PLAYER_WIDTH / 2}
        y={PLAYER_HEIGHT / 2}
        numPoints={5}
        innerRadius={20}
        outerRadius={40}
        fill="#89b717"
        opacity={0.8}
        draggable
        rotation={1}
        shadowColor="black"
        shadowBlur={10}
        shadowOpacity={0.6}
      />
    ))

  return <LayerComponent slideBase={slideBase} layer={layer} layerIndex={layerIndex} slideIndex={slideIndex} />
}

export const SlideElementComponent = ({ slide, shown, index: slideIndex, top, playable }: SlideProps) => {
  if (!slide) return <LoaderSpinner />

  const base_url = useGameStore((state) => state.base_url)
  const selectedSlideIndex = useGameStore((state) => state.selectedSlideIndex)

  const slide_base = `${base_url}${slide.filePath.replace('/thumb.jpg/', '/')}`
  const nodeRef = useRef(null)
  const animate = 'slide'
  const selected = slideIndex === selectedSlideIndex

  return (
    <Transition in={shown || selected} timeout={10} nodeRef={nodeRef} unmountOnExit={false}>
      {(state: string) => (
        <SlideContainer selected={selected} animate={animate} top={top} ref={nodeRef} state={state}>
          <Stage width={PLAYER_WIDTH} height={PLAYER_HEIGHT}>
            {slide.layers?.map((layer: Layer, index: number) => (
              <Layer key={layer.pk + '_' + index}>
                <SlideLayer slideBase={slide_base} layer={layer} layerIndex={index} slideIndex={slideIndex} />
              </Layer>
            ))}
          </Stage>
        </SlideContainer>
      )}
    </Transition>
  )
}

export const SlideElement = React.memo(SlideElementComponent, propsAreEqual)

