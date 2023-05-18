import { create } from 'zustand'
import { ActivitiesState } from './activitiesStoreTypes'

export const useActivitiesStore = create<ActivitiesState>()((set: any, get: any) => ({
  activities: [],
  getSlideActivities: (index) => {
    const _activities = get().activities
    if (!_activities || _activities.length < 1) return
    const slideActivities = _activities[index].activities
    return _activities
  },
  getSlide: (index) => {
    const _activities = get().activities
    if (!_activities || _activities.length < 1) return
    return _activities[index]
  },
  setActivities: (_activities) => set(() => ({ activities: _activities })),
  startActivity: (index) =>
    set((state) => {
      const _activities = [...state.activities]
      _activities[index] = { ..._activities[index], started: true, paused: false }
      return {
        activities: _activities,
      }
    }),
  pauseActivity: (index) =>
    set((state) => {
      const _activities = [...state.activities]
      _activities[index] = { ..._activities[index], paused: true }
      return {
        activities: _activities,
      }
    }),
  completeActivity: (index) =>
    set((state) => {
      const _activities = [...state.activities]
      _activities[index] = { ..._activities[index], completed: true }
      return {
        activities: _activities,
      }
    }),
}))

