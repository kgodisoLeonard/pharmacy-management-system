'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Pill, ShieldCheck, Users, ClipboardList, Package, AlertCircle, Mail, Lock, Eye } from 'lucide-react'
import { toast } from 'sonner'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(username, password)
    
    if (result.success) {
      toast.success('Login successful')
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
      toast.error(result.error || 'Login failed')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff]">
      <div className="w-full max-w-md p-4">
        <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden bg-white">
          <CardHeader className="pt-10 pb-6 text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#ccfbf1] flex items-center justify-center mb-4">
              <span className="text-[#0d9488] text-2xl font-bold">P</span>
            </div>
            <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">PharmaCare</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Hospital Pharmacy Management
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="username" className="text-slate-700 font-semibold mb-1.5 ml-1">Email</FieldLabel>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0d9488] transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      placeholder="your@email.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="pl-12 h-12 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </Field>
                
                <Field>
                  <FieldLabel htmlFor="password" className="text-slate-700 font-semibold mb-1.5 ml-1">Password</FieldLabel>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0d9488] transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-12 h-12 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-all"
                      disabled={isLoading}
                    />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </Field>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl shadow-lg shadow-[#0d9488]/20 transition-all transform hover:scale-[1.01] active:scale-[0.99]" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-5 h-5 mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            
            <div className="mt-10 pt-8 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-widest mb-6">
                Demo Credentials:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <DemoButton role="Admin" onClick={() => { setUsername('admin'); setPassword('admin123'); }} />
                <DemoButton role="Doctor" onClick={() => { setUsername('dr.smith'); setPassword('doctor123'); }} />
                <DemoButton role="Pharmacist" onClick={() => { setUsername('pharmacist1'); setPassword('pharma123'); }} />
                <DemoButton role="Assistant" onClick={() => { setUsername('assistant1'); setPassword('assist123'); }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DemoButton({ role, onClick }: { role: string; onClick: () => void }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className="py-2.5 px-4 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-center"
    >
      {role}
    </button>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-4 rounded-lg bg-sidebar-accent/50 border border-sidebar-border">
      <div className="flex items-center gap-2 text-primary mb-2">
        {icon}
        <span className="font-medium text-sidebar-foreground text-sm">{title}</span>
      </div>
      <p className="text-xs text-sidebar-foreground/60">{description}</p>
    </div>
  )
}

function DemoAccount({ role, username, password }: { role: string; username: string; password: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-muted/50">
      <span className="font-medium text-foreground">{role}</span>
      <span className="text-muted-foreground font-mono">{username} / {password}</span>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
