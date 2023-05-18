import React, { useEffect, useRef, useState } from 'react'
import { Rect, Text } from 'react-konva'
import { Html } from 'react-konva-utils'
import html2canvas from 'html2canvas'
import { propsAreEqual } from '../../utils'
import { PLAYER_HEIGHT, PLAYER_WIDTH, STATIC_BASE } from '../../utils/constants'
import { StickerLayer } from './StickerLayer'

interface LayerProps {
  layer: any
  slideBase: string
  layerIndex: number
  slideIndex: number
}

function createTextScreenshot(layer: any) {
  let textDiv: HTMLElement
  return new Promise((resolve, reject) => {
    try {
      //console.log('createTextScreenshot')
      textDiv = document.createElement('div')
      textDiv.classList.add('layer-text', 'tt-stage-text')
      textDiv.innerHTML = layer.info
      textDiv.style.width = layer.width + 'px'
      textDiv.style.height = layer.height + 'px'
      document.body.append(textDiv)
      resolve(textDiv)
    } catch (err) {
      console.log(err, 'Error Occured')
      reject(err)
    }
  }).then(() => {
    return html2canvas(textDiv, {
      backgroundColor: 'rgba(0,0,0,0)',
    }).then((r) => {
      textDiv.remove()
      return r
    })
  })
}

export const TextLayerComponent = ({ layer = {}, slideBase, layerIndex, slideIndex }: LayerProps) => {
  //const fixedSticker = useRef({ ...layer })
  const cachedBase = localStorage.getItem(layer.info)
  const [fixedSticker, setFixedSticker] = useState({ ...layer, image: cachedBase ? cachedBase : null }) as any
  const hasImage = useRef(false)

  //const layerSize = decomposeMatrix(layer.transform.join(','))

  useEffect(() => {
    if (!hasImage.current) {
      if (!fixedSticker.image) {
        createTextScreenshot(layer).then((canvas) => {
          console.log('NO CACHE')
          hasImage.current = true
          const image = canvas.toDataURL()

          localStorage.setItem(layer.info, image)
          setFixedSticker({
            ...fixedSticker,
            image,
            width: layer.width,
            height: layer.height,
          })
          console.log(
            {
              ...fixedSticker,
              image,
              width: layer.width,
              height: layer.height,
            },
            'USEEFFECT',
          )
        })
      }
    }
  }, [layer])

  if (!fixedSticker || !fixedSticker.type) {
    return null
  }
  if (fixedSticker && fixedSticker.image) {
    return <StickerLayer layerIndex={layerIndex} layer={fixedSticker} slideBase={slideBase} slideIndex={slideIndex} />
  }

  return (
    <Html
      divProps={{
        style: {
          width: layer.width + 'px',
          height: layer.height + 'px',
          lineHeight: '1.2',
          position: 'absolute',
          //left: PLAYER_WIDTH / 2 + fixedSticker.transform[4] + 'px',
          //top: PLAYER_HEIGHT / 2 + fixedSticker.transform[5] + 'px',
        },
      }}
    >
      <div className="text-layer" dangerouslySetInnerHTML={{ __html: layer.info }}></div>
    </Html>
  )
}

export const TextLayer = TextLayerComponent //React.memo(TextLayerComponent, propsAreEqual)

