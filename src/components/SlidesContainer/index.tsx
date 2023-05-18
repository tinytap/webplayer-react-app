import React, { useEffect } from 'react'
import { useRef } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { Slide } from '../../stores/gameStoreTypes'
import { usePlayerStore } from '../../stores/playerStore'
import { propsAreEqual } from '../../utils'
import { LeftBottomMenuIcons, LeftTopMenuIcons, RightBottomMenuIcons, RightTopMenuIcons } from '../MenuIcons'
import { SlideElement } from '../SlideElement'
import { AllSlidesContainer, SlidesContainerElement } from './styles'

interface SlideThumbnailProps {
  //slides: Slide[] | undefined
}
export function SlidesContainerComponent({}: SlideThumbnailProps) {
  const slides = useGameStore((state) => state.slides)
  const selectedSlide = useGameStore((state) => state.selectedSlide)
  const selectedSlideIndex = useGameStore((state) => state.selectedSlideIndex)
  const lastSelectedSlideIndex = useGameStore((state) => state.lastSelectedSlideIndex)
  const lastSelectedSlide = useGameStore((state) => state.lastSelectedSlide)
  const menuOpen = usePlayerStore((state) => state.menuOpen)
  const staticSlides = useRef([...(slides as any)])
  useEffect(() => {
    staticSlides.current = [...(slides as any)]
  }, [slides])

  return (
    <SlidesContainerElement menuOpened={menuOpen}>
      <AllSlidesContainer>
        <SlideElement
          playable={false}
          shown={true}
          slide={staticSlides.current?.[lastSelectedSlideIndex || 0]}
          top={false}
          index={lastSelectedSlideIndex || 0}
        />

        {slides
          ? slides.map((slide, index) => (
              <SlideElement
                playable={true}
                index={index}
                shown={index === selectedSlideIndex}
                key={slide.pk}
                slide={slide}
                top={false}
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
    </SlidesContainerElement>
  )
}

export const SlidesContainer = React.memo(SlidesContainerComponent, propsAreEqual)

