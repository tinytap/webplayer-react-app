export const getRandomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export const getRandomIndexFromArray = (arr: any[]) => {
  return arr.length <= 1 ? 0 : getRandomBetween(0, arr.length - 1)
}
export const getRandomItemFromArray = (arr: any[]) => {
  return arr[getRandomIndexFromArray(arr)]
}

export const propsAreEqual = (prevProps: any, nextProps: any) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps.src)
}
export const radiansToDegrees = (radians: number) => {
  var pi = Math.PI
  return radians * (180 / pi)
}

export const isUrl = (url: string = '') => {
  const urlRegex =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
  return url.match(urlRegex)
}

export const hashCode = (str: string, seed = window.gameId || 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)

  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

