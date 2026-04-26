'use client'

import { useState, useEffect } from 'react'
import { patients, prescriptions, medications, generateId, addAuditLog } from '@/lib/db'
import type { Patient, Prescription, PrescriptionItem, Medication } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { 
  Search, 
  User, 
  ClipboardList, 
  Barcode, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  Banknote,
  ShieldCheck,
  ArrowRight,
  Pill
} from 'lucide-react'

export default function DispensingPage() {
  const [cardNumber, setCardNumber] = useState('')
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null)
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescription[]>([])
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedMedId, setScannedMedId] = useState<string | null>(null)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)

  const handleSearchPatient = () => {
    const patient = patients.find(p => p.cardNumber.toLowerCase() === cardNumber.toLowerCase())
    if (patient) {
      setFoundPatient(patient)
      const pxs = prescriptions.filter(p => p.patientId === patient.id)
      setPatientPrescriptions(pxs)
      if (pxs.length === 0) {
        toast.info('No active prescriptions found for this patient')
      }
    } else {
      toast.error('Patient not found with that card number')
      setFoundPatient(null)
      setPatientPrescriptions([])
    }
  }

  const handleScanBarcode = async (medicationId: string) => {
    setIsScanning(true)
    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setScannedMedId(medicationId)
    setIsScanning(false)
    toast.success('Medication barcode verified')
  }

  const handleDispense = (prescription: Prescription) => {
    const total = prescription.items.reduce((acc, item) => {
      const med = medications.find(m => m.id === item.medicationId)
      return acc + (med?.unitPrice || 0) * item.quantity
    }, 0)

    const receipt = {
      id: generateId('rcpt'),
      date: new Date(),
      patientName: `${foundPatient?.firstName} ${foundPatient?.lastName}`,
      cardNumber: foundPatient?.cardNumber,
      items: prescription.items.map(item => ({
        name: item.medicationName,
        quantity: item.quantity,
        price: medications.find(m => m.id === item.medicationId)?.unitPrice || 0
      })),
      total: total
    }

    setReceiptData(receipt)
    setIsReceiptOpen(true)
    
    addAuditLog('current-user', 'DISPENSE_MEDICATION', 'prescription', prescription.id, `Dispensed prescription ${prescription.id} to ${receipt.patientName}`)
    toast.success('Medication dispensed and recorded')
  }

  const handlePrint = () => {
    window.print()
    setIsReceiptOpen(false)
    // Reset flow
    setFoundPatient(null)
    setSelectedPrescription(null)
    setCardNumber('')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2 text-slate-900">
          <Pill className="h-8 w-8 text-blue-600" />
          Medication Dispensing
        </h1>
        <p className="text-slate-500 font-medium">Verify prescriptions and dispense medication to patients</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Step 1: Patient Search */}
        <Card className="md:col-span-4 shadow-xl border-slate-200 overflow-hidden rounded-3xl">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              1. Identify Patient
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Card Number</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. P-2024-001" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-mono focus:ring-blue-500/10 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchPatient()}
                />
                <Button onClick={handleSearchPatient} className="h-12 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {foundPatient && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {foundPatient.firstName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-none">{foundPatient.firstName} {foundPatient.lastName}</p>
                    <p className="text-xs text-blue-600 font-bold mt-1 font-mono">{foundPatient.cardNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold text-slate-400">
                  <div>DOB: <span className="text-slate-700">{new Date(foundPatient.dateOfBirth).toLocaleDateString()}</span></div>
                  <div>Gender: <span className="text-slate-700 capitalize">{foundPatient.gender}</span></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Prescriptions */}
        <div className="md:col-span-8 space-y-6">
          {!foundPatient ? (
            <Card className="h-full min-h-[300px] flex flex-col items-center justify-center border-dashed border-2 border-slate-200 bg-slate-50/30 rounded-3xl">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <p className="font-bold text-slate-400">Identify a patient to view prescriptions</p>
                  <p className="text-xs text-slate-300">Enter a card number in the search box</p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                2. Active Prescriptions
              </h2>
              
              {patientPrescriptions.length === 0 ? (
                <div className="p-12 text-center bg-white border border-slate-100 rounded-3xl shadow-sm">
                  <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="font-bold text-slate-400">No pending prescriptions found</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {patientPrescriptions.map(px => (
                    <Card key={px.id} className={`overflow-hidden rounded-3xl border-2 transition-all cursor-pointer ${selectedPrescription?.id === px.id ? 'border-blue-500 shadow-blue-100 shadow-xl' : 'border-slate-100 hover:border-slate-200 shadow-md'}`} onClick={() => setSelectedPrescription(px)}>
                      <CardContent className="p-0">
                        <div className="p-6 flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-bold">PX-{px.id.split('-')[1]}</Badge>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{new Date(px.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-black text-xl text-slate-900">{px.diagnosis}</h3>
                            <p className="text-sm text-slate-500 line-clamp-1">{px.notes}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-xs font-bold text-blue-600 uppercase mb-2">
                              <ArrowRight className="w-3 h-3" /> Select
                            </div>
                            <p className="text-2xl font-black text-slate-900">{px.items.length} <span className="text-xs font-bold text-slate-400 uppercase">Items</span></p>
                          </div>
                        </div>

                        {selectedPrescription?.id === px.id && (
                          <div className="bg-slate-50 p-6 border-t border-blue-100 animate-in fade-in slide-in-from-top-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Medication Verification</h4>
                            <div className="space-y-3">
                              {px.items.map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                                  <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${scannedMedId === item.medicationId ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                      <Barcode className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-900">{item.medicationName}</p>
                                      <p className="text-xs text-slate-500">{item.dosage} • {item.frequency} • {item.quantity} units</p>
                                    </div>
                                  </div>
                                  <div>
                                    {scannedMedId === item.medicationId ? (
                                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-black border-green-200">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                                      </Badge>
                                    ) : (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-xl font-bold border-slate-200 hover:border-blue-500 hover:text-blue-600 h-9"
                                        onClick={(e) => { e.stopPropagation(); handleScanBarcode(item.medicationId); }}
                                        disabled={isScanning}
                                      >
                                        {isScanning ? 'Scanning...' : 'Scan Barcode'}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <Button 
                              className="w-full mt-6 h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
                              disabled={scannedMedId !== px.items[0].medicationId}
                              onClick={() => handleDispense(px)}
                            >
                              <ShieldCheck className="w-5 h-5 mr-2" /> Complete Dispensing
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-3xl shadow-2xl">
          <div className="bg-blue-600 p-8 text-center text-white">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <DialogTitle className="text-2xl font-black">Transaction Complete</DialogTitle>
            <p className="text-blue-100 mt-1">Receipt generated successfully</p>
          </div>
          
          <div className="p-8 bg-white space-y-6">
            <div className="space-y-4 border-2 border-slate-50 rounded-2xl p-6 bg-slate-50/50">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Patient</p>
                  <p className="font-bold text-slate-900">{receiptData?.patientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Receipt #</p>
                  <p className="font-mono text-sm font-bold text-slate-900">{receiptData?.id.split('-')[1]}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {receiptData?.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">{item.name} x{item.quantity}</span>
                    <span className="font-mono font-bold text-slate-900">R{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t-2 border-dashed border-slate-200 pt-4 mt-2">
                <p className="font-black text-slate-900 uppercase text-xs">Total Amount</p>
                <p className="text-2xl font-black text-blue-600 font-mono">R{receiptData?.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 rounded-xl font-bold border-slate-200" onClick={() => setIsReceiptOpen(false)}>
                Close
              </Button>
              <Button className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-black shadow-lg shadow-blue-200" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" /> Print Receipt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
