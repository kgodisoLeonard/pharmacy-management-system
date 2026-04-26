'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { cupboardAccess, generateId, addAuditLog } from '@/lib/db'
import type { CupboardAccess } from '@/lib/types'
import { simulateFaceId } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  Lock,
  Unlock,
  ScanFace,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  LogIn,
  LogOut,
  Activity,
  Timer,
} from 'lucide-react'

export default function CupboardAccessPage() {
  const { user } = useAuth()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authMethod, setAuthMethod] = useState<'face_id' | 'password' | null>(null)
  const [password, setPassword] = useState('')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [sessionStart, setSessionStart] = useState<Date | null>(null)
  const [sessionTime, setSessionTime] = useState(0)
  const [currentAccessId, setCurrentAccessId] = useState<string | null>(null)
  const [accessLog, setAccessLog] = useState<CupboardAccess[]>(cupboardAccess)

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAuthenticated && sessionStart) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStart.getTime()) / 1000)
        setSessionTime(elapsed)
        
        // Auto-logout after 30 minutes
        if (elapsed >= 1800) {
          handleEndSession()
          toast.warning('Session expired - automatic logout after 30 minutes')
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isAuthenticated, sessionStart])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleFaceIdAuth = async () => {
    setIsAuthenticating(true)
    setAuthMethod('face_id')
    
    // Simulate Face ID scan delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const result = simulateFaceId()
    
    if (result.success) {
      // Create access log entry
      const access: CupboardAccess = {
        id: generateId('access'),
        userId: user?.id || '',
        accessTime: new Date(),
        authMethod: 'face_id',
        success: true,
      }
      cupboardAccess.push(access)
      setAccessLog([...cupboardAccess])
      setCurrentAccessId(access.id)
      
      addAuditLog(user?.id || '', 'CUPBOARD_ACCESS', 'cupboard', access.id, 'Access granted via Face ID')
      
      setIsAuthenticated(true)
      setSessionStart(new Date())
      toast.success('Face ID verified - Access granted')
    } else {
      // Log failed attempt
      const access: CupboardAccess = {
        id: generateId('access'),
        userId: user?.id || '',
        accessTime: new Date(),
        authMethod: 'face_id',
        success: false,
        reason: result.reason,
      }
      cupboardAccess.push(access)
      setAccessLog([...cupboardAccess])
      
      addAuditLog(user?.id || '', 'CUPBOARD_ACCESS_FAILED', 'cupboard', access.id, `Face ID failed: ${result.reason}`)
      
      toast.error(result.reason || 'Face ID verification failed')
      setShowPasswordDialog(true)
    }
    
    setIsAuthenticating(false)
  }

  const handlePasswordAuth = async () => {
    setIsAuthenticating(true)
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real app, this would verify against the user's password
    // For demo, we'll accept any non-empty password
    if (password.length > 0) {
      const access: CupboardAccess = {
        id: generateId('access'),
        userId: user?.id || '',
        accessTime: new Date(),
        authMethod: 'face_id_fallback',
        success: true,
      }
      cupboardAccess.push(access)
      setAccessLog([...cupboardAccess])
      setCurrentAccessId(access.id)
      
      addAuditLog(user?.id || '', 'CUPBOARD_ACCESS', 'cupboard', access.id, 'Access granted via password fallback')
      
      setIsAuthenticated(true)
      setSessionStart(new Date())
      setShowPasswordDialog(false)
      setPassword('')
      toast.success('Password verified - Access granted')
    } else {
      toast.error('Please enter your password')
    }
    
    setIsAuthenticating(false)
  }

  const handleEndSession = () => {
    if (currentAccessId) {
      // Update the access log with exit time
      const access = cupboardAccess.find(a => a.id === currentAccessId)
      if (access) {
        access.exitTime = new Date()
      }
      
      addAuditLog(user?.id || '', 'CUPBOARD_EXIT', 'cupboard', currentAccessId, `Session ended after ${formatTime(sessionTime)}`)
    }
    
    setIsAuthenticated(false)
    setSessionStart(null)
    setSessionTime(0)
    setCurrentAccessId(null)
    setAuthMethod(null)
    setAccessLog([...cupboardAccess])
    toast.info('Cupboard access session ended')
  }

  // Calculate session progress (30 min max)
  const sessionProgress = (sessionTime / 1800) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Lock className="h-6 w-6 text-primary" />
          Medication Cupboard Access
        </h1>
        <p className="text-muted-foreground">
          Secure access to medication storage with biometric authentication
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Authentication Panel */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isAuthenticated ? (
                <><Unlock className="h-5 w-5 text-green-600" /> Access Granted</>
              ) : (
                <><Lock className="h-5 w-5" /> Authentication Required</>
              )}
            </CardTitle>
            <CardDescription>
              {isAuthenticated 
                ? 'You have access to the medication cupboard' 
                : 'Authenticate to access the medication cupboard'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isAuthenticated ? (
              <div className="space-y-6">
                {/* Face ID Authentication */}
                <div className="text-center space-y-6 py-4">
                  <div className="relative mx-auto w-48 h-48 rounded-3xl bg-slate-900 overflow-hidden shadow-2xl ring-4 ring-slate-800">
                    {/* Simulated Camera Viewfinder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isAuthenticating && authMethod === 'face_id' ? (
                        <>
                          <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                          <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-[scan_2s_linear_infinite]" />
                          <div className="relative">
                            <ScanFace className="w-20 h-20 text-blue-400 animate-pulse" />
                            <div className="absolute -inset-4 border-2 border-blue-400/30 rounded-full animate-[ping_3s_linear_infinite]" />
                          </div>
                        </>
                      ) : (
                        <div className="text-slate-500 flex flex-col items-center">
                          <ScanFace className="w-16 h-16 mb-2 opacity-20" />
                          <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Camera Ready</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Corners */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500/50 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500/50 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500/50 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500/50 rounded-br-lg" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Biometric Verification</h3>
                    <p className="text-sm text-slate-500 max-w-[280px] mx-auto mt-1">
                      Position your face within the frame for secure cupboard access
                    </p>
                  </div>

                  <Button 
                    size="lg" 
                    className={`w-full max-w-xs h-14 rounded-2xl font-bold transition-all ${
                      isAuthenticating ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                    }`}
                    onClick={handleFaceIdAuth}
                    disabled={isAuthenticating}
                  >
                    {isAuthenticating ? (
                      <><Spinner className="w-5 h-5 mr-2" /> Authenticating...</>
                    ) : (
                      <><ShieldCheck className="w-5 h-5 mr-2" /> Verify Face ID</>
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or use password</span>
                  </div>
                </div>

                {/* Password Fallback */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowPasswordDialog(true)}
                >
                  <KeyRound className="w-4 h-4 mr-2" />
                  Use Password Instead
                </Button>

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Security Notice</p>
                    <p className="text-xs text-amber-700 mt-1">
                      All access attempts are logged and monitored. Unauthorized access will be reported to administration.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Session Status */}
                <div className="text-center space-y-4 py-4">
                  <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                    <ShieldCheck className="w-12 h-12 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-700">Cupboard Unlocked</h3>
                    <p className="text-sm text-muted-foreground">
                      Access session active
                    </p>
                  </div>
                </div>

                {/* Session Timer */}
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Session Time</span>
                    </div>
                    <span className="font-mono text-lg font-bold">{formatTime(sessionTime)}</span>
                  </div>
                  <Progress value={sessionProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    Session auto-expires after 30 minutes
                  </p>
                </div>

                {/* Session Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Authenticated User</span>
                    <span className="font-medium">{user?.fullName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Session Started</span>
                    <span className="font-medium">{sessionStart?.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Auth Method</span>
                    <Badge variant="outline">
                      {authMethod === 'face_id' ? 'Face ID' : 'Password'}
                    </Badge>
                  </div>
                </div>

                {/* End Session Button */}
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleEndSession}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  End Access Session
                </Button>

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Remember</p>
                    <p className="text-xs text-green-700 mt-1">
                      Always lock the cupboard and end your session when finished accessing medications.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {accessLog.filter(a => a.success).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Successful Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-600">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {accessLog.filter(a => !a.success).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Failed Attempts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Access Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5" />
              Recent Access Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            {accessLog.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No access attempts recorded</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {accessLog.slice().reverse().slice(0, 10).map((access) => (
                  <div 
                    key={access.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      access.success ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {access.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {access.success ? 'Access Granted' : 'Access Denied'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {access.authMethod === 'face_id' ? 'Face ID' : 
                           access.authMethod === 'face_id_fallback' ? 'Password (fallback)' : 
                           access.authMethod}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(access.accessTime).toLocaleTimeString()}
                      </p>
                      {access.exitTime && (
                        <p className="text-xs text-muted-foreground">
                          Duration: {formatTime(
                            Math.floor((new Date(access.exitTime).getTime() - new Date(access.accessTime).getTime()) / 1000)
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              Password Authentication
            </DialogTitle>
            <DialogDescription>
              Enter your account password to access the medication cupboard
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handlePasswordAuth(); }}>
            <FieldGroup>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </Field>
              <Button type="submit" className="w-full" disabled={isAuthenticating}>
                {isAuthenticating ? (
                  <><Spinner className="w-4 h-4 mr-2" /> Verifying...</>
                ) : (
                  <><ShieldCheck className="w-4 h-4 mr-2" /> Authenticate</>
                )}
              </Button>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
