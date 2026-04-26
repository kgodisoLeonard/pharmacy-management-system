import type { User, Patient, VitalSigns, Medication, Inventory, Prescription, Transaction, CupboardAccess, AuditLog } from './types'

// In-memory database for demo purposes
// In production, this would be replaced with a real database (Supabase, PostgreSQL, etc.)

// Users with default passwords (in production, these would be hashed)
export const users: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    password: 'admin123',
    fullName: 'System Administrator',
    role: 'admin',
    email: 'admin@pharmacy.local',
    createdAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: 'user-2',
    username: 'dr.smith',
    password: 'doctor123',
    fullName: 'Dr. John Smith',
    role: 'doctor',
    email: 'dr.smith@hospital.local',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: 'user-3',
    username: 'pharmacist1',
    password: 'pharma123',
    fullName: 'Sarah Johnson',
    role: 'pharmacist',
    email: 'sarah.j@pharmacy.local',
    createdAt: new Date('2024-02-01'),
    isActive: true,
  },
  {
    id: 'user-4',
    username: 'assistant1',
    password: 'assist123',
    fullName: 'Mike Wilson',
    role: 'assistant',
    email: 'mike.w@pharmacy.local',
    createdAt: new Date('2024-02-15'),
    isActive: true,
  },
  {
    id: 'user-5',
    username: 'stocktaker',
    password: 'stock123',
    fullName: 'Emily Davis',
    role: 'stock_taker',
    email: 'emily.d@pharmacy.local',
    createdAt: new Date('2024-03-01'),
    isActive: true,
  },
]

