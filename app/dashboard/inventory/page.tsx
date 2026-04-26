'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { medications, inventory } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Filter } from 'lucide-react'

export default function InventoryPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [supplierFilter, setSupplierFilter] = useState('all')

  const categories = [...new Set(medications.map(m => m.category))]
  const suppliers = [...new Set(medications.map(m => m.manufacturer))]

  const inventoryItems = medications.map(med => {
    const inv = inventory.find(i => i.medicationId === med.id)
    const status = !inv || inv.quantity === 0 ? 'Out of Stock' : 
                   inv.quantity <= inv.reorderLevel ? 'Low Stock' : 'In Stock'
    return {
      medication: med,
      inventory: inv,
      status
    }
  }).filter(item => {
    const matchesSearch = item.medication.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.medication.category === categoryFilter
    const matchesSupplier = supplierFilter === 'all' || item.medication.manufacturer === supplierFilter
    return matchesSearch && matchesCategory && matchesSupplier
  })

  return (
    <div className="space-y-6 pb-10">
      <Card className="border-0 shadow-lg ring-1 ring-slate-200 overflow-hidden bg-white">
        <CardHeader className="bg-[#1e293b] text-white py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Search className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold">Medication Stock Management</CardTitle>
            </div>
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] font-bold py-6 px-8 rounded-xl shadow-lg">
              Add New Medication
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Filter by Category:</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 border-slate-200 rounded-xl">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Filter by Supplier:</label>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger className="h-12 border-slate-200 rounded-xl">
                  <SelectValue placeholder="All Suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {suppliers.map(sup => (
                    <SelectItem key={sup} value={sup}>{sup}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="px-6 py-4 border-b">Image</th>
                  <th className="px-6 py-4 border-b">Medication Name</th>
                  <th className="px-6 py-4 border-b">Category</th>
                  <th className="px-6 py-4 border-b">Supplier</th>
                  <th className="px-6 py-4 border-b text-center">Quantity</th>
                  <th className="px-6 py-4 border-b text-right">Price</th>
                  <th className="px-6 py-4 border-b text-center">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inventoryItems.map((item) => (
                  <tr key={item.medication.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {/* Placeholder for medication image */}
                        <div className="w-8 h-8 rounded-full bg-[#0d9488]/20 flex items-center justify-center">
                          <span className="text-[#0d9488] font-bold text-xs">Med</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{item.medication.name}</div>
                      <div className="text-xs text-slate-500">{item.medication.genericName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.medication.category}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.medication.manufacturer}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800 text-center">
                      {item.inventory?.quantity || 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800 text-right">
                      ${item.medication.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge 
                        className={`rounded-lg px-3 py-1 font-bold ${
                          item.status === 'In Stock' ? 'bg-[#16a34a] hover:bg-[#16a34a]' : 
                          item.status === 'Low Stock' ? 'bg-[#f97316] hover:bg-[#f97316]' : 
                          'bg-[#dc2626] hover:bg-[#dc2626]'
                        } text-white`}
                      >
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
