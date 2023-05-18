import { Star } from 'react-konva'
import { Activity } from '../../stores/activitiesStoreTypes'
import { useActivitiesStore } from '../../stores/activitiesStore'

interface ActivityLayerProps {
  slideBase: string
  activity: Activity
  activityIndex: number
  slideIndex: number
}
export function ActivityLayer({ slideIndex }: ActivityLayerProps) {
  const slideActivity = useActivitiesStore((state) => state.getSlideActivityState(slideIndex || 0))

  console.log(slideActivity?.started, 'slideActivity - ' + slideIndex)
  return <Star numPoints={5} innerRadius={5} outerRadius={10} x={300} y={300} />
}