export const patients: Patient[] = [
  {
    id: 'patient-1',
    cardNumber: 'P-2024-001',
    firstName: 'James',
    lastName: 'Anderson',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'male',
    phoneNumber: '+1-555-0101',
    email: 'james.a@email.com',
    address: '123 Main St, Springfield, IL 62701',
    emergencyContact: 'Mary Anderson',
    emergencyPhone: '+1-555-0102',
    bloodType: 'O+',
    allergies: ['Penicillin'],
    admissionDate: new Date('2024-11-01'),
    medicalAid: true,
    status: 'admitted',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
  {
    id: 'patient-2',
    cardNumber: 'P-2024-002',
    firstName: 'Linda',
    lastName: 'Martinez',
    dateOfBirth: new Date('1972-07-22'),
    gender: 'female',
    phoneNumber: '+1-555-0201',
    email: 'linda.m@email.com',
    address: '456 Oak Ave, Springfield, IL 62702',
    emergencyContact: 'Carlos Martinez',
    emergencyPhone: '+1-555-0202',
    bloodType: 'A+',
    allergies: [],
    admissionDate: new Date('2024-11-05'),
    medicalAid: false,
    status: 'admitted',
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-05'),
  },
  {
    id: 'patient-3',
    cardNumber: 'P-2024-003',
    firstName: 'Robert',
    lastName: 'Thompson',
    dateOfBirth: new Date('1990-11-08'),
    gender: 'male',
    phoneNumber: '+1-555-0301',
    address: '789 Pine Rd, Springfield, IL 62703',
    emergencyContact: 'Susan Thompson',
    emergencyPhone: '+1-555-0302',
    bloodType: 'B-',
    allergies: ['Sulfa', 'Aspirin'],
    admissionDate: new Date('2024-10-20'),
    dischargeDate: new Date('2024-10-25'),
    medicalAid: true,
    status: 'discharged',
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-25'),
  },
]

export const vitalSigns: VitalSigns[] = [
  {
    id: 'vital-1',
    patientId: 'patient-1',
    weight: 82.5,
    height: 178,
    temperature: 37.2,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    heartRate: 72,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    recordedAt: new Date('2024-11-01T09:00:00'),
    recordedBy: 'user-3',
  },
  {
    id: 'vital-2',
    patientId: 'patient-2',
    weight: 65.0,
    height: 162,
    temperature: 38.1,
    bloodPressureSystolic: 135,
    bloodPressureDiastolic: 88,
    heartRate: 85,
    respiratoryRate: 18,
    oxygenSaturation: 96,
    recordedAt: new Date('2024-11-05T10:30:00'),
    recordedBy: 'user-3',
  },
]

export const medications: Medication[] = [
  {
    id: 'med-1',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin',
    dosageForm: 'Capsule',
    strength: '500mg',
    manufacturer: 'PharmaCorp Inc.',
    barcode: '4901234567001',
    category: 'Antibiotics',
    requiresPrescription: true,
    controlledSubstance: false,
    storageConditions: 'Store below 25°C in a dry place',
    unitPrice: 0.50,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'med-2',
    name: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    dosageForm: 'Tablet',
    strength: '400mg',
    manufacturer: 'MedSupply Ltd.',
    barcode: '4901234567002',
    category: 'Pain Relief',
    requiresPrescription: false,
    controlledSubstance: false,
    storageConditions: 'Store below 30°C',
    unitPrice: 0.25,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'med-3',
    name: 'Metformin 850mg',
    genericName: 'Metformin',
    dosageForm: 'Tablet',
    strength: '850mg',
    manufacturer: 'DiabeteCare Pharma',
    barcode: '4901234567003',
    category: 'Diabetes',
    requiresPrescription: true,
    controlledSubstance: false,
    storageConditions: 'Store below 25°C',
    unitPrice: 0.35,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'med-4',
    name: 'Morphine Sulfate 10mg',
    genericName: 'Morphine',
    dosageForm: 'Injection',
    strength: '10mg/ml',
    manufacturer: 'SecureMed Labs',
    barcode: '4901234567004',
    category: 'Pain Relief',
    requiresPrescription: true,
    controlledSubstance: true,
    storageConditions: 'Store in locked cabinet, 15-25°C',
    unitPrice: 15.00,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'med-5',
    name: 'Omeprazole 20mg',
    genericName: 'Omeprazole',
    dosageForm: 'Capsule',
    strength: '20mg',
    manufacturer: 'GastroHealth Inc.',
    barcode: '4901234567005',
    category: 'Gastrointestinal',
    requiresPrescription: true,
    controlledSubstance: false,
    storageConditions: 'Store below 25°C in a dry place',
    unitPrice: 0.45,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'med-6',
    name: 'Lisinopril 10mg',
    genericName: 'Lisinopril',
    dosageForm: 'Tablet',
    strength: '10mg',
    manufacturer: 'CardioMed Pharma',
    barcode: '4901234567006',
    category: 'Cardiovascular',
    requiresPrescription: true,
    controlledSubstance: false,
    storageConditions: 'Store below 30°C',
    unitPrice: 0.40,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

export const inventory: Inventory[] = [
  {
    id: 'inv-1',
    medicationId: 'med-1',
    batchNumber: 'BATCH-2024-001',
    quantity: 500,
    expiryDate: new Date('2026-06-30'),
    reorderLevel: 100,
    location: 'Cupboard A-1',
    lastRestocked: new Date('2024-10-15'),
    lastChecked: new Date('2024-11-01'),
    checkedBy: 'user-5',
  },
  {
    id: 'inv-2',
    medicationId: 'med-2',
    batchNumber: 'BATCH-2024-002',
    quantity: 1000,
    expiryDate: new Date('2027-03-15'),
    reorderLevel: 200,
    location: 'Cupboard A-2',
    lastRestocked: new Date('2024-10-20'),
    lastChecked: new Date('2024-11-01'),
    checkedBy: 'user-5',
  },
  {
    id: 'inv-3',
    medicationId: 'med-3',
    batchNumber: 'BATCH-2024-003',
    quantity: 300,
    expiryDate: new Date('2025-12-31'),
    reorderLevel: 50,
    location: 'Cupboard B-1',
    lastRestocked: new Date('2024-09-01'),
    lastChecked: new Date('2024-11-01'),
    checkedBy: 'user-5',
  },
  {
    id: 'inv-4',
    medicationId: 'med-4',
    batchNumber: 'BATCH-2024-004',
    quantity: 25,
    expiryDate: new Date('2025-08-30'),
    reorderLevel: 10,
    location: 'Controlled Cabinet C-1',
    lastRestocked: new Date('2024-11-01'),
    lastChecked: new Date('2024-11-01'),
    checkedBy: 'user-5',
  },
  {
    id: 'inv-5',
    medicationId: 'med-5',
    batchNumber: 'BATCH-2024-005',
    quantity: 75,
    expiryDate: new Date('2025-04-15'),
    reorderLevel: 100,
    location: 'Cupboard B-2',
    lastRestocked: new Date('2024-08-15'),
    lastChecked: new Date('2024-11-01'),
    checkedBy: 'user-5',
  },
  {
    id: 'inv-6',
    medicationId: 'med-6',
    batchNumber: 'BATCH-2024-006',
    quantity: 400,
    expiryDate: new Date('2026-09-30'),
    reorderLevel: 80,
    location: 'Cupboard A-3',
    lastRestocked: new Date('2024-10-25'),
    lastChecked: new Date('2024-11-01'),
    checkedBy: 'user-5',
  },
]

export const prescriptions: Prescription[] = [
  {
    id: 'rx-1',
    patientId: 'patient-1',
    doctorId: 'user-2',
    diagnosis: 'Bacterial Infection - Upper Respiratory',
    notes: 'Patient presenting with fever and productive cough. Start antibiotic course.',
    items: [
      {
        id: 'rx-item-1',
        prescriptionId: 'rx-1',
        medicationId: 'med-1',
        medicationName: 'Amoxicillin 500mg',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '7 days',
        quantity: 21,
        dispensedQuantity: 0,
        instructions: 'Take with food. Complete the full course.',
        status: 'pending',
      },
      {
        id: 'rx-item-2',
        prescriptionId: 'rx-1',
        medicationId: 'med-2',
        medicationName: 'Ibuprofen 400mg',
        dosage: '400mg',
        frequency: 'As needed for fever',
        duration: '7 days',
        quantity: 14,
        dispensedQuantity: 0,
        instructions: 'Take with food. Maximum 3 doses per day.',
        status: 'pending',
      },
    ],
    status: 'pending',
    createdAt: new Date('2024-11-01T10:00:00'),
    updatedAt: new Date('2024-11-01T10:00:00'),
  },
  {
    id: 'rx-2',
    patientId: 'patient-2',
    doctorId: 'user-2',
    diagnosis: 'Hypertension - Essential',
    notes: 'Blood pressure elevated. Starting medication therapy.',
    items: [
      {
        id: 'rx-item-3',
        prescriptionId: 'rx-2',
        medicationId: 'med-6',
        medicationName: 'Lisinopril 10mg',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30,
        dispensedQuantity: 0,
        instructions: 'Take in the morning. Monitor blood pressure daily.',
        status: 'pending',
      },
    ],
    status: 'pending',
    createdAt: new Date('2024-11-05T11:00:00'),
    updatedAt: new Date('2024-11-05T11:00:00'),
  },
]

export const transactions: Transaction[] = []

export const cupboardAccess: CupboardAccess[] = []

export const auditLogs: AuditLog[] = []

// Helper functions to simulate database operations
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function addAuditLog(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  details: string
): void {
  const log: AuditLog = {
    id: generateId('audit'),
    userId,
    action,
    entityType,
    entityId,
    details,
    createdAt: new Date(),
  }
  auditLogs.push(log)
}

// Database object for backward compatibility and helper methods
export const database = {
  getUsers: () => users,
  getPatients: () => patients,
  getMedications: () => medications,
  getInventory: () => inventory,
  getPrescriptions: () => prescriptions,
  getTransactions: () => transactions,
  getCupboardAccess: () => cupboardAccess,
  getAuditLogs: () => auditLogs,
  
  addUser: (fullName: string, email: string, password: string, role: User['role']) => {
    const newUser: User = {
      id: generateId('user'),
      username: email.split('@')[0],
      fullName,
      email,
      password,
      role,
      isActive: true,
      createdAt: new Date()
    }
    users.push(newUser)
    return newUser
  },
  
  deleteUser: (id: string) => {
    const index = users.findIndex(u => u.id === id)
    if (index !== -1) users.splice(index, 1)
  },
  
  updateUserRole: (id: string, role: User['role']) => {
    const user = users.find(u => u.id === id)
    if (user) user.role = role
  }
}
