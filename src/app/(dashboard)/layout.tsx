// Type Imports
import type { ChildrenType } from '@core/types'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

const Layout = ({ children }: ChildrenType) => {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default Layout
