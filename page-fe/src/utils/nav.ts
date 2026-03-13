/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react"
import { useContext } from "react"

export type AdminNav = {
  activePanel: string
  activeParams?: Record<string, any>;
  openPanel: (key: string, param?: Record<string, any>) => void
  goBack: () => void
  canGoBack: boolean
}

export const AdminNavContext = createContext<AdminNav | null>(null)

export function useAdminNav() {
  const ctx = useContext(AdminNavContext)
  if (!ctx) {
    throw new Error("useAdminNav must be used inside AdminNavProvider")
  }
  return ctx
}