import React, { useState, useEffect } from 'react'
import {
  Box,
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
  IconButton,
  CircularProgress,
  Chip
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useAuth } from '@/context/AuthContext'
import { getAllTickets, assignTicket, updateTicketStatus, type Ticket } from '@/services/ticketService'

const SupportDashboard = () => {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const fetchedTickets = await getAllTickets()
      setTickets(fetchedTickets)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignTicket = async (ticketId: string, agentId: string) => {
    try {
      await assignTicket(ticketId, agentId)
      // Update local state
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId ? { ...ticket, assignedTo: agentId, assignedAt: new Date() } : ticket
        )
      )
      setModalOpen(false)
    } catch (error) {
      console.error('Error assigning ticket:', error)
    }
  }

  const handleStatusUpdate = async (ticketId: string, newStatus: Ticket['status']) => {
    if (!user?.uid) return

    try {
      await updateTicketStatus(ticketId, newStatus, user.uid)
      // Update local state
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, status: newStatus, lastUpdatedBy: user.uid, lastUpdatedAt: new Date() }
            : ticket
        )
      )
    } catch (error) {
      console.error('Error updating ticket status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      Open: 'error',
      'In Progress': 'warning',
      Resolved: 'success',
      Closed: 'default'
    }
    return colors[status as keyof typeof colors]
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Support Dashboard
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id.slice(0, 8)}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  <Chip
                    label={ticket.priority}
                    color={ticket.priority === 'High' ? 'error' : ticket.priority === 'Medium' ? 'warning' : 'default'}
                  />
                </TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>
                  <Chip label={ticket.status} color={getStatusColor(ticket.status)} />
                </TableCell>
                <TableCell>{ticket.userId}</TableCell>
                <TableCell>{ticket.assignedTo || 'Unassigned'}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedTicket(ticket)
                      setModalOpen(true)
                    }}
                  >
                    <AssignmentIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handleStatusUpdate(
                        ticket.id,
                        ticket.status === 'Open'
                          ? 'In Progress'
                          : ticket.status === 'In Progress'
                            ? 'Resolved'
                            : ticket.status === 'Resolved'
                              ? 'Closed'
                              : 'Open'
                      )
                    }
                  >
                    <CheckCircleIcon color={ticket.status === 'Closed' ? 'success' : 'inherit'} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper sx={{ p: 3, width: 400, maxWidth: '90%' }}>
          <Typography variant='h6' gutterBottom>
            Assign Ticket
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Assign To</InputLabel>
            <Select
              value={selectedTicket?.assignedTo || ''}
              onChange={e => {
                if (selectedTicket) {
                  handleAssignTicket(selectedTicket.id, e.target.value)
                }
              }}
            >
              <MenuItem value=''>Unassigned</MenuItem>
              <MenuItem value='agent1'>Agent 1</MenuItem>
              <MenuItem value='agent2'>Agent 2</MenuItem>
              <MenuItem value='agent3'>Agent 3</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant='contained' onClick={() => setModalOpen(false)}>
              Save
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  )
}

export default SupportDashboard
