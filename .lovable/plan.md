
# AutoMSP Churn Detection Platform

A multi-tenant SaaS platform that helps Managed Service Providers (MSPs) identify and prevent customer churn by analyzing sentiment, usage patterns, and SLA breaches across their client base.

---

## 1. Authentication & Multi-Tenant Foundation

### User Authentication
- Email/password login and signup with email verification
- Password reset functionality
- Session management with secure token handling

### Multi-Tenant Organization Structure
- MSP companies (tenants) can sign up and create their organization
- Each organization has isolated data - no cross-tenant visibility
- Organization settings page for company details and branding

### Role-Based Access Control
- **Admin**: Full access - manage users, settings, integrations, all client data
- **Account Manager**: View dashboards, manage assigned clients, create/edit interactions
- **Viewer**: Read-only access to dashboards and reports

---

## 2. Client Management

### Client Directory
- Searchable, sortable table of all end clients with key metrics
- Filter by risk level, account manager, contract value, last contact date
- Bulk actions for assigning account managers

### Client Profiles
- Detailed client information (company name, contacts, contract details)
- Client health score prominently displayed
- Activity timeline showing all interactions, tickets, and risk events
- Notes and internal comments section

### Client Onboarding
- Add new client form with validation
- Import clients from CSV
- Assign to account managers

---

## 3. Risk Dashboard & Analytics

### Executive Dashboard
- **Churn Risk Overview**: Cards showing clients at High/Medium/Low risk
- **Portfolio Health Score**: Aggregate health metric across all clients
- **Risk Trend Chart**: Line graph showing risk trajectory over time
- **Top At-Risk Clients**: Priority list requiring immediate attention

### Risk Scoring Engine
- **Composite Risk Score** calculated from:
  - Sentiment score (from interactions/tickets)
  - Usage/engagement metrics
  - Recency of contact
  - Volume of support tickets
  - SLA compliance status
- Visual risk breakdown showing which factors contribute most

### Client Risk Details
- Individual client risk analysis page
- Historical risk trend for that client
- Recommended actions based on risk factors
- Action logging (calls made, emails sent, issues resolved)

---

## 4. Interaction & Ticket Tracking

### Manual Data Entry
- Log client interactions (calls, emails, meetings)
- Record support tickets and resolutions
- Add sentiment notes and observations
- Quick-add forms for common interaction types

### Ticket Management
- View all tickets per client
- Track open vs. resolved tickets
- SLA tracking with overdue alerts
- Link tickets to risk impact

---

## 5. Integration Hub

### Integration Configuration Dashboard
- Card-based view of available integrations
- Connection status indicators
- API credential management (secure storage)

### HubSpot Integration
- Connect HubSpot account via API key
- Sync contacts and companies to client records
- Import deal/contract information
- Pull email interaction history

### ServiceNow Integration
- Connect ServiceNow instance
- Sync incident and ticket data
- Import SLA metrics
- Track response and resolution times

### ConnectWise Integration
- Connect ConnectWise Manage
- Sync service tickets
- Import agreement and contract data
- Pull billing and usage information

### Generic API Configuration
- Custom integration setup for other tools
- API endpoint configuration
- Field mapping interface
- Test connection functionality

---

## 6. Reports & Exports

### Pre-Built Reports
- Monthly churn risk summary
- Client health trends report
- Account manager performance
- SLA compliance report

### Data Export
- Export client data to CSV
- Export risk reports
- Download dashboard views as PDF

---

## 7. Settings & Administration

### Organization Settings
- Company profile and branding
- Risk threshold configuration
- Notification preferences
- Data retention settings

### User Management (Admin only)
- Invite new users with role assignment
- Manage existing user roles
- Deactivate users
- View user activity logs

### Audit Log
- Track all system changes
- User action history
- Integration sync logs

---

## Design & User Experience

### Enterprise Professional Style
- Structured, organized layouts with clear visual hierarchy
- Professional color palette (blues, grays, with accent colors for risk levels)
- Data-dense tables with sorting and filtering
- Card-based metric displays
- Consistent navigation sidebar
- Breadcrumb navigation for deep pages
- Responsive design for desktop-first usage

---

## Technical Architecture

### Database (Lovable Cloud / Supabase)
- Multi-tenant schema with Row-Level Security
- Organizations, users, clients, interactions, tickets tables
- Secure API credential storage
- Audit logging tables

### Security
- Role-based RLS policies
- Encrypted credential storage for integrations
- JWT-based authentication
- Secure edge functions for external API calls

