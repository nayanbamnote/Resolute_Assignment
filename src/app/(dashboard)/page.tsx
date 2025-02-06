'use client'

// React Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Hook Imports
import { useAuth } from '@/context/AuthContext'

const DashboardAnalytics = () => {
  // Hooks
  const router = useRouter()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <Typography variant='h4'>Dashboard</Typography>
        <Button variant='contained' color='primary' onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Typography>Welcome, {user?.email}</Typography>
    </div>
  )
}

export default DashboardAnalytics
