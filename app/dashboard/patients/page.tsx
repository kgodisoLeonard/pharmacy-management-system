'use client'

import { useState } from 'react'
import { patients, vitalSigns, generateId, addAuditLog } from '@/lib/db'
import type { Patient, VitalSigns } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import {
  Plus,
  Search,
  Users,
  Activity,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Thermometer,
  Scale,
  Droplets,
  User,
  AlertCircle,
  FileText,
  X,
} from 'lucide-react'

export default function PatientsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isVitalsDialogOpen, setIsVitalsDialogOpen] = useState(false)
  const [patientList, setPatientList] = useState<Patient[]>(patients)

  // Filter patients
  const filteredPatients = patientList.filter(patient => {
    const matchesSearch = 
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.cardNumber.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleAddPatient = (newPatient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const patient: Patient = {
      ...newPatient,
      id: generateId('patient'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    patients.push(patient)
    setPatientList([...patients])
    addAuditLog(user?.id || '', 'CREATE_PATIENT', 'patient', patient.id, `Created patient: ${patient.firstName} ${patient.lastName}`)
    toast.success('Patient admitted successfully')
    setIsAddDialogOpen(false)
  }

  const getPatientVitals = (patientId: string) => {
    return vitalSigns
      .filter(v => v.patientId === patientId)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Patient Management
          </h1>
          <p className="text-muted-foreground">
            Manage patient records, admissions, and vital signs
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Admit Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Admit New Patient</DialogTitle>
              <DialogDescription>
                Enter patient information to create a new admission record
              </DialogDescription>
            </DialogHeader>
            <AddPatientForm onSubmit={handleAddPatient} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patientList.length}</p>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patientList.filter(p => p.status === 'admitted').length}</p>
                <p className="text-sm text-muted-foreground">Admitted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patientList.filter(p => p.status === 'outpatient').length}</p>
                <p className="text-sm text-muted-foreground">Outpatient</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patientList.filter(p => p.status === 'discharged').length}</p>
                <p className="text-sm text-muted-foreground">Discharged</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or card number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="admitted">Admitted</SelectItem>
            <SelectItem value="outpatient">Outpatient</SelectItem>
            <SelectItem value="discharged">Discharged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Card Number</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-mono text-sm">{patient.cardNumber}</TableCell>
                    <TableCell className="font-medium">{patient.firstName} {patient.lastName}</TableCell>
                    <TableCell>{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
                    <TableCell className="capitalize">{patient.gender}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          patient.status === 'admitted' ? 'default' :
                          patient.status === 'outpatient' ? 'secondary' : 'outline'
                        }
                        className={
                          patient.status === 'admitted' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          patient.status === 'outpatient' ? 'bg-blue-100 text-blue-800' : ''
                        }
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(patient.admissionDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedPatient(patient)
                            setIsDetailsOpen(true)
                          }}
                        >
                          View
                        </Button>
                        {(user?.role === 'admin' || user?.role === 'doctor' || user?.role === 'nurse') && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedPatient(patient)
                              setIsVitalsDialogOpen(true)
                            }}
                          >
                            Vitals
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <PatientDetails patient={selectedPatient} vitals={getPatientVitals(selectedPatient.id)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Vitals Recording Dialog */}
      <Dialog open={isVitalsDialogOpen} onOpenChange={setIsVitalsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Vital Signs</DialogTitle>
            <DialogDescription>
              {selectedPatient && `Recording vitals for ${selectedPatient.firstName} ${selectedPatient.lastName}`}
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <RecordVitalsForm 
              patient={selectedPatient} 
              userId={user?.id || ''} 
              onSuccess={() => {
                setIsVitalsDialogOpen(false)
                toast.success('Vital signs recorded successfully')
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Add Patient Form Component
function AddPatientForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: `P-${new Date().getFullYear()}-${String(patients.length + 1).padStart(3, '0')}`,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
    allergies: '',
    status: 'admitted' as 'admitted' | 'outpatient' | 'discharged',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth),
      allergies: formData.allergies.split(',').map(a => a.trim()).filter(Boolean),
      admissionDate: new Date(),
    }

    setTimeout(() => {
      onSubmit(patient)
      setIsSubmitting(false)
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Card Number</FieldLabel>
            <Input value={formData.cardNumber} disabled className="bg-muted" />
          </Field>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select value={formData.status} onValueChange={(v: 'admitted' | 'outpatient' | 'discharged') => setFormData({ ...formData, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admitted">Admitted</SelectItem>
                <SelectItem value="outpatient">Outpatient</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>First Name</FieldLabel>
            <Input 
              value={formData.firstName} 
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required 
            />
          </Field>
          <Field>
            <FieldLabel>Last Name</FieldLabel>
            <Input 
              value={formData.lastName} 
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required 
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Date of Birth</FieldLabel>
            <Input 
              type="date" 
              value={formData.dateOfBirth} 
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              required 
            />
          </Field>
          <Field>
            <FieldLabel>Gender</FieldLabel>
            <Select value={formData.gender} onValueChange={(v: 'male' | 'female' | 'other') => setFormData({ ...formData, gender: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Phone Number</FieldLabel>
            <Input 
              type="tel" 
              value={formData.phoneNumber} 
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required 
            />
          </Field>
          <Field>
            <FieldLabel>Email (Optional)</FieldLabel>
            <Input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>Address</FieldLabel>
          <Textarea 
            value={formData.address} 
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required 
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Emergency Contact Name</FieldLabel>
            <Input 
              value={formData.emergencyContact} 
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              required 
            />
          </Field>
          <Field>
            <FieldLabel>Emergency Contact Phone</FieldLabel>
            <Input 
              type="tel" 
              value={formData.emergencyPhone} 
              onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
              required 
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Blood Type (Optional)</FieldLabel>
            <Select value={formData.bloodType} onValueChange={(v) => setFormData({ ...formData, bloodType: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Allergies (comma-separated)</FieldLabel>
            <Input 
              placeholder="e.g., Penicillin, Sulfa"
              value={formData.allergies} 
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            />
          </Field>
        </div>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><Spinner className="w-4 h-4 mr-2" /> Admitting...</> : 'Admit Patient'}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Patient Details Component
function PatientDetails({ patient, vitals }: { patient: Patient; vitals: VitalSigns[] }) {
  const latestVitals = vitals[0]

  return (
    <Tabs defaultValue="info">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info">Patient Info</TabsTrigger>
        <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="space-y-4 mt-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{patient.firstName} {patient.lastName}</h3>
            <p className="text-sm text-muted-foreground font-mono">{patient.cardNumber}</p>
          </div>
          <Badge className="ml-auto" variant={patient.status === 'admitted' ? 'default' : 'secondary'}>
            {patient.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoItem icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={new Date(patient.dateOfBirth).toLocaleDateString()} />
          <InfoItem icon={<User className="w-4 h-4" />} label="Gender" value={patient.gender} />
          <InfoItem icon={<Phone className="w-4 h-4" />} label="Phone" value={patient.phoneNumber} />
          <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={patient.email || 'N/A'} />
          <InfoItem icon={<Droplets className="w-4 h-4" />} label="Blood Type" value={patient.bloodType || 'Unknown'} />
          <InfoItem icon={<Calendar className="w-4 h-4" />} label="Admitted" value={new Date(patient.admissionDate).toLocaleDateString()} />
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">{patient.address}</p>
            </div>
          </div>
        </div>

        {patient.allergies.length > 0 && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 text-destructive" />
              <div>
                <p className="text-sm font-medium text-destructive">Allergies</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {patient.allergies.map((allergy, i) => (
                    <Badge key={i} variant="outline" className="text-destructive border-destructive/50">{allergy}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-sm font-medium mb-2">Emergency Contact</p>
          <p className="text-sm">{patient.emergencyContact}</p>
          <p className="text-sm text-muted-foreground">{patient.emergencyPhone}</p>
        </div>
      </TabsContent>

      <TabsContent value="vitals" className="mt-4">
        {latestVitals ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Last recorded: {new Date(latestVitals.recordedAt).toLocaleString()}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <VitalCard icon={<Scale className="w-4 h-4" />} label="Weight" value={`${latestVitals.weight} kg`} />
              <VitalCard icon={<Thermometer className="w-4 h-4" />} label="Temperature" value={`${latestVitals.temperature}°C`} />
              <VitalCard icon={<Heart className="w-4 h-4" />} label="Blood Pressure" value={`${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic}`} />
              <VitalCard icon={<Activity className="w-4 h-4" />} label="Heart Rate" value={`${latestVitals.heartRate} bpm`} />
              <VitalCard icon={<Activity className="w-4 h-4" />} label="Respiratory Rate" value={`${latestVitals.respiratoryRate}/min`} />
              <VitalCard icon={<Droplets className="w-4 h-4" />} label="O2 Saturation" value={`${latestVitals.oxygenSaturation}%`} />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No vital signs recorded</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium capitalize">{value}</p>
      </div>
    </div>
  )
}

function VitalCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  )
}

// Record Vitals Form
function RecordVitalsForm({ 
  patient, 
  userId,
  onSuccess 
}: { 
  patient: Patient
  userId: string
  onSuccess: () => void 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    temperature: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const vitals: VitalSigns = {
      id: generateId('vital'),
      patientId: patient.id,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      temperature: parseFloat(formData.temperature),
      bloodPressureSystolic: parseInt(formData.bloodPressureSystolic),
      bloodPressureDiastolic: parseInt(formData.bloodPressureDiastolic),
      heartRate: parseInt(formData.heartRate),
      respiratoryRate: parseInt(formData.respiratoryRate),
      oxygenSaturation: parseInt(formData.oxygenSaturation),
      recordedAt: new Date(),
      recordedBy: userId,
    }

    setTimeout(() => {
      vitalSigns.push(vitals)
      addAuditLog(userId, 'RECORD_VITALS', 'vital_signs', vitals.id, `Recorded vitals for patient ${patient.cardNumber}`)
      setIsSubmitting(false)
      onSuccess()
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Weight (kg)</FieldLabel>
            <Input 
              type="number" 
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              required
            />
          </Field>
          <Field>
            <FieldLabel>Height (cm)</FieldLabel>
            <Input 
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              required
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>Temperature (°C)</FieldLabel>
          <Input 
            type="number" 
            step="0.1"
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Blood Pressure (Systolic)</FieldLabel>
            <Input 
              type="number"
              value={formData.bloodPressureSystolic}
              onChange={(e) => setFormData({ ...formData, bloodPressureSystolic: e.target.value })}
              required
            />
          </Field>
          <Field>
            <FieldLabel>Blood Pressure (Diastolic)</FieldLabel>
            <Input 
              type="number"
              value={formData.bloodPressureDiastolic}
              onChange={(e) => setFormData({ ...formData, bloodPressureDiastolic: e.target.value })}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Heart Rate (bpm)</FieldLabel>
            <Input 
              type="number"
              value={formData.heartRate}
              onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
              required
            />
          </Field>
          <Field>
            <FieldLabel>Respiratory Rate (/min)</FieldLabel>
            <Input 
              type="number"
              value={formData.respiratoryRate}
              onChange={(e) => setFormData({ ...formData, respiratoryRate: e.target.value })}
              required
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>Oxygen Saturation (%)</FieldLabel>
          <Input 
            type="number"
            min="0"
            max="100"
            value={formData.oxygenSaturation}
            onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
            required
          />
        </Field>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><Spinner className="w-4 h-4 mr-2" /> Recording...</> : 'Record Vitals'}
        </Button>
      </DialogFooter>
    </form>
  )
}
