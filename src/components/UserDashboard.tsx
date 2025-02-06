import React from 'react'
import { Typography } from '@mui/material'

const UserDashboard = () => {
  return (
    <div>
      <Typography variant='h4' gutterBottom>
        User Dashboard
      </Typography>
      <Typography variant='body1'>Welcome to your dashboard! Here you can view and manage your tickets.</Typography>
      {/* Additional user functionalities can be added here */}
    </div>
  )
}

export default UserDashboard
