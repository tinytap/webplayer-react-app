import React, { useEffect } from 'react'
import { useRef } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { usePlayerStore } from '../../stores/playerStore'
import { propsAreEqual } from '../../utils'
import { LeftBottomMenuIcons, LeftTopMenuIcons, RightBottomMenuIcons, RightTopMenuIcons } from '../MenuIcons'
import { SlideElement } from '../SlideElement'
import { AllSlidesContainer, SlidesContainerElement } from './styles'
import { GameOverlay } from '../GameOverlay'
import { SLIDE_CONTAINER_ID } from '../../utils/constants'

export function SlidesContainerComponent() {
  const slides = useGameStore((state) => state.slides)
  const selectedSlideIndex = useGameStore((state) => state.selectedSlideIndex)
  const lastSelectedSlideIndex = useGameStore((state) => state.lastSelectedSlideIndex)
  const menuOpen = usePlayerStore((state) => state.menuOpen)
  const staticSlides = useRef([...(slides as any)])

  useEffect(() => {
    staticSlides.current = [...(slides as any)]
  }, [slides])

  return (
    <SlidesContainerElement id={SLIDE_CONTAINER_ID} menuOpened={menuOpen}>
      <AllSlidesContainer>
        {lastSelectedSlideIndex === undefined && (
          <SlideElement playable={false} shown={true} slide={staticSlides.current?.[0]} top={false} index={0} />
        )}

        {slides
          ? slides.map((slide, index) => (
              <SlideElement
                playable={true}
                index={index}
                shown={index === selectedSlideIndex}
                key={slide.pk}
                slide={slide}
                top={false}
                isPrevSlide={index === lastSelectedSlideIndex && index !== selectedSlideIndex}
                animate={
                  lastSelectedSlideIndex !== undefined &&
                  slides?.[lastSelectedSlideIndex].settings.kTransitionNoneKey === 3
                    ? 'fade'
                    : 'slide'
                }
              />
            ))
          : null}
      </AllSlidesContainer>
      <>
        <RightTopMenuIcons />
        <RightBottomMenuIcons />
        <LeftBottomMenuIcons />
        <LeftTopMenuIcons />
      </>
      <GameOverlay />
    </SlidesContainerElement>
  )
}

export const SlidesContainer = React.memo(SlidesContainerComponent, propsAreEqual)

