import { AdminNavContext } from "@/utils/nav"
import type { AdminNav } from "@/utils/nav"

export function AdminNavProvider({
  value,
  children,
}: {
  value: AdminNav
  children: React.ReactNode
}) {
  return (
    <AdminNavContext.Provider value={value}>
      {children}
    </AdminNavContext.Provider>
  )
}