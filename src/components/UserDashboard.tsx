import React, { useState, useEffect } from 'react'
import {
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import TicketDialog from './TicketDialog'
import ViewTicketDialog from './ViewTicketDialog'
import { useAuth } from '@/context/AuthContext'
import { addTicket, updateTicket, deleteTicket, getUserTickets, type Ticket } from '@/services/ticketService'

const initialTicketState: Omit<Ticket, 'id' | 'createdAt' | 'userId'> = {
  title: '',
  description: '',
  priority: 'Low',
  category: 'Technical Issue',
  contactEmail: '',
  contactPhone: '',
  dueDate: new Date(),
  status: 'Open',
  location: ''
}

const UserDashboard = () => {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [currentTicket, setCurrentTicket] = useState(initialTicketState)
  const [isEditing, setIsEditing] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      console.log('fetchTickets called, user?.uid:', user?.uid)
      if (!user?.uid) {
        console.log('No user ID available, returning early')
        return
      }

      setLoading(true)
      try {
        console.log('Auth state:', {
          isAuthenticated: !!user,
          userId: user.uid,
          email: user.email
        })

        console.log('Fetching tickets for user:', user.uid)
        const userTickets = await getUserTickets(user.uid)
        console.log('Fetched tickets:', userTickets)
        setTickets(userTickets)
      } catch (error) {
        console.error('Error fetching tickets:', error)
        if (error instanceof Error) {
          console.error('Error details:', error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    console.log('useEffect triggered, auth state:', {
      isAuthenticated: !!user,
      userId: user?.uid
    })
    fetchTickets()
  }, [user?.uid])

  const handleOpenModal = () => {
    setOpenModal(true)
    setIsEditing(false)
    setCurrentTicket(initialTicketState)
    setTermsAccepted(false)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setErrors({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentTicket(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!currentTicket.title || currentTicket.title.length < 5 || currentTicket.title.length > 100) {
      newErrors.title = 'Title must be between 5 and 100 characters'
    }

    if (
      !currentTicket.description ||
      currentTicket.description.length < 20 ||
      currentTicket.description.length > 1000
    ) {
      newErrors.description = 'Description must be between 20 and 1000 characters'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!currentTicket.contactEmail || !emailRegex.test(currentTicket.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
    }

    const phoneRegex = /^\d{10,15}$/
    if (!currentTicket.contactPhone || !phoneRegex.test(currentTicket.contactPhone)) {
      newErrors.contactPhone = 'Phone number must be between 10 and 15 digits'
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm() || !user?.uid) {
      console.log('Form validation failed or no user ID')
      return
    }

    try {
      if (isEditing && currentTicket.id) {
        console.log('Updating ticket:', currentTicket)
        await updateTicket(currentTicket.id, currentTicket)
        setTickets(prev => prev.map(ticket => (ticket.id === currentTicket.id ? currentTicket : ticket)))
      } else {
        console.log('Creating new ticket for user:', user.uid)
        const newTicketData: Omit<Ticket, 'id'> = {
          ...currentTicket,
          userId: user.uid,
          createdAt: new Date()
        }
        console.log('New ticket data:', newTicketData)

        const ticketId = await addTicket(newTicketData)
        console.log('Ticket created with ID:', ticketId)

        const newTicket: Ticket = {
          ...newTicketData,
          id: ticketId
        }

        setTickets(prev => [...prev, newTicket])
      }

      handleCloseModal()
    } catch (error) {
      console.error('Error saving ticket:', error)
    }
  }

  const handleEditTicket = (ticket: Ticket) => {
    setCurrentTicket(ticket)
    setIsEditing(true)
    setOpenModal(true)
  }

  const handleDeleteTicket = async (id: string) => {
    try {
      await deleteTicket(id)
      setTickets(prev => prev.filter(ticket => ticket.id !== id))
    } catch (error) {
      console.error('Error deleting ticket:', error)
    }
  }

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setViewModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setSelectedTicket(null)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h4' gutterBottom>
          User Dashboard
        </Typography>
        <Button variant='contained' color='primary' onClick={handleOpenModal}>
          New Ticket
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  Loading tickets...
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.priority}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>{new Date(ticket.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewTicket(ticket)}>
                      <ViewIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditTicket(ticket)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTicket(ticket.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ViewTicketDialog
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        ticket={selectedTicket}
        onEdit={handleEditTicket}
      />

      <TicketDialog
        open={openModal}
        onClose={handleCloseModal}
        currentTicket={currentTicket}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        errors={errors}
        setCurrentTicket={setCurrentTicket}
        termsAccepted={termsAccepted}
        setTermsAccepted={setTermsAccepted}
      />
    </Box>
  )
}

export default UserDashboard
