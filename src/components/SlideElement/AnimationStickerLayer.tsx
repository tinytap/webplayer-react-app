import React, { useEffect, useState } from 'react'
import { propsAreEqual } from '../../utils'
import { createStickerSize, fixSlideImageUrl } from './utils'
import { GIF } from './GifSticker'

interface LayerProps {
  layer: any // Assuming the layer can be any object, a more specific type would be better if possible
  slideBase: string
  layerIndex: number
  slideIndex: number
}

// AnimationStickerLayerComponent is a functional component that creates an animated sticker layer
export const AnimationStickerLayerComponent = ({ layer = {}, slideBase, layerIndex, slideIndex }: LayerProps) => {
  // State to manage the source of the image
  const [imageSource, setImageSource] = useState(fixSlideImageUrl(slideIndex, slideBase + 'layers/', layer.filename))

  // State to manage the size of the image
  const [imageSize, setImageSize] = useState({} as any)

  // Update the image size when the layer changes
  useEffect(() => {
    setImageSize(createStickerSize(layer))
  }, [layer])

  // Update the image source when the filename changes
  useEffect(() => {
    const nFileName = fixSlideImageUrl(slideIndex, slideBase + 'layers/', layer.filename)
    if (layer.filename && nFileName !== imageSource) setImageSource(nFileName)
  }, [layer.filename])

  // Update the image source when the layer image changes
  useEffect(() => {
    if (layer.image && layer.image !== imageSource) setImageSource(layer.image)
  }, [layer.image])

  // Conditional rendering if imageSize.w is defined, logs the image size and renders the GIF component
  return imageSize && imageSize.w ? <GIF src={imageSource} imageSize={imageSize} index={layerIndex} /> : null
}

// AnimationStickerLayer is a memoized version of AnimationStickerLayerComponent,
// which means it will only re-render if its props change, according to the comparison function propsAreEqual
export const AnimationStickerLayer = React.memo(AnimationStickerLayerComponent, propsAreEqual)

