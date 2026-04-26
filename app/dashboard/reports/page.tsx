'use client'

import { useState } from 'react'
import { patients } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('all')
  const [medicalAidFilter, setMedicalAidFilter] = useState('all')

  const filteredPatients = patients.filter(p => {
    const matchesSearch = `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.cardNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGender = genderFilter === 'all' || p.gender === genderFilter
    const matchesMedicalAid = medicalAidFilter === 'all' || 
                              (medicalAidFilter === 'yes' ? p.medicalAid : !p.medicalAid)
    return matchesSearch && matchesGender && matchesMedicalAid
  })

  const calculateAge = (dob: Date) => {
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const m = today.getMonth() - dob.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Patient Report</h1>
          <p className="text-slate-500 mt-1">Generate and view comprehensive patient data reports</p>
        </div>
        <Button className="bg-[#0d9488] hover:bg-[#0f766e]">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="border-0 shadow-md ring-1 ring-slate-200">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-lg font-bold text-slate-800">Filter</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Search:</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="ID or Name..." 
                  className="pl-10 h-11 border-slate-200 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Gender:</label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="h-11 border-slate-200 rounded-xl">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Medical Aid:</label>
              <Select value={medicalAidFilter} onValueChange={setMedicalAidFilter}>
                <SelectTrigger className="h-11 border-slate-200 rounded-xl">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="h-11 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold">
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md ring-1 ring-slate-200 overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-lg font-bold text-slate-800">Patient Report Data</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                  <th className="px-6 py-4 border-b">Patient ID</th>
                  <th className="px-6 py-4 border-b">Name</th>
                  <th className="px-6 py-4 border-b">Gender</th>
                  <th className="px-6 py-4 border-b">Age</th>
                  <th className="px-6 py-4 border-b">Medical Aid</th>
                  <th className="px-6 py-4 border-b">Date Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-slate-600">{p.cardNumber}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {p.firstName} {p.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">{p.gender}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{calculateAge(p.dateOfBirth)}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={p.medicalAid ? "success" : "secondary"} 
                          className="rounded-lg font-bold"
                        >
                          {p.medicalAid ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                      No patients found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t bg-slate-50/30 flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">1</span> to <span className="font-bold text-slate-800">{filteredPatients.length}</span> of <span className="font-bold text-slate-800">{filteredPatients.length}</span> entries
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg h-9 w-9 p-0" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="default" size="sm" className="rounded-lg h-9 w-9 p-0 bg-blue-600">
                1
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg h-9 w-9 p-0" disabled>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
