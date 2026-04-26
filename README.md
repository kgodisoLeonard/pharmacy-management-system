# PharmaCare - Hospital Pharmacy Management System

A comprehensive web-based pharmacy management system designed for hospital environments with role-based access control, medication tracking, prescription management, and complete audit logging.

## Features

### Core System Capabilities

- **Role-Based Access Control** - 5 distinct user roles with granular permissions
  - Administrator - Full system access and user management
  - Doctor - Create prescriptions and view patient records
  - Pharmacist - Dispense medications and manage inventory
  - Pharmacy Assistant - Support dispensing and inventory tasks
  - Stock Taker - Manage medication inventory and levels

- **Patient Management**
  - Comprehensive patient records with medical history
  - Patient admission tracking
  - Contact and emergency information storage
  - Search and filter functionality

- **Prescription Management**
  - Create, view, and track prescriptions from doctors
  - Prescription status workflow (pending, completed, cancelled)
  - Medication item tracking with quantity and dosage
  - Integration with patient records

- **Medication Dispensing**
  - Process prescriptions for medication dispensing
  - Barcode scanning simulation for medication verification
  - Dosage validation
  - Dispensing record generation
  - Receipt printing capability

- **Medication Cupboard Access**
  - Face ID and password-based authentication
  - Two-factor security for sensitive medication access
  - Real-time access logging
  - Audit trail of all cupboard access

- **Inventory Management**
  - Real-time stock level tracking
  - Low stock alerts and reorder notifications
  - Expiry date monitoring
  - Medication batch tracking
  - Stock history and movement logs

- **Audit & Compliance**
  - Complete transaction logging
  - User activity tracking
  - System event recording
  - CSV export for compliance reports
  - Filterable audit trails

- **Admin Panel**
  - User account management (create, edit, delete)
  - Role assignment and permission management
  - System statistics and overview
  - User status management

## Tech Stack

- **Frontend Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: In-memory simulation (ready for PostgreSQL/SQLite migration)
- **State Management**: React Context API
- **Routing**: Next.js App Router
- **Icons**: Lucide React
- **Notifications**: Sonner Toast

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd v0-project

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

## Default Credentials

Demo accounts for testing:

```
Admin:
- Email: admin@pharmacy.local
- Password: admin123

Doctor:
- Email: doctor@pharmacy.local
- Password: doctor123

Pharmacist:
- Email: pharmacist@pharmacy.local
- Password: pharmacist123
