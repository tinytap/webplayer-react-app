import { FocusEvent, useMemo, useState } from 'react'
import { Shape } from '../../../../stores/activitiesStoreTypes'
import { getFontSize, getPathRect } from '../../../../utils'
import DefaultGoodAnswer from '../../../../assets/sounds/defaultGoodAnswer.mp3'
import { Input } from './styles'
import DefaultWrongAnswer from '../../../../assets/sounds/DefaultWrongAnswer.mp3'
import defaultGoodAnswer from '../../../../assets/sounds/defaultGoodAnswer.mp3'
import { SlideSoundObj } from '../../../../hooks/useSlideSound'

export type AnswerStatus = 'empty' | 'right' | 'wrong'

interface InputShapeProps {
  shape: Shape
  baseUrl: string
  onRightSoundEnd: (pk: number, linkToPage?: number) => void
  showHints: boolean
  stopIntroSound: () => void
  onWrongAnswer: () => void
  playShapeSound: ({ onend, soundUrl }: SlideSoundObj) => void
}

//TODO: create hints
export const InputShape = ({
  shape,
  baseUrl,
  onRightSoundEnd,
  stopIntroSound,
  onWrongAnswer,
  playShapeSound,
}: InputShapeProps) => {
  const soundUrl = shape.filePathRecording1 ? baseUrl + shape.filePathRecording1 : DefaultGoodAnswer

  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('empty')

  const inputProps = useMemo(() => {
    const shapeRect = getPathRect(shape.path)

    let maxWord = ''
    shape.settings.textAnswerArray?.forEach((t) => {
      if (t.length > maxWord.length) {
        maxWord = t
      }
    })

    if (!maxWord || !shapeRect) {
      return
    }

    const fontSize = getFontSize({ text: maxWord, containerSize: shapeRect })

    return { ...shapeRect, fontSize, maxLength: maxWord.length }
  }, [shape])

  if (!inputProps) {
    return <></>
  }

  const onFocus = () => {
    stopIntroSound()
    playShapeSound({ soundUrl })
  }

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
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
      playShapeSound({ soundUrl: DefaultWrongAnswer })

      onWrongAnswer()
    } else {
      playShapeSound({
        soundUrl: defaultGoodAnswer,
        onend: () => onRightSoundEnd(shape.pk),
        fireOnendOnSoundStop: true,
        id: `right_${shape.pk}`,
      })
    }
    setAnswerStatus(status)
  }

  return (
    <Input
      readOnly={answerStatus === 'right'}
      {...inputProps}
      onFocus={onFocus}
      onBlur={onBlur}
      className={answerStatus}
    />
  )
}

