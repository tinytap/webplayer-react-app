// Required libraries and components
import React, { useCallback, useEffect, useRef } from 'react'
import { Stage, Layer, Star } from 'react-konva'
import { Transition } from 'react-transition-group'
import { useGameStore } from '../../stores/gameStore'
import { Slide } from '../../stores/gameStoreTypes'
import { propsAreEqual } from '../../utils'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../utils/constants'
import { LoaderSpinner } from '../Loader/styles'
import { BackgroundLayer } from './BackgroundLayer'
import { StickerLayer } from './StickerLayer'
import { DebugContainer, SlideContainer } from './styles'
import { TextLayer } from './TextLayer'
import { AnimationStickerLayer } from './AnimationStickerLayer'
import { useActivitiesStore } from '../../stores/activitiesStore'

// Types for the Layer and SlideProps objects
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

// Props type for the Layer component
interface LayerProps {
  layer: Layer
  layerIndex: number
  slideIndex: number
  slideBase: string
}

// Mapping layer types to corresponding layer components
const LAYER_COMPONENTS: Record<string, React.ComponentType<LayerProps>> = {
  bg: BackgroundLayer,
  img: StickerLayer,
  txt: TextLayer,
  anim: AnimationStickerLayer,
}

// The SlideLayer component, it determines which LayerComponent to render based on the layer type
const SlideLayer = ({ layer, layerIndex, slideBase, slideIndex }: LayerProps) => {
  // Lookup the component for this layer type, if none found, return a Star
  const LayerComponent = LAYER_COMPONENTS[layer.type] || (
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
  ) // Star component as a default case

  // Rendering the determined LayerComponent
  return <LayerComponent slideBase={slideBase} layer={layer} layerIndex={layerIndex} slideIndex={slideIndex} />
}

// The SlideElementComponent represents a single slide and manages rendering of its layers and transitions
export const SlideElementComponent = ({ slide, shown, index: slideIndex, top, playable }: SlideProps) => {
  // Show loading spinner if slide is not available
  if (!slide) return <LoaderSpinner />

  // Retrieve required states and actions from the game store and activities store
  const base_url = useGameStore((state) => state.base_url)
  const setTransitionLoading = useGameStore((state) => state.setTransitionLoading)
  const selectedSlideIndex = useGameStore((state) => state.selectedSlideIndex)
  const slide_base = `${base_url}${slide.filePath.replace('/thumb.jpg/', '/')}`
  const nodeRef = useRef(null)
  const animate = slide.settings.kTransitionNoneKey === 3 ? 'fade' : 'slide'
  const selected = slideIndex === selectedSlideIndex
  const handleSlideEnter = useCallback(() => {
    setTransitionLoading(true)
  }, [])
  const handleSlideEntered = useCallback(() => {
    const animationTimer = setTimeout(() => {
      setTransitionLoading(false)
      clearTimeout(animationTimer)
    }, 1000)
  }, [])
  // Get function to retrieve a slide by its index from the activities store
  const getSlide = useActivitiesStore((state) => state.getSlide)

  // Get function to retrieve slide activities by their index from the activities store
  const getSlideActivities = useActivitiesStore((state) => state.getSlideActivities)

  // Retrieve slide activity for the current slide
  const slideActivity = getSlide(slideIndex)

  // Retrieve all activities for the current slide
  const slideActivities = getSlideActivities(slideIndex)

  // Log the slideActivity's 'started' status when it changes
  useEffect(() => {
    if (!slideActivity) return
    console.log('slideActivity.started', slideActivity?.started)
  }, [slideActivity?.started])

  // Transition wrapper to manage animations when switching between slides
  return (
    <Transition
      in={shown || selected}
      timeout={0}
      nodeRef={nodeRef}
      unmountOnExit={false}
      onEnter={handleSlideEnter}
      onEntered={handleSlideEntered}
    >
      {(state: string) => (
        <SlideContainer selected={selected} animate={animate} top={top} ref={nodeRef} state={state}>
          <DebugContainer>
            <p>
              Started - {slideActivity?.started ? 'true' : 'false'}
              <br />
              Paused - {slideActivity?.paused ? 'true' : 'false'}
              <br />
              Activities - {slideActivity?.activities ? slideActivity?.activities.length : 'NULL'}
            </p>
          </DebugContainer>
          <Stage width={PLAYER_WIDTH} height={PLAYER_HEIGHT}>
            {/** Background / Foreground layered together */}
            <Layer>
              {slide.layers?.map((layer: Layer, index: number) =>
                layer.type === 'bg' ? (
                  <SlideLayer
                    key={layer.pk + '_' + index}
                    slideBase={slide_base}
                    layer={layer}
                    layerIndex={index}
                    slideIndex={slideIndex}
                  />
                ) : null,
              )}
            </Layer>
            {/** Stickers layered together */}
            <Layer>
              {slide.layers?.map((layer: Layer, index: number) =>
                layer.type === 'bg' ? null : (
                  <SlideLayer
                    key={layer.pk + '_' + index}
                    slideBase={slide_base}
                    layer={layer}
                    layerIndex={index}
                    slideIndex={slideIndex}
                  />
                ),
              )}
            </Layer>
            {/** Activities layered together */}
            {/** Commented out block of code for activity layering
            <Layer>
              {slideActivities?.map((activity, index: number) => (
                <ActivityLayer
                  key={activity.pk + '_' + index}
                  slideBase={slide_base}
                  activity={activity}
                  activityIndex={index}
                  slideIndex={slideIndex}
                />
              ))}
            </Layer>
             */}
          </Stage>
        </SlideContainer>
      )}
    </Transition>
  )
}

// SlideElement component with React.memo for performance optimization
// The second argument to React.memo is a comparison function that allows for a custom equality check on the props
export const SlideElement = React.memo(SlideElementComponent, propsAreEqual)

