import React, { useState } from 'react'
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
  // Initialize tickets state with dummy data
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: 'Issue with login',
      description: 'User cannot log in',
      priority: 'High',
      status: 'Open',
      createdBy: 'Alice',
      assignedTo: 'Bob',
      category: 'Technical',
      date: '2023-10-01',
      isUrgent: false,
      attachments: null
    },
    {
      id: 2,
      title: 'Page not found',
      description: '404 error on homepage',
      priority: 'Medium',
      status: 'Closed',
      createdBy: 'Charlie',
      assignedTo: 'David',
      category: 'General',
      date: '2023-10-02',
      isUrgent: true,
      attachments: null
    },
    {
      id: 3,
      title: 'Payment processing error',
      description: 'User reports payment not going through',
      priority: 'High',
      status: 'Open',
      createdBy: 'Eve',
      assignedTo: 'Frank',
      category: 'Billing',
      date: '2023-10-03',
      isUrgent: true,
      attachments: null
    }
    // Add more dummy tickets as needed
  ])

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

  const updateStatus = (ticketId: number) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return { ...ticket, status: ticket.status === 'Open' ? 'Closed' : 'Open' }
      }
      return ticket
    })
    setTickets(updatedTickets)
  }

  const openAssignModal = (ticketId: number) => {
    setCurrentTicket(tickets.find(ticket => ticket.id === ticketId)!)
    setModalOpen(true)
  }

  const assignTicket = () => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === currentTicket.id) {
        return { ...ticket, assignedTo: currentTicket.assignedTo }
      }
      return ticket
    })
    setTickets(updatedTickets)
    setModalOpen(false)
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
                <TableCell>
                  <Button
                    variant='contained'
                    color={ticket.status === 'Open' ? 'success' : 'error'}
                    onClick={() => updateStatus(ticket.id)}
                  >
                    {ticket.status}
                  </Button>
                </TableCell>
                <TableCell>{ticket.createdBy}</TableCell>
                <TableCell>{ticket.assignedTo}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openAssignModal(ticket.id)}>
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
          <Button variant='contained' color='primary' onClick={assignTicket}>
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
