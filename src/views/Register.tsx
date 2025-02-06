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
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// Hook Imports
import { useAuth } from '@/context/AuthContext'

const Register = () => {
  // States
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Hooks
  const router = useRouter()
  const { signUp } = useAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await signUp(formData.email, formData.password)
      router.push('/')
    } catch (error: any) {
      setError(
        error.code === 'auth/email-already-in-use'
          ? 'Email already in use'
          : error.message || 'An error occurred. Please try again.'
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
          Register
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
          />
          <TextField
            fullWidth
            label='Confirm Password'
            type='password'
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            error={!!error}
          />
          {error && (
            <Typography color='error' variant='body2' className='text-center'>
              {error}
            </Typography>
          )}
          <Button fullWidth variant='contained' type='submit' disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
          <div className='text-center mt-4'>
            <Link href='/login'>Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
