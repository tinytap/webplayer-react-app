// Utils and constants imports
import { decomposeMatrix, isUrl, radiansToDegrees, hashCode } from '../../utils'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../utils/constants'

/**
 * Compute the scaled image coordinates.
 *
 * @param {number} containerWidth - The width of the container.
 * @param {number} containerHeight - The height of the container.
 * @param {number} width - The image width.
 * @param {number} height - The image height.
 * @param {number} scale - The scale factor.
 *
 * @return {object} - The calculated width, height, ratios and offsets.
 */
export const getScaledImageCoordinates = (
  containerWidth: number,
  containerHeight: number,
  width: number,
  height: number,
  scale: number,
) => {
  const ratioCalculations = getRatioCalculations(containerWidth, containerHeight, width, height)
  const offsets = getOffsets(ratioCalculations.width, ratioCalculations.height, scale)
  return { ...ratioCalculations, offset: offsets }
}

/**
 * Calculate the width and height ratios and their maximum and minimum.
 *
 * @param {number} containerWidth - The width of the container.
 * @param {number} containerHeight - The height of the container.
 * @param {number} width - The image width.
 * @param {number} height - The image height.
 *
 * @return {object} - The calculated width, height, and ratios.
 */
const getRatioCalculations = (containerWidth: number, containerHeight: number, width: number, height: number) => {
  const widthRatio = containerWidth / width
  const heightRatio = containerHeight / height
  const lowerRatio = Math.min(widthRatio, heightRatio)
  const higherRatio = Math.max(widthRatio, heightRatio)

  const newWidth = width * (width > height ? higherRatio : lowerRatio)
  const newHeight = height * (width > height ? higherRatio : lowerRatio)

  return {
    width: newWidth,
    height: newHeight,
    widthRatio,
    heightRatio,
    ratio: width > height ? higherRatio : lowerRatio,
  }
}

/**
 * Calculate the offsets based on the new width and height, and the scale.
 *
 * @param {number} newWidth - The new image width.
 * @param {number} newHeight - The new image height.
 * @param {number} scale - The scale factor.
 *
 * @return {object} - The calculated offsets.
 */
const getOffsets = (newWidth: number, newHeight: number, scale: number) => {
  let offsetX = 0
  if (newWidth > newHeight && newWidth > PLAYER_WIDTH) {
    offsetX = ((newWidth - PLAYER_WIDTH) * scale) / 2
  }
  let offsetY = 0
  if (newHeight > newWidth && newHeight > PLAYER_HEIGHT) {
    offsetY = 100
  }
  return { x: offsetX, y: offsetY }
}

/**
 * Compute the size of the sticker.
 *
 * @param {any} sticker - The sticker object.
 *
 * @return {object} - The computed sticker size.
 */
export const createStickerSize = (sticker: any) => {
  // Decompose the transformation matrix to extract size.
  const stickerSize = decomposeMatrix(sticker.transform.join(','))

  // Scale factor
  const r = 1

  // Calculate the transformation for x and y coordinates.
  var transformX = (PLAYER_WIDTH - sticker.width * r) / 2
  var transformY = (PLAYER_HEIGHT - sticker.height * r) / 2

  // Return the calculated image size.
  return getImgSize(sticker, stickerSize, transformX, transformY)
}

/**
 * Calculate the image size and transformations.
 *
 * @param {any} sticker - The sticker object.
 * @param {any} stickerSize - The sticker size object.
 * @param {number} transformX - The transformation in x coordinate.
 * @param {number} transformY - The transformation in y coordinate.
 *
 * @return {object} - The calculated image size and transformations.
 */
const getImgSize = (sticker: any, stickerSize: any, transformX: number, transformY: number) => {
  return {
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
}

// Cache for sticker URL
const stickersCache: Record<string, string> = {}

/**
 * Fix and cache the slide image URL.
 *
 * @param {string | number} cacheKey - The cache key.
 * @param {string} prefix - The prefix of the URL.
 * @param {string} filename - The image file name.
 *
 * @return {string} - The fixed and cached URL.
 */
export const fixSlideImageUrl = (cacheKey: string | number, prefix: string, filename: string) => {
  const fixedUrl = getFixedUrl(`${filename}?c=${cacheKey}`, prefix)
  const hashedUrl = hashCode(fixedUrl)

  return getStickerFromCache(hashedUrl.toString(), fixedUrl)
}

/**
 * Fix the sticker URL.
 *
 * @param {string} url - The original URL.
 * @param {string} prefix - The prefix of the URL.
 *
 * @return {string} - The fixed URL.
 */
const getFixedUrl = (url: string, prefix: string) => {
  const isStickerUrl = isUrl(url)
  return isStickerUrl ? url : `${prefix}${url}`
}

/**
 * Retrieve the sticker URL from cache.
 * If not present, store it to both session storage and local cache.
 *
 * @param {string} hashedUrl - The hashed URL as key.
 * @param {string} fixedUrl - The URL to be cached.
 *
 * @return {string} - The cached URL.
 */
const getStickerFromCache = (hashedUrl: string, fixedUrl: string) => {
  // If URL is present in local cache, return it.
  if (stickersCache[hashedUrl]) {
    return stickersCache[hashedUrl]
  }

  // If URL is present in session storage, cache it locally and return.
  const localStoredUrl = sessionStorage.getItem(hashedUrl)
  if (localStoredUrl) {
    stickersCache[hashedUrl] = localStoredUrl
    return localStoredUrl
  }

  // If URL is not cached anywhere, store it in both session storage and local cache.
  sessionStorage.setItem(hashedUrl, fixedUrl)
  stickersCache[hashedUrl] = fixedUrl
  return fixedUrl
}

