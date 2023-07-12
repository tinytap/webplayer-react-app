import { useEffect, useState } from 'react'
import { Shape } from '../stores/activitiesStoreTypes'

export interface ShapesStatus {
  [shapePk: number]: { didClickShape: boolean; linkToPage?: number }
}

interface useShowHintsProps {
  shapes: Shape[]
  moveToNextSlide: (index?: number) => void
}

export function useShapesStatus({ shapes, moveToNextSlide }: useShowHintsProps) {
  const [shapesStatus, setShapeStatus] = useState<ShapesStatus>()

  useEffect(() => {
    const data: ShapesStatus = {}
    shapes.forEach((s) => {
      if (!s.path || !s.path.length) {
        return
      }
      data[s.pk] = { didClickShape: false }
    })
    setShapeStatus(data)
  }, [shapes])

  useEffect(() => {
    if (!shapesStatus) {
      return
    }

    const slideNavigate = () => {
      let allShapesAreClicked = true
      let linkToPage: number | undefined = undefined

      for (const prop in shapesStatus) {
        const value = shapesStatus[prop]
        if (!value.didClickShape) {
          allShapesAreClicked = false
        } else if (value.linkToPage !== undefined) {
          linkToPage = value.linkToPage
        }
      }

      if (linkToPage !== undefined) {
        moveToNextSlide(linkToPage)
        return
      }

      if (allShapesAreClicked) {
        moveToNextSlide()
      }
    }
    slideNavigate()
  }, [shapesStatus, moveToNextSlide])

  return { shapesStatus, setShapeStatus }
}

