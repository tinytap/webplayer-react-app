// Required libraries and components
import React, { useEffect, useState } from 'react'
import { Rect } from 'react-konva'
import { usePlayerStore } from '../../stores/playerStore'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../utils/constants'
import { createStickerSize, fixSlideImageUrl, getScaledImageCoordinates } from './utils'
import { useImage } from '../../hooks/useImage'

// Defining types for the Sticker and ImageSize objects
interface Sticker {
  filename?: string
  image?: string
}

interface ImageSize {
  w?: number
  h?: number
  offset?: { x: number; y: number }
  scale?: { x: number; y: number }
  position?: { x: number; y: number }
  ratio?: number
  rotation?: number
}

// Props type for the StickerLayerComponent
interface LayerProps {
  layer: Sticker
  slideBase: string
  layerIndex: number
  slideIndex: number
}

// StickerLayerComponent is a functional component that represents a layer in the slide system
const StickerLayerComponent: React.FC<LayerProps> = ({ layer, slideBase, layerIndex, slideIndex }) => {
  // Creating the full image URL for the layer
  if (!layer?.filename && !layer.image) return null

  const fixedImage =
    layer.image && layer.image.includes('data:image/png')
      ? layer.image
      : fixSlideImageUrl(slideIndex, slideBase + 'layers/', layer.filename || '')

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
    if (layer?.filename && image && layer.filename !== image?.src) {
      const newFileName = fixSlideImageUrl(slideIndex, slideBase + 'layers/', layer.filename)
      setImageSource(newFileName)
      setImageUrl(newFileName)
    }
  }, [layer.filename, slideBase])

  useEffect(() => {
    if ((layer?.image || layer?.filename) && image && layer.image !== image?.src) {
      const newFileName =
        layer.image && layer.image.includes('data:image/png')
          ? layer.image
          : fixSlideImageUrl(slideIndex, slideBase + 'layers/', layer.filename || '')

      setImageSource(newFileName)
      setImageUrl(newFileName)
    }
  }, [layer.image, slideBase])

  // Render a Konva Rect with image applied if imageSize is defined
  return imageSize?.w && imageSize?.h && imageSize?.position && imageSize?.scale ? (
    <Rect
      draggable={true}
      width={imageSize.w}
      height={imageSize.h}
      scaleX={imageSize.scale.x}
      scaleY={imageSize.scale.y}
      rotation={imageSize.rotation}
      x={PLAYER_WIDTH / 2 + imageSize.position.x}
      y={PLAYER_HEIGHT / 2 + imageSize.position.y}
      fillPatternImage={image}
      offsetX={imageSize.w / 2}
      offsetY={imageSize.h / 2}
      fillPatternScaleX={1}
      fillPatternScaleY={1}
      zIndex={layerIndex}
    />
  ) : null
}

// React.memo is used to prevent unnecessary re-renders of this component
export const StickerLayer = React.memo(StickerLayerComponent)

