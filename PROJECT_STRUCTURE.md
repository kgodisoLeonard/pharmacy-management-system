# PharmaCare Project Structure

## Overview

This document outlines the complete structure and organization of the PharmaCare Hospital Pharmacy Management System.

## Directory Structure

```
/app
├── page.tsx                 # Login page
├── layout.tsx              # Root layout with auth provider
├── globals.css             # Global styles with design tokens
└── /dashboard
    ├── layout.tsx          # Dashboard layout with sidebar
    ├── page.tsx            # Main dashboard overview
    ├── /patients           # Patient management
    ├── /prescriptions      # Prescription management
    ├── /dispensing         # Medication dispensing
    ├── /cupboard           # Medication cupboard access
    ├── /inventory          # Inventory management
    ├── /audit              # Audit log and transactions
    ├── /admin              # Admin panel (users, settings)
    ├── /settings           # User account settings
    └── /help               # Help and documentation

/components
├── ui/                     # shadcn/ui components
├── app-sidebar.tsx         # Main navigation sidebar
├── stat-card.tsx           # Statistics card component
├── quick-actions.tsx       # Quick actions component
└── skeleton-card.tsx       # Loading skeletons

/lib
├── types.ts               # TypeScript type definitions
├── db.ts                  # In-memory database
├── auth.ts                # Authentication logic
├── auth-context.tsx       # React context for auth state
└── utils.ts               # Utility functions

/public                    # Static assets

README.md                  # Project documentation
PROJECT_STRUCTURE.md       # This file
```

## Key Components and Their Functions

### Authentication System (`/lib/auth.ts` & `/lib/auth-context.tsx`)

- Handles user login/logout
- Session management with localStorage persistence
- Role-based permission checking
- Face ID simulation with password fallback
- Cupboard access authentication

### Database Layer (`/lib/db.ts`)

- In-memory data storage with mock implementation
- User management functions
- Patient record management
- Prescription tracking
- Medication inventory
- Transaction and audit logging

### Pages & Routes

#### Dashboard (`/app/dashboard/page.tsx`)
- Welcome screen with user statistics
- Quick access buttons
- Recent activity feed
- Low stock alerts
- Pending prescriptions overview

#### Patients (`/app/dashboard/patients/page.tsx`)
- Patient list with search and filters
- Add new patient form
- Edit patient information
- Patient status tracking
- Medical history

#### Prescriptions (`/app/dashboard/prescriptions/page.tsx`)
- Create new prescriptions (Doctor only)
- View prescription list
- Filter by status (pending, completed, cancelled)
- Add medication items to prescriptions
- Prescription workflow management

#### Dispensing (`/app/dashboard/dispensing/page.tsx`)
- Process prescriptions for dispensing
- Barcode scanning simulation
- Dosage validation
- Receipt generation
- Dispensing confirmation

#### Cupboard Access (`/app/dashboard/cupboard/page.tsx`)
- Face ID authentication
- Password authentication fallback
- Medication access logging
- Real-time access status
- Security audit trail

#### Inventory (`/app/dashboard/inventory/page.tsx`)
- Medication stock level display
- Low stock alerts
- Expiry date monitoring
- Restock functionality
- Batch tracking
- Stock history

#### Audit Log (`/app/dashboard/audit/page.tsx`)
- Complete transaction history
- Filterable by action, user, medication
- CSV export capability
- Activity statistics
- Compliance reporting

#### Admin Panel (`/app/dashboard/admin/page.tsx`)
- User account creation and management
- Role assignment
- User deletion
- System statistics
- Role distribution view

#### Settings (`/app/dashboard/settings/page.tsx`)
- Profile information display
- Password change functionality
- 2FA setup (coming soon)
- Notification preferences
- Logout functionality

#### Help & Documentation (`/app/dashboard/help/page.tsx`)
- Quick tips and best practices
- Role descriptions and permissions
- Frequently asked questions
- Security guidelines
- Support contact information

## Data Models

### User Model
```typescript
{
  id: string
  name: string
  email: string
  password: string (hashed)
  role: 'admin' | 'doctor' | 'pharmacist' | 'assistant' | 'stock_taker'
  isActive: boolean
  lastLogin: Date
}
```

