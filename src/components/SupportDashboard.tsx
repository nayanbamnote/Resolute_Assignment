import React, { useState, useEffect } from 'react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Modal,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const SupportDashboard = () => {
  const [tickets, setTickets] = useState([]) // Initialize tickets state
  const [modalOpen, setModalOpen] = useState(false)
  const [currentTicket, setCurrentTicket] = useState({
    id: 0,
    title: '',
    description: '',
    priority: '',
    status: '',
    createdBy: '',
    assignedTo: '',
    category: '',
    date: '',
    isUrgent: false,
    attachments: null
  })

  useEffect(() => {
    // Fetch tickets from Firestore or any other source
    // setTickets(fetchedTickets)
  }, [])

  const updateStatus = (ticketId: number) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return { ...ticket, status: ticket.status === 'Open' ? 'Closed' : 'Open' }
      }
      return ticket
    })
    setTickets(updatedTickets)
  }

  const assignTicket = (ticketId: number) => {
    const assignedTo = prompt('Enter the name of the person to assign the ticket to:')
    if (assignedTo) {
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === ticketId) {
          return { ...ticket, assignedTo }
        }
        return ticket
      })
      setTickets(updatedTickets)
    }
  }

  return (
    <div>
      <Typography variant='h4' gutterBottom>
        Support Dashboard
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{ticket.createdBy}</TableCell>
                <TableCell>{ticket.assignedTo}</TableCell>
                <TableCell>
                  <IconButton onClick={() => updateStatus(ticket.id)}>
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton onClick={() => assignTicket(ticket.id)}>
                    <AssignmentIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: 'white',
            margin: 'auto',
            marginTop: '100px',
            width: '500px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant='h6'>Assign Ticket</Typography>
          <FormControl fullWidth margin='normal'>
            <InputLabel>Assign To</InputLabel>
            <Select
              value={currentTicket.assignedTo}
              onChange={e => setCurrentTicket({ ...currentTicket, assignedTo: e.target.value })}
            >
              <MenuItem value='Bob'>Bob</MenuItem>
              <MenuItem value='Charlie'>Charlie</MenuItem>
              <MenuItem value='David'>David</MenuItem>
              {/* Add more users as needed */}
            </Select>
          </FormControl>
          <Button variant='contained' color='primary' onClick={() => assignTicket(currentTicket.id)}>
            Assign
          </Button>
          <Button variant='outlined' onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default SupportDashboard
