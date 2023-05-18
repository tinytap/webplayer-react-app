// Required libraries and components
import React, { useEffect, useState } from 'react'
import { Rect } from 'react-konva'
import { usePlayerStore } from '../../stores/playerStore'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../utils/constants'
import { createStickerSize, fixSlideImageUrl, getScaledImageCoordinates } from './utils'
import { useImage } from '../../hooks/useImage'

// Defining types for the layer and ImageSize objects
interface layer {
  filename?: string
}

interface ImageSize {
  w?: number
  h?: number
  offset?: { x: number; y: number }
  ratio?: number
}

// Props type for the BackgroundLayerComponent
interface LayerProps {
  layer: layer
  slideBase: string
  layerIndex: number
  slideIndex: number
}

// BackgroundLayerComponent is a functional component that represents a background layer in the slide system
const BackgroundLayerComponent: React.FC<LayerProps> = ({ layer, slideBase, layerIndex, slideIndex }) => {
  // Creating the full image URL for the layer
  if (!layer?.filename) return null
  const fixedImage = fixSlideImageUrl(slideIndex, slideBase + 'layers/', layer.filename)

  // Using hooks to manage image source and size
  const [imageSource, setImageSource] = useState(fixedImage)
  const playerScale = usePlayerStore((state) => state.scale)
  const [imageSize, setImageSize] = useState<ImageSize>({})
  const [image, imageStatus, setImageUrl] = useImage(imageSource)

  // useEffect to handle image resizing when the layer or image changes
  useEffect(() => {
    if (layer && image?.width && image.height) {
      const scaled = getScaledImageCoordinates(PLAYER_WIDTH, PLAYER_HEIGHT, image.width, image.height, playerScale)
      const size = createStickerSize({ ...layer })
      setImageSize({ ...size, ...scaled })
    }
  }, [layer, image, slideBase])

  // useEffect to handle changes in layer filename
  useEffect(() => {
    if (layer.filename && image && layer.filename !== image?.src) {
      const newFileName = fixSlideImageUrl(slideIndex, slideBase + 'layers/', layer.filename)
      setImageSource(newFileName)
      setImageUrl(newFileName)
    }
  }, [layer.filename, slideBase])

  // Render a Konva Rect with image applied if imageSize is defined
  return imageSize?.w ? (
    <Rect
      draggable={false}
      width={PLAYER_WIDTH}
      height={PLAYER_HEIGHT}
      rotation={0}
      x={0}
      y={0}
      fillPatternImage={image}
      fillPatternOffsetX={imageSize.offset?.x}
      fillPatternOffsetY={imageSize.offset?.y}
      fillPatternScaleX={imageSize.ratio}
      fillPatternScaleY={imageSize.ratio}
      zIndex={layerIndex}
    />
  ) : null
}

// React.memo is used to prevent unnecessary re-renders of this component
export const BackgroundLayer = React.memo(BackgroundLayerComponent)

