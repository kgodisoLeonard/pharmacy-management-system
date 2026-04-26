'use client'

import { useState } from 'react'
import { prescriptions, patients, medications } from '@/lib/db'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ClipboardList } from 'lucide-react'

export default function PrescriptionsPage() {
  const { user } = useAuth()
  const [selectedPatient, setSelectedPatient] = useState('')
  const [selectedMedication, setSelectedMedication] = useState('')
  const [status, setStatus] = useState('pending')
  const [notes, setNotes] = useState('')

  const handleSave = () => {
    if (!selectedPatient || !selectedMedication) {
      toast.error('Please select both a patient and a medication')
      return
    }
    toast.success('Prescription saved successfully')
    // Reset form
    setSelectedPatient('')
    setSelectedMedication('')
    setNotes('')
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#1e293b] rounded-lg">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Prescription Management</h1>
      </div>

      <Card className="border-0 shadow-lg ring-1 ring-slate-200 bg-white overflow-hidden">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#1e40af] uppercase tracking-wider">Select Patient:</label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="h-12 border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20">
                  <SelectValue placeholder="Select patient..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#1e40af] uppercase tracking-wider">Select Medication:</label>
              <Select value={selectedMedication} onValueChange={setSelectedMedication}>
                <SelectTrigger className="h-12 border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20">
                  <SelectValue placeholder="Select medication..." />
                </SelectTrigger>
                <SelectContent>
                  {medications.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name} {m.strength}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-[#1e40af] uppercase tracking-wider">Status:</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-12 border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20">
                  <SelectValue placeholder="Pending" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="dispensed">Dispensed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <label className="text-sm font-bold text-[#1e40af] uppercase tracking-wider">Notes:</label>
            <Textarea 
              placeholder="Patient requires medication for 7 days."
              className="min-h-[120px] border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500/20 p-4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button 
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-6 px-10 rounded-xl shadow-lg transition-transform active:scale-95"
            onClick={handleSave}
          >
            Save Prescription
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg ring-1 ring-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                <th className="px-8 py-4 border-b">Prescription ID</th>
                <th className="px-8 py-4 border-b">Patient Name</th>
                <th className="px-8 py-4 border-b">Medication</th>
                <th className="px-8 py-4 border-b text-center">Status</th>
                <th className="px-8 py-4 border-b text-right">Date Prescribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions.map((rx) => {
                const patient = patients.find(p => p.id === rx.patientId)
                const medName = rx.items[0]?.medicationName || 'Unknown'
                return (
                  <tr key={rx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm font-mono text-slate-500">{rx.id.slice(-4)}</td>
                    <td className="px-8 py-5 text-sm font-semibold text-slate-800">
                      {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown'}
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600">{medName}</td>
                    <td className="px-8 py-5 text-center">
                      <Badge className="bg-[#fef3c7] text-[#92400e] hover:bg-[#fef3c7] font-bold px-3 py-1 rounded-lg">
                        {rx.status.charAt(0).toUpperCase() + rx.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-500 text-right">
                      {new Date(rx.createdAt).toISOString().split('T')[0]}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
