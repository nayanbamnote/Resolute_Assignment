import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, Button } from '@mui/material'

interface Ticket {
  id: string
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  category: 'Technical Issue' | 'Billing' | 'General Inquiry' | 'Others'
  contactEmail: string
  contactPhone: string
  dueDate: Date
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  location?: string
  createdAt: Date
}

interface ViewTicketDialogProps {
  open: boolean
  onClose: () => void
  ticket: Ticket | null
  onEdit: (ticket: Ticket) => void
}

const ViewTicketDialog: React.FC<ViewTicketDialogProps> = ({ open, onClose, ticket, onEdit }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>View Ticket Details</DialogTitle>
      <DialogContent>
        {ticket && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant='subtitle2' color='text.secondary'>
                Ticket ID
              </Typography>
              <Typography variant='body1'>{ticket.id}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='subtitle2' color='text.secondary'>
                Created At
              </Typography>
              <Typography variant='body1'>{new Date(ticket.createdAt).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle2' color='text.secondary'>
                Title
              </Typography>
              <Typography variant='body1'>{ticket.title}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle2' color='text.secondary'>
                Description
              </Typography>
              <Typography variant='body1'>{ticket.description}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='subtitle2' color='text.secondary'>
                Priority
              </Typography>
              <Typography variant='body1'>{ticket.priority}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='subtitle2' color='text.secondary'>
                Category
              </Typography>
              <Typography variant='body1'>{ticket.category}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='subtitle2' color='text.secondary'>
                Contact Email
              </Typography>
              <Typography variant='body1'>{ticket.contactEmail}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='subtitle2' color='text.secondary'>
                Contact Phone
              </Typography>
              <Typography variant='body1'>{ticket.contactPhone}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='subtitle2' color='text.secondary'>
                Due Date
              </Typography>
              <Typography variant='body1'>{new Date(ticket.dueDate).toLocaleDateString()}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='subtitle2' color='text.secondary'>
                Status
              </Typography>
              <Typography variant='body1'>{ticket.status}</Typography>
            </Grid>
            {ticket.location && (
              <Grid item xs={12}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Location
                </Typography>
                <Typography variant='body1'>{ticket.location}</Typography>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            onClose()
            if (ticket) {
              onEdit(ticket)
            }
          }}
        >
          Edit Ticket
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewTicketDialog
