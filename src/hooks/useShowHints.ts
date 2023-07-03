import { useEffect, useState } from 'react'
import { SHOW_HINT_TIME_S } from '../utils/constants'

export function useShowHints() {
  const [showHints, setShowHints] = useState(false)

  useEffect(() => {
    let isMounted = false
    if (!showHints) {
      return
    }

    setTimeout(() => {
      if (isMounted) {
        return
      }
      setShowHints(false)
    }, SHOW_HINT_TIME_S * 1000)

    return () => {
      isMounted = true
    }
  }, [setShowHints, showHints])

  return { showHints, setShowHints }
}

