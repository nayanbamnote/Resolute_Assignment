'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import LoadingScreen from '@/components/LoadingScreen'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?from=${pathname}`)
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return <LoadingScreen />
  }

  return user ? <>{children}</> : null
}

export default ProtectedRoute
