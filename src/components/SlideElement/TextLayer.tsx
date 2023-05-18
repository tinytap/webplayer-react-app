// React and react-konva library imports
import React, { useEffect, useRef, useState } from 'react'
import { Rect, Text } from 'react-konva'
import { Html } from 'react-konva-utils'
import html2canvas from 'html2canvas' // library to capture screenshots and generate canvas
import { propsAreEqual } from '../../utils' // utility function to compare properties
import { PLAYER_HEIGHT, PLAYER_WIDTH, STATIC_BASE } from '../../utils/constants' // Constants from utility
import { StickerLayer } from './StickerLayer' // Component to render a sticker layer

// Type definition for LayerProps
interface LayerProps {
  layer: any
  slideBase: string
  layerIndex: number
  slideIndex: number
}

// Function to create screenshot for text layers
function createTextScreenshot(layer: any) {
  let textDiv: HTMLElement

  // Returns a promise which creates an HTML element, adds styles and properties to it, and then captures a screenshot
  return new Promise((resolve, reject) => {
    try {
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

// Component to render a text layer
export const TextLayerComponent = ({ layer = {}, slideBase, layerIndex, slideIndex }: LayerProps) => {
  const cachedBase = localStorage.getItem(layer.info)
  const [fixedSticker, setFixedSticker] = useState({
    ...layer,
    image: cachedBase ? cachedBase : null,
  }) as any
  const hasImage = useRef(false)

  // Effect hook to generate screenshot if not available in cache
  useEffect(() => {
    if (!hasImage.current) {
      if (!fixedSticker.image) {
        createTextScreenshot(layer).then((canvas) => {
          hasImage.current = true
          const image = canvas.toDataURL()

          localStorage.setItem(layer.info, image)
          setFixedSticker({
            ...fixedSticker,
            image,

            width: layer.width,
            height: layer.height,
          })
        })
      }
    }
  }, [layer])

  // Returns null if no valid sticker layer information
  if (!fixedSticker || !fixedSticker.type) {
    return null
  }

  // Renders the sticker layer if an image exists
  if (fixedSticker && fixedSticker.image) {
    return <StickerLayer layerIndex={layerIndex} layer={fixedSticker} slideBase={slideBase} slideIndex={slideIndex} />
  }

  // Renders the HTML layer if no image exists
  return (
    <Html
      divProps={{
        style: {
          width: layer.width + 'px',
          height: layer.height + 'px',
          lineHeight: '1.2',
          position: 'absolute',
        },
      }}
    >
      <div className="text-layer" dangerouslySetInnerHTML={{ __html: layer.info }}></div>
    </Html>
  )
}

// Exports the TextLayerComponent
// Note: It's not wrapped in React.memo to prevent unnecessary re-renders as the component depends only on the props
export const TextLayer = TextLayerComponent

