import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Typography
} from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { type Ticket } from '@/services/ticketService'

interface TicketDialogProps {
  open: boolean
  onClose: () => void
  currentTicket: Omit<Ticket, 'userId'>
  isEditing: boolean
  onSubmit: () => void
  errors: Record<string, string>
  setCurrentTicket: (
    ticket: Omit<Ticket, 'userId'> | ((prev: Omit<Ticket, 'userId'>) => Omit<Ticket, 'userId'>)
  ) => void
  termsAccepted: boolean
  setTermsAccepted: (accepted: boolean) => void
}

const TicketDialog: React.FC<TicketDialogProps> = ({
  open,
  onClose,
  currentTicket,
  isEditing,
  onSubmit,
  errors,
  setCurrentTicket,
  termsAccepted,
  setTermsAccepted
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentTicket(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{isEditing ? 'Edit Ticket' : 'New Ticket'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name='title'
              label='Title'
              fullWidth
              required
              value={currentTicket.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name='description'
              label='Description'
              multiline
              rows={4}
              fullWidth
              required
              value={currentTicket.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Priority</InputLabel>
              <Select name='priority' value={currentTicket.priority} onChange={handleInputChange} label='Priority'>
                {['Low', 'Medium', 'High', 'Urgent'].map(priority => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select name='category' value={currentTicket.category} onChange={handleInputChange} label='Category'>
                {['Technical Issue', 'Billing', 'General Inquiry', 'Others'].map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              name='contactEmail'
              label='Contact Email'
              fullWidth
              required
              value={currentTicket.contactEmail}
              onChange={handleInputChange}
              error={!!errors.contactEmail}
              helperText={errors.contactEmail}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name='contactPhone'
              label='Contact Phone'
              fullWidth
              required
              value={currentTicket.contactPhone}
              onChange={handleInputChange}
              error={!!errors.contactPhone}
              helperText={errors.contactPhone}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label='Due Date'
                value={currentTicket.dueDate}
                onChange={newValue => {
                  setCurrentTicket(prev => ({ ...prev, dueDate: newValue || new Date() }))
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <RadioGroup name='status' value={currentTicket.status} onChange={handleInputChange} row>
                {['Open', 'In Progress', 'Resolved', 'Closed'].map(status => (
                  <FormControlLabel key={status} value={status} control={<Radio />} label={status} />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name='location'
              label='Location'
              fullWidth
              value={currentTicket.location}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />}
              label='I accept the terms and conditions'
            />
            {errors.terms && (
              <Typography color='error' variant='caption' display='block'>
                {errors.terms}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant='contained' color='primary'>
          {isEditing ? 'Update' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TicketDialog
