import { useEffect, useRef, useState } from 'react'
import { FixedContainer } from './styles'

export type AnswerStatus = 'empty' | 'right' | 'wrong'

interface HintBubbleProps {
  text: string
  rect: {
    y: number
    x: number
    w: number
    h: number
  }
  color: string
  showHintTrigger: number
}

export const HintBubble = ({ text, rect, color, showHintTrigger }: HintBubbleProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (showHintTrigger) {
      setIsVisible(true)
    }
  }, [showHintTrigger])

  useEffect(() => {
    let isMounted = false
    if (!isVisible) {
      return
    }
    setTimeout(() => {
      if (isMounted) {
        return
      }
      setIsVisible(false)
    }, 4000)

    return () => {
      isMounted = true
    }
  }, [isVisible])

  return (
    <FixedContainer
      ref={ref}
      rect={rect}
      color={color}
      bubbleSize={{
        w: ref.current?.clientWidth,
        h: ref.current?.clientHeight,
      }}
      visible={isVisible}
    >
      {text}
    </FixedContainer>
  )
}

