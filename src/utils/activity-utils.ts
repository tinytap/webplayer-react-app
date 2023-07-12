import { Context as KonvaContext } from 'konva/lib/Context'
import { Group } from 'konva/lib/Group'
import { ShapesStatus } from '../hooks/useShapesStatus'
import { PathItem, Shape } from '../stores/activitiesStoreTypes'
import { SHAKE_SPEED_MS, SLIDE_CONTAINER_ID, SLIDE_CONTAINER_SHAKE_CLASS } from './constants'

export const getYoutubeVideoId = (url: string) => {
  const regExp =
    /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[?=&+%\w-]*/gi // eslint-disable-line
  const match = regExp.exec(url)

  return match ? match[1] : ''
}

export const getLocalVideo = (baseUrl: string, videoURL: string) => {
  const videoPath = baseUrl + 'video/' + videoURL.substr(8, videoURL.length - 8)
  return videoPath
}

const pathElementType = {
  MoveToPoint: 0,
  AddLineToPoint: 1,
  AddQuadCurveToPoint: 2,
  AddCurveToPoint: 3,
  CloseSubpath: 4,
}
const drawPoint = (p: PathItem, ctx: KonvaContext) => {
  switch (p.type) {
    case pathElementType.AddLineToPoint:
      ctx.lineTo(p.x, p.y)
      break
    case pathElementType.MoveToPoint:
      ctx.moveTo(p.x, p.y)
      break
    case pathElementType.AddCurveToPoint:
      ctx.bezierCurveTo(p.cp1x!, p.cp1y!, p.cp2x!, p.cp2y!, p.x, p.y)
      break
    case pathElementType.AddQuadCurveToPoint:
      ctx.quadraticCurveTo(p.cpx!, p.cpy!, p.x, p.y)
      break
    case pathElementType.CloseSubpath:
      ctx.closePath()
      break
    default:
      ctx.lineTo(p.x, p.y)
  }
}

export const drawShape = (ctx: KonvaContext, path: PathItem[]) => {
  ctx.beginPath()

  for (let i in path) {
    const point = path[i]
    drawPoint(point, ctx)
  }
}

export const pulseShape = (shapeNode: Group) => {
  const scale = 1.1

  shapeNode.to({
    scaleX: scale,
    scaleY: scale,
    onFinish: () => {
      shapeNode.to({
        scaleX: 1,
        scaleY: 1,
      })
    },
  })
}

export const getPathFromOriginPosition = (
  path: PathItem[],
  shapePosition: {
    y: number
    x: number
  },
) => {
  return path.map((oldV) => {
    const newV = { ...oldV }

    newV.x = oldV.x - shapePosition.x
    newV.y = oldV.y - shapePosition.y
    if (typeof oldV.cpx === 'number') {
      newV.cpx = oldV.cpx - shapePosition.x
    }
    if (typeof oldV.cpy === 'number') {
      newV.cpy = oldV.cpy - shapePosition.y
    }
    if (typeof oldV.cp1x === 'number') {
      newV.cp1x = oldV.cp1x - shapePosition.x
    }
    if (typeof oldV.cp1y === 'number') {
      newV.cp1y = oldV.cp1y - shapePosition.y
    }
    if (typeof oldV.cp2x === 'number') {
      newV.cp2x = oldV.cp2x - shapePosition.x
    }
    if (typeof oldV.cp2y === 'number') {
      newV.cp2y = oldV.cp2y - shapePosition.y
    }

    return newV
  })
}

interface moveShapeProps {
  shapeNode: Group | null
  location: 'to-right-place' | 'to-origin-place'
  duration?: number
  onFinish?: () => void
  shape: Shape
}

export const moveShape = ({ shapeNode, location, duration, onFinish, shape }: moveShapeProps) => {
  if (!shapeNode) {
    return
  }

  if (location === 'to-origin-place') {
    shapeNode.to({
      x: shape.settings.originTransform[4],
      y: shape.settings.originTransform[5],
      duration: duration,
      onFinish: onFinish,
    })
  } else {
    shapeNode.to({
      x: 0,
      y: 0,
      duration: duration,
      onFinish: onFinish,
    })
  }
}

export const updateShapesStatus = ({
  setClickedShapes,
  shapePk,
  linkToPage,
}: {
  setClickedShapes: (value: React.SetStateAction<ShapesStatus | undefined>) => void
  shapePk: number
  linkToPage?: number
}) => {
  setClickedShapes((oldValue) => {
    const newValue = { ...oldValue }
    if (newValue[shapePk] !== undefined && !newValue[shapePk].didClickShape) {
      newValue[shapePk].didClickShape = true
      newValue[shapePk].linkToPage = linkToPage
      return newValue
    }

    return oldValue
  })
}

export const getPathRect = (path: PathItem[]) => {
  if (!path || !path.length) {
    return undefined
  }

  let maxX = path[0].x
  let minX = path[0].x
  let maxY = path[0].y
  let minY = path[0].y

  path.forEach((i) => {
    if (i.x !== undefined) {
      maxX = Math.max(maxX, i.x)
      minX = Math.min(minX, i.x)
    }

    if (i.y !== undefined) {
      maxY = Math.max(maxY, i.y)
      minY = Math.min(minY, i.y)
    }
  })

  const rect = { y: minY, x: minX, w: maxX - minX, h: maxY - minY }
  return rect
}

interface getFontSizeProps {
  text: string
  containerSize: { h: number; w: number }
  fontFamily?: string
  minSize?: number
}
export const getFontSize = ({ text, containerSize, fontFamily = 'ariel', minSize = 16 }: getFontSizeProps) => {
  const test = document.createElement('span')
  test.style.visibility = 'hidden'
  test.style.border = '0'
  test.style.padding = '0'
  test.style.whiteSpace = 'pre'

  const minFont = 10
  const maxFont = 100
  test.innerHTML = text
  test.style.fontFamily = fontFamily
  document.body.append(test)

  test.style.fontSize = maxFont + 'px'
  const { width: maxWidth, height: maxHeight } = test.getBoundingClientRect()

  test.style.fontSize = minFont + 'px'
  const { width: minWidth, height: minHeight } = test.getBoundingClientRect()

  test.remove()

  const width = ((containerSize.w - minWidth) * (maxFont - minFont)) / (maxWidth - minWidth) + minFont
  const height = ((containerSize.h - minHeight) * (maxFont - minFont)) / (maxHeight - minHeight) + minFont
  const size = Math.min(width, height) - 5

  return Math.max(size, minSize)
}

export const shakeContainer = () => {
  const SlideContainer = document.getElementById(SLIDE_CONTAINER_ID)
  if (!SlideContainer) {
    return
  }
  SlideContainer.classList.add(SLIDE_CONTAINER_SHAKE_CLASS)

  setTimeout(() => {
    SlideContainer.classList.remove(SLIDE_CONTAINER_SHAKE_CLASS)
  }, SHAKE_SPEED_MS)
}

