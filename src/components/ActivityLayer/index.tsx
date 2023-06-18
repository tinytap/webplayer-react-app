import { Star } from 'react-konva'
import { Activity, ActivityState } from '../../stores/activitiesStoreTypes'
import { getEngineString } from '../../utils/tt-utils'

interface ActivityLayerProps {
  slideBase: string
  activityIndex: number
  slideIndex: number
  engine: 'S' | 'R' | 'A' | 'V' | 'P' | 'Q' | 'T'
  /*| 'slide'
    | 'reading'
    | 'soundboard'
    | 'video'
    | 'puzzle'
    | 'questions'
    | 'text input'*/
  activity: Activity
  activityState: ActivityState
}
export function ActivityLayer({
  slideBase,
  slideIndex,
  activityIndex,
  activity,
  activityState,
  engine,
}: ActivityLayerProps) {
  //console.log(activitiesState, 'activitiesState')
  console.log(
    `slide ${slideIndex} | activity: ${activityIndex} | ${activityState?.started ? 'started' : 'not started'} | ${
      activityState?.paused ? 'paused' : 'playing'
    } ${getEngineString(engine)}`,
    activity,
  )

  return <Star numPoints={5} innerRadius={5} outerRadius={10} x={300} y={300} />
}

