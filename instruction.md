## 1. Project Overview

This project involves building a React-based support ticket system with Firebase Authentication and Firestore as the backend. The application will have two user roles: Customers and Support Agents. Customers can raise, view, and delete their own tickets, while Support Agents can view all tickets, update their status, and assign them to agents but cannot delete them. The application will feature a login system, a support dashboard for ticket management, and a role-based navigation system, ensuring a seamless experience for both Customers and Support Agents. The final product will be deployed on Firebase, Vercel, or Netlify.

## 2. Core Functionalities

#### Authentication Flow and Role Management:

Build a login page that uses Firebase Authentication to validate user credentials.
Configure Firebase to allow email/password logins and include the provided credentials for Customers and Support Agents.
Implement middleware (or route guards) to determine the user’s role upon login, and redirect Customers and Support Agents to their respective dashboards. This ensures that the navigation flow respects role-based access.

#### Ticket Management System:

Design and develop a support dashboard that displays ticket information in a table format with columns like Ticket ID, Title, Description, Priority, Status, Created By, Assigned To, and Actions.
For Customers, create a modal or dedicated page that includes a ticket submission form. This form should contain at least 12 diverse fields (text fields, dropdowns, date pickers, checkboxes, radio buttons, file upload, etc.), and it must include robust client-side validations.
Ensure that the data collected from the ticket submission form is stored securely in Firestore with a structure that facilitates efficient querying and real-time updates.

#### For Customer:

For a customer, the whole experience is pretty much built around one main page—the dashboard—plus the login page (which both roles share).

Here's how it all fits together:

Dashboard Page:
This is your central hub. When you log in, you're taken to the dashboard where you see a table of your tickets. For instance, if you have 3 tickets (say, T001, T002, T003), they'll all show up here with details like Title ("Router Down"), Priority ("High"), and so on. Actions like View, Edit, and Delete are available here.

Sidebar:
Think of the sidebar as a mini-menu on that same dashboard. It usually sticks to one side and has:

Tickets Page Button: This button either takes you to your tickets list or highlights the tickets section if you're already on the dashboard.
Logout Button: This simply logs you out when clicked.
So, the sidebar is not a separate page—it’s part of the dashboard, providing quick navigation and a consistent look.

Modals for Ticket Operations:
Instead of switching to a different page to raise a new ticket or edit an existing one, you'll trigger a modal. For example, clicking “New Ticket” opens up a form overlay (with fields like Title, Description, Priority, etc.) where you might see something like ticketTitle = "Internet Issue" and priority = "High". This keeps everything in one place.

Summing It Up for a Customer:

Pages to Create:
Login Page: (shared by all roles)
Dashboard Page: This includes the tickets list, sidebar (with Tickets and Logout), and modal interactions for ticket creation/editing.
So, it’s one main dashboard page with an integrated sidebar, not multiple separate pages for managing tickets.

#### Ticket Actions and Role-Specific Permissions:

Implement functionality so that when a Customer is logged in, they can view and delete only the tickets they have raised.
For Support Agents, build capabilities to view all tickets, update the status of any ticket, and assign tickets to team members.
Set up Firestore security rules and application logic to enforce these permissions, ensuring that the data operations (read, update, delete) adhere strictly to each user’s role.
Integrate action icons such as “View,” “Edit,” and “Delete” on the dashboard, making sure these controls are only enabled when the user’s role permits the action.

#### Role-Based Navigation:

Develop a sidebar navigation component that acts as the central hub for the application.
Include links to the Tickets Page for ticket management and a Logout Button that securely signs out the user via Firebase’s sign-out method.
Dynamically adjust the sidebar content based on the logged-in user’s role to display only relevant options, ensuring clarity and a streamlined user experience.

## 3. Current File Structure

The project’s file structure will be designed for maintainability and scalability:

```
root/
|-- src/
|   |-- components/
|   |   |-- TicketForm.tsx
|   |   |-- TicketTable.tsx
|   |   |-- Sidebar.tsx
|   |-- pages/
|   |   |-- login.tsx
|   |   |-- dashboard.tsx
|   |-- context/
|   |   |-- AuthContext.tsx
|   |-- utils/
|   |   |-- firebaseConfig.ts
|-- public/
|-- .gitignore
|-- package.json
|-- README.md
```

This structure ensures modularity, with separate folders for components, pages, authentication context, and utility functions. Firebase configuration will be kept in the utils directory, while authentication logic will be handled by an AuthContext to maintain a centralized authentication state. The components folder will house reusable UI components like the ticket form, ticket table, and sidebar, making the project easy to scale and manage as additional features are introduced.
