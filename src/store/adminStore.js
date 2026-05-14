import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAdminStore = create(
  persist(
    (set) => ({
      activeClientId: null,
      setActiveClientId: (id) => set({ activeClientId: id }),
      clearActiveClient:  ()  => set({ activeClientId: null }),
    }),
    { name: 'agency-cms-admin-ctx' }
  )
)
