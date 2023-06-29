import { Context as KonvaContext } from 'konva/lib/Context'
import { Group } from 'konva/lib/Group'
import { PathItem, Shape } from '../stores/activitiesStoreTypes'

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

export const drawShape = (ctx: KonvaContext, shape: Shape) => {
  ctx.beginPath()

  for (let i in shape.path) {
    const point = shape.path[i]
    drawPoint(point, ctx)
  }
}

export const pulseShape = (shapeNode: Group, shape: Shape) => {
  const originalCenterPoint = getPathCenterPoint(shape.path)

  if (!originalCenterPoint) {
    return
  }

  const scale = 1.1
  // TODO: fix offset calculation 
  const offsetX = originalCenterPoint.x * scale - originalCenterPoint.x
  const offsetY = originalCenterPoint.y * scale - originalCenterPoint.y

  shapeNode.to({
    scaleX: scale,
    scaleY: scale,
    offsetX: offsetX,
    offsetY: offsetY,
    onFinish: () => {
      shapeNode.to({
        scaleX: 1,
        scaleY: 1,
        offsetX: 0,
        offsetY: 0
      })
    },
  })
}

const getPathCenterPoint = (path: PathItem[]) => {
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

  const centerPoint = { y: minY + (maxY - minY) / 2, x: minX + (maxX - minX) / 2 }
  return centerPoint
}

