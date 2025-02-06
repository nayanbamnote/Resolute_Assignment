'use client'

// React Imports
import { useState, ChangeEvent } from 'react'
import type { FormEvent } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'
import Link from '@/components/Link'

// MUI Imports
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Hook Imports
import { useAuth } from '@/context/AuthContext'

const Login = () => {
  // States
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Hooks
  const router = useRouter()
  const { signIn } = useAuth()

  // Get the redirect path from URL
  const searchParams = new URLSearchParams(window.location.search)
  const from = searchParams.get('from') || '/dashboard'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(formData.email, formData.password)
      router.push(from)
    } catch (error: any) {
      setError(
        error.code === 'auth/invalid-credential' ? 'Invalid email or password' : 'An error occurred. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-md p-6'>
        <Typography variant='h4' className='text-center mb-6'>
          Login
        </Typography>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <TextField
            fullWidth
            label='Email'
            value={formData.email}
            onChange={handleInputChange('email')}
            error={!!error}
          />
          <TextField
            fullWidth
            label='Password'
            type='password'
            value={formData.password}
            onChange={handleInputChange('password')}
            error={!!error}
            helperText={error}
          />
          <Button fullWidth variant='contained' type='submit' disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </Button>
          <div className='text-center mt-4'>
            <Link href='/register'>Don't have an account? Register</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
