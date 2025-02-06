import { db } from '@/utils/firebaseConfig'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'

export interface Ticket {
  id: string
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  category: 'Technical Issue' | 'Billing' | 'General Inquiry' | 'Others'
  attachment?: File
  contactEmail: string
  contactPhone: string
  dueDate: Date
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  assignedTo: string | null
  assignedAt?: Date
  lastUpdatedBy?: string
  lastUpdatedAt?: Date
  location?: string
  createdAt: Date
  userId: string // Add userId to track ticket ownership
}

export const ticketsCollection = collection(db, 'tickets')

export const addTicket = async (ticket: Omit<Ticket, 'id'>): Promise<string> => {
  console.log('addTicket called with data:', ticket) // Debug log
  try {
    const ticketData = {
      ...ticket,
      dueDate: ticket.dueDate.toISOString(),
      createdAt: new Date().toISOString()
    }
    console.log('Formatted ticket data for Firestore:', ticketData) // Debug log

    const docRef = await addDoc(ticketsCollection, ticketData)
    console.log('Ticket added with ID:', docRef.id) // Debug log
    return docRef.id
  } catch (error) {
    console.error('Error in addTicket:', error) // Debug log
    throw error
  }
}

export const updateTicket = async (ticketId: string, ticket: Partial<Ticket>): Promise<void> => {
  console.log('updateTicket called with ID:', ticketId, 'and data:', ticket) // Debug log
  try {
    const ticketRef = doc(db, 'tickets', ticketId)
    const updateData = {
      ...ticket,
      dueDate: ticket.dueDate ? ticket.dueDate.toISOString() : undefined
    }
    console.log('Formatted update data:', updateData) // Debug log
    await updateDoc(ticketRef, updateData)
    console.log('Ticket updated successfully') // Debug log
  } catch (error) {
    console.error('Error in updateTicket:', error) // Debug log
    throw error
  }
}

export const deleteTicket = async (ticketId: string): Promise<void> => {
  const ticketRef = doc(db, 'tickets', ticketId)
  await deleteDoc(ticketRef)
}

export const getUserTickets = async (userId: string): Promise<Ticket[]> => {
  console.log('getUserTickets called for userId:', userId)

  if (!userId) {
    console.error('No userId provided to getUserTickets')
    return []
  }

  try {
    const q = query(ticketsCollection, where('userId', '==', userId))
    console.log('Firestore query created:', q)

    const querySnapshot = await getDocs(q)
    console.log('Query snapshot received, size:', querySnapshot.size)
    console.log('Query snapshot empty?:', querySnapshot.empty)

    if (querySnapshot.empty) {
      console.log('No tickets found for user')
      return []
    }

    const tickets = querySnapshot.docs
      .map(doc => {
        const data = doc.data()
        console.log('Raw document data:', data)

        try {
          const formattedTicket = {
            ...data,
            id: doc.id,
            dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            title: data.title || '',
            description: data.description || '',
            priority: data.priority || 'Low',
            category: data.category || 'Technical Issue',
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            status: data.status || 'Open',
            userId: data.userId
          } as Ticket

          console.log('Formatted ticket:', formattedTicket)
          return formattedTicket
        } catch (formatError) {
          console.error('Error formatting ticket:', formatError, 'Raw data:', data)
          return null
        }
      })
      .filter(ticket => ticket !== null) as Ticket[]

    console.log('Returning formatted tickets:', tickets)
    return tickets
  } catch (error) {
    console.error('Error in getUserTickets:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
    }
    return []
  }
}

export const getAllTickets = async (): Promise<Ticket[]> => {
  try {
    const querySnapshot = await getDocs(ticketsCollection)
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        dueDate: new Date(data.dueDate),
        createdAt: new Date(data.createdAt),
        assignedAt: data.assignedAt ? new Date(data.assignedAt) : undefined,
        lastUpdatedAt: data.lastUpdatedAt ? new Date(data.lastUpdatedAt) : undefined,
        status: data.status || 'Open' // Ensure status always has a value
      } as Ticket
    })
  } catch (error) {
    console.error('Error fetching all tickets:', error)
    throw error
  }
}

export const assignTicket = async (ticketId: string, agentId: string): Promise<void> => {
  const ticketRef = doc(db, 'tickets', ticketId)
  const updateData = {
    assignedTo: agentId,
    assignedAt: new Date().toISOString(),
    lastUpdatedBy: agentId,
    lastUpdatedAt: new Date().toISOString()
  }

  try {
    await updateDoc(ticketRef, updateData)
    console.log('Ticket assigned successfully:', { ticketId, agentId })
  } catch (error) {
    console.error('Error assigning ticket:', error)
    throw error
  }
}

export const updateTicketStatus = async (
  ticketId: string,
  status: Ticket['status'],
  updatedBy: string
): Promise<void> => {
  const ticketRef = doc(db, 'tickets', ticketId)
  const updateData = {
    status,
    lastUpdatedBy: updatedBy,
    lastUpdatedAt: new Date().toISOString()
  }

  try {
    await updateDoc(ticketRef, updateData)
    console.log('Ticket status updated successfully:', { ticketId, status, updatedBy })
  } catch (error) {
    console.error('Error updating ticket status:', error)
    throw error
  }
}
