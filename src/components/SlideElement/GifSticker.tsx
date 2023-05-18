import React from 'react'
import { Image } from 'react-konva'
import 'gifler' // A library to decode and animate GIFs
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../utils/constants'

// GIF is a functional component that decodes, animates and renders a GIF image
export const GIF = ({ src, imageSize, index }: { src: string; imageSize: any; index: number }) => {
  // References to the Konva image and the Canvas
  const imageRef = React.useRef<any>(null)
  const canvas = React.useMemo(() => {
    const node = document.createElement('canvas')
    return node
  }, [])

  React.useEffect(() => {
    let anim: any // An instance to save the current GIF animation
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
    // Clean up function to stop the GIF animation when the component unmounts
    return () => anim.stop()
  }, [src, canvas])

  // Render the GIF as a Konva Image
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

