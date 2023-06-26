import { Context as KonvaContext } from 'konva/lib/Context'
import { PathItem } from '../stores/activitiesStoreTypes'

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
export const drawPoint = (p: PathItem, ctx: KonvaContext) => {
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

export const eraseInnerShape = (ctx: KonvaContext, path: PathItem[]) => {
  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = 'white'
  for (let i in path) {
    const point = path[i]
    drawPoint(point, ctx)
  }
  ctx.fill()
  ctx.restore()
}

