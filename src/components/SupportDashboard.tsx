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
  Chip,
  Menu
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ViewIcon from '@mui/icons-material/Visibility'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useAuth } from '@/context/AuthContext'
import { getAllTickets, assignTicket, updateTicketStatus, type Ticket } from '@/services/ticketService'
import ViewTicketDialog from './ViewTicketDialog'

const SupportDashboard = () => {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [tempAssignment, setTempAssignment] = useState<string>('')

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

  const toggleTicketStatus = async (ticket: Ticket) => {
    if (!user?.uid) return

    try {
      let newStatus: Ticket['status']
      if (ticket.status === 'Open') newStatus = 'In Progress'
      else if (ticket.status === 'In Progress') newStatus = 'Resolved'
      else if (ticket.status === 'Resolved') newStatus = 'Closed'
      else newStatus = 'Open'

      // First update Firebase
      await updateTicketStatus(ticket.id, newStatus, user.uid)

      // After successful Firebase update, fetch fresh data
      await fetchTickets()
    } catch (error) {
      console.error('Error updating ticket status:', error)
    }
  }

  const handleAssignTicket = async (ticketId: string, agentId: string) => {
    if (!user?.uid) return

    try {
      setLoading(true)

      // Update local state immediately for better UX
      setTickets(prevTickets =>
        prevTickets.map(ticket => (ticket.id === ticketId ? { ...ticket, assignedTo: agentId } : ticket))
      )

      // Then update Firebase
      await assignTicket(ticketId, agentId)

      // Fetch fresh data to ensure sync
      const fetchedTickets = await getAllTickets()
      setTickets(fetchedTickets)
      setModalOpen(false)
    } catch (error) {
      console.error('Error assigning ticket:', error)
      // Revert local state on error
      await fetchTickets()
    } finally {
      setLoading(false)
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

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setViewModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setSelectedTicket(null)
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant='h4'>Support Dashboard</Typography>
        <Button startIcon={<RefreshIcon />} onClick={fetchTickets} variant='outlined'>
          Refresh
        </Button>
      </Box>

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
                  <Chip label={ticket.status} color={getStatusColor(ticket.status)} sx={{ minWidth: '100px' }} />
                </TableCell>
                <TableCell>{ticket.userId}</TableCell>
                <TableCell>
                  {ticket.assignedTo ? (
                    <Chip
                      label={
                        ticket.assignedTo === 'sarah.smith'
                          ? 'Sarah Smith'
                          : ticket.assignedTo === 'john.doe'
                            ? 'John Doe'
                            : ticket.assignedTo === 'mike.brown'
                              ? 'Mike Brown'
                              : ticket.assignedTo === 'emma.wilson'
                                ? 'Emma Wilson'
                                : ticket.assignedTo
                      }
                      color='primary'
                      variant='outlined'
                    />
                  ) : (
                    'Unassigned'
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewTicket(ticket)}>
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedTicket(ticket)
                      setModalOpen(true)
                    }}
                  >
                    <AssignmentIcon color={ticket.assignedTo ? 'primary' : 'inherit'} />
                  </IconButton>
                  <IconButton onClick={() => toggleTicketStatus(ticket)}>
                    <CheckCircleIcon color={ticket.status === 'Resolved' ? 'green' : ''} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ViewTicketDialog
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        ticket={selectedTicket}
        onEdit={() => {
          handleCloseViewModal()
          setModalOpen(true)
        }}
      />

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setTempAssignment('')
          setSelectedTicket(null)
        }}
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
              value={tempAssignment || selectedTicket?.assignedTo || ''}
              onChange={e => {
                setTempAssignment(e.target.value)
              }}
            >
              <MenuItem value=''>Unassigned</MenuItem>
              <MenuItem value='sarah.smith'>Sarah Smith (Technical)</MenuItem>
              <MenuItem value='john.doe'>John Doe (Billing)</MenuItem>
              <MenuItem value='mike.brown'>Mike Brown (Support)</MenuItem>
              <MenuItem value='emma.wilson'>Emma Wilson (General)</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              onClick={() => {
                setModalOpen(false)
                setTempAssignment('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                if (selectedTicket && tempAssignment !== undefined) {
                  handleAssignTicket(selectedTicket.id, tempAssignment)
                }
              }}
            >
              Save
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  )
}

export default SupportDashboard
