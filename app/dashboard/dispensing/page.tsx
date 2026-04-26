'use client'

import { useState } from 'react'
import { patients } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Syringe, DollarSign, User, CreditCard, Banknote, ShieldCheck } from 'lucide-react'

export default function DispensingPage() {
  const [selectedPatient, setSelectedPatient] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [amount, setAmount] = useState('')
  const [details, setDetails] = useState('')

  const handleProcess = () => {
    if (!selectedPatient || !amount) {
      toast.error('Please select a patient and enter an amount')
      return
    }
    toast.success('Transaction processed successfully')
    // Reset form
    setSelectedPatient('')
    setAmount('')
    setDetails('')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <Card className="w-full max-w-2xl border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden bg-white rounded-3xl">
        <CardHeader className="bg-[#1e293b] text-white p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg ring-4 ring-blue-500/20">
            <Syringe className="w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">Dispensing & Transactions</CardTitle>
          <p className="text-slate-400 mt-2 font-medium">Complete medication dispensing and process payments</p>
        </CardHeader>
        
        <CardContent className="p-10 space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Patient Name:
            </label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="h-14 border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-4 focus:ring-blue-500/10 text-lg transition-all">
                <SelectValue placeholder="Select patient..." />
              </SelectTrigger>
              <SelectContent>
                {patients.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              Payment Method:
            </label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className={`flex items-center space-x-3 border-2 p-4 rounded-2xl transition-all cursor-pointer ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-500/10' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}>
                <RadioGroupItem value="cash" id="cash" className="text-blue-600" />
                <Label htmlFor="cash" className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <Banknote className="w-4 h-4" /> Cash
                </Label>
              </div>
              <div className={`flex items-center space-x-3 border-2 p-4 rounded-2xl transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-500/10' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}>
                <RadioGroupItem value="card" id="card" className="text-blue-600" />
                <Label htmlFor="card" className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <CreditCard className="w-4 h-4" /> Credit Card
                </Label>
              </div>
              <div className={`flex items-center space-x-3 border-2 p-4 rounded-2xl transition-all cursor-pointer ${paymentMethod === 'medical' ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-500/10' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}>
                <RadioGroupItem value="medical" id="medical" className="text-blue-600" />
                <Label htmlFor="medical" className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <ShieldCheck className="w-4 h-4" /> Medical Aid
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Amount (R):
            </label>
            <Input 
              type="number"
              placeholder="0.00" 
              className="h-14 border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-4 focus:ring-blue-500/10 text-xl font-bold text-slate-800"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">Transaction Details:</label>
            <Textarea 
              placeholder="Enter any additional transaction notes..."
              className="min-h-[120px] border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-4 focus:ring-blue-500/10 p-4"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <Button 
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black py-8 rounded-2xl shadow-xl shadow-blue-500/20 text-xl transition-all hover:-translate-y-1 active:translate-y-0"
            onClick={handleProcess}
          >
            Process Transaction
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
