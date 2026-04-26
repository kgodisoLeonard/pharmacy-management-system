'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { database } from '@/lib/db'
import { useAuth } from '@/lib/auth-context'
import { format } from 'date-fns'
import { Search, Download, Filter, Clock, User, FileText } from 'lucide-react'

export default function AuditPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [filterUser, setFilterUser] = useState('all')

  const transactions = database.getTransactions()
  const users = database.getUsers()

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = 
        tx.medicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.userId.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesAction = filterAction === 'all' || tx.action === filterAction
      const matchesUser = filterUser === 'all' || tx.userId === filterUser

      return matchesSearch && matchesAction && matchesUser
    })
  }, [searchTerm, filterAction, filterUser])

  const actionTypes = Array.from(new Set(transactions.map(tx => tx.action)))

  const getActionColor = (action: string) => {
    switch (action) {
      case 'DISPENSE': return 'bg-red-100 text-red-800'
      case 'RESTOCK': return 'bg-green-100 text-green-800'
      case 'CUPBOARD_ACCESS': return 'bg-blue-100 text-blue-800'
      case 'UPDATE_STOCK': return 'bg-yellow-100 text-yellow-800'
      case 'LOGIN': return 'bg-purple-100 text-purple-800'
      case 'LOGOUT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Action', 'User', 'Medication', 'Patient', 'Quantity', 'Details'],
      ...filteredTransactions.map(tx => [
        format(tx.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        tx.action,
        users.find(u => u.id === tx.userId)?.name || tx.userId,
        tx.medicationId,
        tx.patientId || '-',
        tx.quantity || '-',
        tx.details || '-'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground mt-2">Complete transaction history and activity tracking</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by medication, patient, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {actionTypes.map(action => (
                <SelectItem key={action} value={action}>{action}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger className="w-40">
              <User className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map(u => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b">
                <tr>
                  <th className="text-left p-3 font-semibold">Timestamp</th>
                  <th className="text-left p-3 font-semibold">Action</th>
                  <th className="text-left p-3 font-semibold">User</th>
                  <th className="text-left p-3 font-semibold">Medication</th>
                  <th className="text-left p-3 font-semibold">Patient</th>
                  <th className="text-right p-3 font-semibold">Qty</th>
                  <th className="text-left p-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr className="border-t">
                    <td colSpan={7} className="p-4 text-center text-muted-foreground">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(tx => (
                    <tr key={tx.id} className="border-t hover:bg-muted/50">
                      <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(tx.timestamp, 'MMM dd, HH:mm')}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={`text-xs ${getActionColor(tx.action)}`}>
                          {tx.action}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm">
                        {users.find(u => u.id === tx.userId)?.name || tx.userId}
                      </td>
                      <td className="p-3 text-sm font-medium">{tx.medicationId}</td>
                      <td className="p-3 text-sm">{tx.patientId || '-'}</td>
                      <td className="p-3 text-right text-sm">{tx.quantity || '-'}</td>
                      <td className="p-3 text-sm text-muted-foreground">{tx.details || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold mt-1">{transactions.length}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Dispensals</p>
              <p className="text-2xl font-bold mt-1">
                {transactions.filter(t => t.action === 'DISPENSE').length}
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Restocks</p>
              <p className="text-2xl font-bold mt-1">
                {transactions.filter(t => t.action === 'RESTOCK').length}
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Access Events</p>
              <p className="text-2xl font-bold mt-1">
                {transactions.filter(t => t.action === 'CUPBOARD_ACCESS').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
