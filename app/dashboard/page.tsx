'use client'

import { useAuth } from '@/lib/auth-context'
import { patients, prescriptions, inventory, medications } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Users,
  ClipboardList,
  Package,
  AlertTriangle,
  Plus,
  ArrowRight,
  Pill,
  Syringe,
  BarChart3,
  UserPlus,
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export default function DashboardPage() {
  const { user } = useAuth()

  // Stats
  const totalPatients = 256 // Mocking for aesthetic match
  const totalMedications = medications.length
  const totalPrescriptions = 135 // Mocking
  const lowStockAlerts = inventory.filter(inv => inv.quantity <= inv.reorderLevel).length

  // Pie chart data
  const genderData = [
    { name: 'Male', value: 55 },
    { name: 'Female', value: 45 },
  ]
  const COLORS = ['#1e40af', '#16a34a']

  // Bar chart data
  const salesData = [
    { name: 'Jan', sales: 400, prescriptions: 240 },
    { name: 'Feb', sales: 300, prescriptions: 139 },
    { name: 'Mar', sales: 200, prescriptions: 980 },
    { name: 'Apr', sales: 278, prescriptions: 390 },
    { name: 'May', sales: 189, prescriptions: 480 },
    { name: 'Jun', sales: 239, prescriptions: 380 },
  ]

  const recentActivities = [
    { date: '14/10/2021', activity: 'Prescription Dispensed', user: 'Admin' },
    { date: '13/10/2021', activity: 'New Patient Registered', user: 'Dr. Smith' },
    { date: '12/10/2021', activity: 'Medication Stock Updated', user: 'Nurse Lee' },
    { date: '11/10/2021', activity: 'Prescription Created', user: 'Admin' },
  ]

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Patients"
          value={totalPatients}
          icon={<Users className="h-8 w-8" />}
          gradient="var(--dashboard-blue)"
        />
        <StatsCard
          title="Total Medications"
          value={totalMedications}
          icon={<Pill className="h-8 w-8" />}
          gradient="var(--dashboard-green)"
        />
        <StatsCard
          title="Total Prescriptions"
          value={totalPrescriptions}
          icon={<ClipboardList className="h-8 w-8" />}
          gradient="var(--dashboard-orange)"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockAlerts}
          icon={<AlertTriangle className="h-8 w-8" />}
          gradient="var(--dashboard-red)"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 shadow-md border-0 ring-1 ring-slate-200">
          <CardHeader className="border-b bg-slate-50/50 py-4">
            <CardTitle className="text-lg font-bold text-slate-800">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Activity</th>
                  <th className="px-6 py-3">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentActivities.map((act, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{act.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{act.activity}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{act.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-md border-0 ring-1 ring-slate-200 overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50 py-4">
            <CardTitle className="text-lg font-bold text-slate-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <QuickActionButton 
              title="Add New Patient" 
              icon={<UserPlus className="h-5 w-5" />} 
              gradient="var(--dashboard-blue)" 
              href="/dashboard/patients"
            />
            <QuickActionButton 
              title="Add Medication" 
              icon={<Plus className="h-5 w-5" />} 
              gradient="var(--dashboard-green)" 
              href="/dashboard/inventory"
            />
            <QuickActionButton 
              title="Create Prescription" 
              icon={<ClipboardList className="h-5 w-5" />} 
              gradient="var(--dashboard-orange)" 
              href="/dashboard/prescriptions"
            />
            <QuickActionButton 
              title="Record Dispensing" 
              icon={<Syringe className="h-5 w-5" />} 
              gradient="var(--dashboard-purple)" 
              href="/dashboard/dispensing"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Patient Statistics */}
        <Card className="shadow-md border-0 ring-1 ring-slate-200">
          <CardHeader className="border-b bg-slate-50/50 py-4">
            <CardTitle className="text-lg font-bold text-slate-800">Patient Statistics</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="middle" align="right" layout="vertical" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales & Dispensing Overview */}
        <Card className="shadow-md border-0 ring-1 ring-slate-200">
          <CardHeader className="border-b bg-slate-50/50 py-4">
            <CardTitle className="text-lg font-bold text-slate-800">Sales & Dispensing Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sales" />
                  <Bar dataKey="prescriptions" fill="#22c55e" radius={[4, 4, 0, 0]} name="Prescriptions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon, gradient }: { title: string; value: number; icon: React.ReactNode; gradient: string }) {
  return (
    <Card className="border-0 shadow-lg overflow-hidden text-white transition-transform hover:scale-[1.02]" style={{ background: gradient }}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
            {icon}
          </div>
          <div>
            <p className="text-sm font-bold opacity-90 uppercase tracking-wider">{title}</p>
            <h3 className="text-4xl font-extrabold mt-1">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionButton({ title, icon, gradient, href }: { title: string; icon: React.ReactNode; gradient: string; href: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-4 p-4 rounded-xl text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98] group" style={{ background: gradient }}>
        <div className="p-2.5 rounded-lg bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="font-bold text-base">{title}</span>
      </div>
    </Link>
  )
}
