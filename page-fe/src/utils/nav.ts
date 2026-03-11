import { createContext } from "react"
import { useContext } from "react"

export type AdminNav = {
  activePanel: string
  openPanel: (key: string) => void
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