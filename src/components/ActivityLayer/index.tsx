import { Star } from 'react-konva'
import { Activity } from '../../stores/activitiesStoreTypes'

interface ActivityLayerProps {
  slideBase: string
  activity: Activity
  activityIndex: number
  slideIndex: number
}
export function ActivityLayer({}: ActivityLayerProps) {
  return <Star numPoints={5} innerRadius={5} outerRadius={10} x={300} y={300} />
}

