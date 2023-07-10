import { FocusEvent, useMemo, useState } from 'react'
import { Shape } from '../../../../stores/activitiesStoreTypes'
import { getFontSize, getPathRect } from '../../../../utils'
import DefaultGoodAnswer from '../../../../assets/sounds/defaultGoodAnswer.mp3'
import { Input } from './styles'
import DefaultWrongAnswer from '../../../../assets/sounds/DefaultWrongAnswer.mp3'
import defaultGoodAnswer from '../../../../assets/sounds/defaultGoodAnswer.mp3'
import { PlaySound } from '../../../../hooks/useSlideSounds'
import { playerColors } from '../../../../utils/constants'
import { HintBubble } from '../../../../atoms/HintBubble'

export type AnswerStatus = 'empty' | 'right' | 'wrong'

interface InputShapeProps {
  shape: Shape
  baseUrl: string
  onRightSoundEnd: (pk: number, linkToPage?: number) => void
  showHints: boolean
  onWrongAnswer: () => void
  playShapeSound: ({ onend, soundUrl }: PlaySound) => void
  showHint: boolean
}

export const InputShape = ({
  shape,
  baseUrl,
  onRightSoundEnd,
  onWrongAnswer,
  playShapeSound,
  showHint,
}: InputShapeProps) => {
  const soundUrl = shape.filePathRecording1 ? baseUrl + shape.filePathRecording1 : DefaultGoodAnswer

  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('empty')
  const [hintStatus, setHintStatus] = useState({
    showHintTrigger: 0,
    text: '_',
  })

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

      setHintStatus((oldV) => {
        let answer = shape.settings.textAnswerArray && shape.settings.textAnswerArray[0]
        if (!answer) {
          return oldV
        }
        let newText = answer.slice(0, oldV.text.length)
        if (newText.length < answer.length) {
          newText = `${newText}_`
        }

        return { text: newText, showHintTrigger: Math.random() }
      })

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
    <>
      <Input
        readOnly={answerStatus === 'right'}
        {...inputProps}
        onFocus={onFocus}
        onBlur={onBlur}
        className={answerStatus}
      />
      {!showHint && (
        <HintBubble
          text={hintStatus.text}
          rect={{ x: inputProps.x, y: inputProps.y, w: inputProps.w, h: inputProps.h }}
          color={playerColors.wrongAnswerRed}
          showHintTrigger={hintStatus.showHintTrigger}
        />
      )}
    </>
  )
}