### Patient Model
```typescript
{
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email: string
  phone: string
  address: string
  medicalHistory: string
  status: 'admitted' | 'discharged' | 'discharged'
  admissionDate: Date
}
```

### Prescription Model
```typescript
{
  id: string
  patientId: string
  doctorId: string
  status: 'pending' | 'completed' | 'cancelled'
  items: PrescriptionItem[]
  notes: string
  createdAt: Date
  completedAt?: Date
}
```

### Medication Model
```typescript
{
  id: string
  name: string
  description: string
  dosage: string
  manufacturer: string
  batchNumber: string
  expiryDate: string
}
```

### Inventory Item
```typescript
{
  medicationId: string
  quantity: number
  reorderLevel: number
  expiryDate: string
  location: string
}
```

### Transaction Model
```typescript
{
  id: string
  timestamp: Date
  action: string (DISPENSE, RESTOCK, CUPBOARD_ACCESS, etc.)
  userId: string
  medicationId: string
  patientId?: string
  quantity?: number
  details?: string
}
```

## Role-Based Access Control

### Admin
- All permissions enabled
- User management
- System configuration
- Audit log access
- Report generation

### Doctor
- Create prescriptions
- View patient records
- Dashboard access

### Pharmacist
- Dispense medications
- Manage inventory
- Access medication cupboard
- View prescriptions
- Audit log access

### Pharmacy Assistant
- Assist with dispensing
- Support inventory tasks
- View patient information
- Dashboard access

### Stock Taker
- Manage medication inventory
- Update stock levels
- Monitor expiry dates
- Audit log access

## Design System

### Color Palette
- Primary: Teal (#059669) - Medical/Healthcare
- Success: Green
- Warning: Amber
- Destructive: Red
- Neutrals: Gray scale

### Typography
- Font Family: Inter
- Heading Hierarchy: H1-H6
- Line Heights: 1.4-1.6

### Components
- Cards for content grouping
- Badges for status indicators
- Buttons with variants (primary, outline, ghost)
- Input fields with validation
- Tables for data presentation
- Modals for important actions
- Toasts for notifications

## Security Features

1. **Authentication**: Session-based with localStorage persistence
2. **Authorization**: Role-based permission checking
3. **Audit Logging**: Complete transaction history
4. **Access Control**: Cupboard requires Face ID or password
5. **Password Security**: Password change functionality
6. **Session Management**: Automatic session expiration

## API Routes (Ready for Backend Integration)

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/patients`
- `POST /api/patients`
- `PUT /api/patients/[id]`
- `GET /api/prescriptions`
- `POST /api/prescriptions`
- `GET /api/medications`
- `POST /api/dispensing`
- `GET /api/inventory`
- `PUT /api/inventory/[id]`
- `GET /api/audit`
- `POST /api/users` (admin only)

## Future Enhancements

1. **Database Migration**: Replace in-memory store with PostgreSQL/SQLite
2. **API Integration**: Create RESTful API backend
3. **Real Barcode Scanning**: Integrate barcode scanner hardware
4. **Face ID Integration**: Real biometric authentication
5. **Email Notifications**: Send alerts and reports
6. **Mobile App**: React Native mobile application
7. **Advanced Analytics**: Detailed pharmacy metrics and reports
8. **Medication Interactions**: Drug-drug interaction checking
9. **Insurance Integration**: Insurance verification system
10. **Multi-language Support**: Internationalization

## Development Guidelines

1. Keep components small and reusable
2. Use TypeScript for type safety
3. Follow shadcn/ui component patterns
4. Maintain consistent styling with design tokens
5. Add proper error handling and user feedback
6. Document complex logic and calculations
7. Test authentication flows thoroughly
8. Validate user inputs
9. Log important system events
10. Review audit logs regularly

## Deployment

The system is ready to be deployed to Vercel. No additional configuration needed for the demo environment.

For production deployment:
1. Configure environment variables
2. Set up database (PostgreSQL/SQLite)
3. Enable HTTPS and secure cookies
4. Configure CORS for API calls
5. Set up backup and disaster recovery
6. Enable monitoring and logging
7. Configure email service for notifications
