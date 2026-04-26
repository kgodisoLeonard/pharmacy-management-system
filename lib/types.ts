// User roles
export type UserRole = 'admin' | 'doctor' | 'pharmacist' | 'assistant' | 'stock_taker' | 'nurse'

export interface User {
  id: string
  username: string
  password: string
  fullName: string
  role: UserRole
  email: string
  createdAt: Date
  lastLogin?: Date
  isActive: boolean
}

export interface Patient {
  id: string
  cardNumber: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  gender: 'male' | 'female' | 'other'
  phoneNumber: string
  email?: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  bloodType?: string
  allergies: string[]
  admissionDate: Date
  dischargeDate?: Date
  medicalAid: boolean
  status: 'admitted' | 'discharged' | 'outpatient'
  createdAt: Date
  updatedAt: Date
}

export interface VitalSigns {
  id: string
  patientId: string
  weight: number // in kg
  height: number // in cm
  temperature: number // in celsius
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  heartRate: number
  respiratoryRate: number
  oxygenSaturation: number
  recordedAt: Date
  recordedBy: string // user id
}

export interface Medication {
  id: string
  name: string
  genericName: string
  dosageForm: string // tablet, capsule, syrup, injection, etc.
  strength: string
  manufacturer: string
  barcode: string
  category: string
  requiresPrescription: boolean
  controlledSubstance: boolean
  storageConditions: string
  unitPrice: number
  createdAt: Date
  updatedAt: Date
}

export interface Inventory {
  id: string
  medicationId: string
  batchNumber: string
  quantity: number
  expiryDate: Date
  reorderLevel: number
  location: string // cupboard location
  lastRestocked: Date
  lastChecked: Date
  checkedBy: string // user id
}

export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  diagnosis: string
  notes: string
  items: PrescriptionItem[]
  status: 'pending' | 'partially_dispensed' | 'dispensed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface PrescriptionItem {
  id: string
  prescriptionId: string
  medicationId: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  quantity: number
  dispensedQuantity: number
  instructions: string
  status: 'pending' | 'dispensed' | 'partially_dispensed'
}

export interface Transaction {
  id: string
  type: 'dispense' | 'restock' | 'adjustment' | 'return'
  patientId?: string
  prescriptionId?: string
  userId: string
  items: TransactionItem[]
  totalAmount: number
  receiptNumber: string
  notes: string
  createdAt: Date
}

export interface TransactionItem {
  id: string
  transactionId: string
  medicationId: string
  medicationName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  batchNumber: string
}

export interface CupboardAccess {
  id: string
  userId: string
  accessTime: Date
  exitTime?: Date
  authMethod: 'face_id' | 'password' | 'face_id_fallback'
  success: boolean
  reason?: string
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  entityType: string
  entityId: string
  details: string
  ipAddress?: string
  createdAt: Date
}

// Session types
export interface Session {
  userId: string
  user: Omit<User, 'password'>
  expiresAt: Date
}

// Form types for creating/updating
export type CreatePatientInput = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>
export type CreatePrescriptionInput = Omit<Prescription, 'id' | 'createdAt' | 'updatedAt' | 'status'>
export type CreateMedicationInput = Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>
