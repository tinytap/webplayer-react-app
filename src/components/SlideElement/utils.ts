import { decomposeMatrix, isUrl, radiansToDegrees, hashCode } from '../../utils'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../utils/constants'
export const getScaledImageCoordinates = (
  containerWidth: number,
  containerHeight: number,
  width: number,
  height: number,
  scale: number,
) => {
  const widthRatio = containerWidth / width
  const heightRatio = containerHeight / height
  const lowerRatio = Math.min(widthRatio, heightRatio)
  const higherRatio = Math.max(widthRatio, heightRatio)

  const newWidth = width * (width > height ? higherRatio : lowerRatio)
  const newHeight = height * (width > height ? higherRatio : lowerRatio)

  let offsetX = 0
  if (newWidth > newHeight && newWidth > PLAYER_WIDTH) {
    offsetX = ((newWidth - PLAYER_WIDTH) * scale) / 2
  }
  let offsetY = 0
  if (newHeight > newWidth && newHeight > PLAYER_HEIGHT) {
    offsetY = 100 //((newHeight - PLAYER_HEIGHT) * scale) / 2
  }

//  console.log(width > height ? 'higherRatio' : 'lowerRatio', 'ratio:')
  const SizeObj = {
    width: newWidth,
    height: newHeight,
    widthRatio,
    heightRatio,
    ratio: width > height ? higherRatio : lowerRatio,
    offset: { x: offsetX, y: offsetY },
  }
  //console.log('SizeObj', SizeObj)
  return SizeObj
}

export const createStickerSize = (sticker: any) => {
  const stickerSize = decomposeMatrix(sticker.transform.join(','))
  const r = 1
  var transformX = (PLAYER_WIDTH - sticker.width * r) / 2
  var transformY = (PLAYER_HEIGHT - sticker.height * r) / 2

  const imgSize = {
    w: sticker.type === 'txt' ? sticker.width * 2 : sticker.width,
    h: sticker.type === 'txt' ? sticker.height * 2 : sticker.height,
    fill: {
      x: sticker.transform[0],
      y: sticker.transform[3],
    },
    ...stickerSize,
    rotation: radiansToDegrees(stickerSize.rotation),
    scale: {
      x: stickerSize.scale.x / (sticker.type === 'txt' ? 2 : 1),
      y: stickerSize.scale.y / (sticker.type === 'txt' ? 2 : 1),
    },
    position: {
      x: stickerSize.position.x,
      y: stickerSize.position.y,
    },
    transformX,
    transformY,
  }
  return imgSize
}
const stickersCache = {} as any
const getFixedUrl = (url: string, prefix: string) => {
  const isStickerUrl = isUrl(url)
  if (isStickerUrl) return url
  return `${prefix}${url}`
}
export const fixSlideImageUrl = (cacheKey: string | number, prefix: string, filename: string) => {
  const fixedUrl = getFixedUrl(`${filename}?c=${cacheKey}`, prefix)
  const hashedUrl = hashCode(fixedUrl)

  if (stickersCache[hashedUrl]) {
    return stickersCache[hashedUrl]
  }
  const localStoredUrl = sessionStorage.getItem(`${hashedUrl}`)
  if (localStoredUrl) {
    stickersCache[hashedUrl] = localStoredUrl
    return localStoredUrl
  }

  sessionStorage.setItem(`${hashedUrl}`, fixedUrl)
  stickersCache[hashedUrl] = fixedUrl
  return fixedUrl
}

