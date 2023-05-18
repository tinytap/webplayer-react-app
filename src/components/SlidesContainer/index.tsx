import React from 'react'
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

        {staticSlides.current?.map((slide, index) => (
          <SlideElement
            playable={true}
            index={index}
            shown={index === selectedSlideIndex}
            key={slide.pk}
            slide={slide}
            top={false}
          />
        ))}
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

