import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export const useRouteGuard = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      // Public paths that don't require authentication
      const publicPaths = ['/login', '/register', '/forgot-password']
      const isPublicPath = publicPaths.some(path => pathname?.startsWith(path))

      if (!user && !isPublicPath) {
        router.push('/login')
      } else if (user && isPublicPath) {
        router.push('/')
      }
    }
  }, [user, loading, pathname, router])

  return { loading }
}
