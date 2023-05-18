import React, { useEffect, useState } from 'react'
import { Image } from 'react-konva'
import 'gifler'
import useImage from 'use-image'
import { propsAreEqual } from '../../utils'
import { PLAYER_HEIGHT, PLAYER_WIDTH, STATIC_BASE } from '../../utils/constants'
import { createStickerSize, fixSlideImageUrl } from './utils'

interface LayerProps {
  layer: any
  slideBase: string
  layerIndex: number
  slideIndex: number
}

const GIF = ({ src, imageSize, index }: { src: string; imageSize: any; index: number }) => {
  const imageRef = React.useRef<any>(null)
  const canvas = React.useMemo(() => {
    const node = document.createElement('canvas')
    return node
  }, [])

  React.useEffect(() => {
    // save animation instance to stop it on unmount
    let anim: any
    window.gifler(src).get((a: any) => {
      anim = a
      anim.animateInCanvas(canvas)
      anim.onDrawFrame = (ctx: any, frame: any) => {
        ctx.drawImage(frame.buffer, frame.x, frame.y)
        if (imageRef && imageRef.current) {
          imageRef.current.getLayer().draw()
        }
      }
    })
    return () => anim.stop()
  }, [src, canvas])

  return (
    <Image
      image={canvas}
      ref={imageRef}
      draggable={true}
      width={imageSize.w}
      height={imageSize.h}
      scaleX={imageSize.scale.x}
      scaleY={imageSize.scale.y}
      rotation={imageSize.rotation}
      x={PLAYER_WIDTH / 2 + imageSize.position.x}
      y={PLAYER_HEIGHT / 2 + imageSize.position.y}
      offsetX={imageSize.w / 2}
      offsetY={imageSize.h / 2}
      zIndex={index}
    />
  )
}

export const AnimationStickerLayerComponent = ({ layer = {}, slideBase, layerIndex, slideIndex }: LayerProps) => {
  const [imageSource, setImageSource] = useState(fixSlideImageUrl(slideIndex, slideBase + 'layers/', layer.filename))

  const [imageSize, setImageSize] = useState({} as any)
  //const [image] = useImage(imageSource)

  useEffect(() => {
    setImageSize(createStickerSize(layer))
  }, [layer])

  useEffect(() => {
    const nFileName = fixSlideImageUrl(slideIndex, slideBase + 'layers/', layer.filename)
    if (layer.filename && nFileName !== imageSource) setImageSource(nFileName)
  }, [layer.filename])

  useEffect(() => {
    if (layer.image && layer.image !== imageSource) setImageSource(layer.image)
  }, [layer.image])

  if (imageSize && imageSize.w) {
    console.log('StickerLayout imageSize && imageSize.w', imageSize && imageSize.w)
  }
  return imageSize && imageSize.w ? <GIF src={imageSource} imageSize={imageSize} index={layerIndex} /> : null
}

export const AnimationStickerLayer = React.memo(AnimationStickerLayerComponent, propsAreEqual)

