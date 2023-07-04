import { FocusEvent, useEffect, useMemo, useState } from 'react'
import useSound from 'use-sound'
import { Shape } from '../../../../stores/activitiesStoreTypes'
import { getPathRect } from '../../../../utils'
import DefaultGoodAnswer from '../../../../assets/sounds/defaultGoodAnswer.mp3'
import { Input } from './styles'
import DefaultWrongAnswer from '../../../../assets/sounds/DefaultWrongAnswer.mp3'
import defaultGoodAnswer from '../../../../assets/sounds/defaultGoodAnswer.mp3'

export type AnswerStatus = 'empty' | 'right' | 'wrong'

interface InputShapeProps {
  shape: Shape
  baseUrl: string
  onRightSoundEnd: (pk: number, linkToPage?: number) => void
  showHints: boolean
  stopIntroSound: () => void
  onWrongAnswer: () => void
}

//TODO: create hints
export const InputShape = ({ shape, baseUrl, onRightSoundEnd, stopIntroSound, onWrongAnswer }: InputShapeProps) => {
  const soundUrl = shape.filePathRecording1 ? baseUrl + shape.filePathRecording1 : DefaultGoodAnswer

  const [play, { stop }] = useSound(soundUrl)
  const [playWrongAnswer] = useSound(DefaultWrongAnswer)
  const [playRightAnswer] = useSound(defaultGoodAnswer, {
    onend: () => onRightSoundEnd(shape.pk),
  })

  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('empty')

  const shapeRect = useMemo(() => {
    return getPathRect(shape.path)
  }, [shape.path])

  const maxLength = useMemo(() => {
    let answerLength = 0

    shape.settings.textAnswerArray?.forEach((t) => {
      if (t.length > answerLength) {
        answerLength = t.length
      }
    })

    return answerLength
  }, [shape.settings.textAnswerArray])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  if (!shapeRect || !maxLength) {
    return <></>
  }

  const onFocus = () => {
    stopIntroSound()
    play()
  }

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    stop()

    const inputValue = e.target.value
    if (inputValue === '') {
      setAnswerStatus('empty')
      return
    }

    let status: AnswerStatus = 'wrong'
    shape.settings.textAnswerArray?.forEach((t) => {
      if (t === inputValue) {
        status = 'right'
      }
    })

    if (status === 'wrong') {
      playWrongAnswer()
      onWrongAnswer()
    } else {
      playRightAnswer()
    }
    setAnswerStatus(status)
  }

  return (
    <Input
      readOnly={answerStatus === 'right'}
      maxLength={maxLength}
      {...shapeRect}
      onFocus={onFocus}
      onBlur={onBlur}
      className={answerStatus}
    />
  )
}

