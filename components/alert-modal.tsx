'use client'

import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  type: AlertType
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function AlertModal({
  isOpen,
  onClose,
  type,
  title,
  description,
  actionLabel = 'Close',
  onAction
}: AlertModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-20 h-20 text-green-500" />
      case 'error':
        return <XCircle className="w-20 h-20 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-20 h-20 text-amber-500" />
      case 'info':
        return <Info className="w-20 h-20 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50'
      case 'error': return 'bg-red-50'
      case 'warning': return 'bg-amber-50'
      case 'info': return 'bg-blue-50'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-2xl rounded-3xl">
        <div className={`flex flex-col items-center justify-center p-10 ${getBgColor()}`}>
          <div className="bg-white p-4 rounded-full shadow-lg mb-6 ring-8 ring-white/50">
            {getIcon()}
          </div>
          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-2xl font-black text-slate-900">{title}</DialogTitle>
            <DialogDescription className="text-slate-600 text-lg font-medium">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6 bg-white flex justify-center">
          <Button 
            className={`px-12 py-6 rounded-2xl text-lg font-bold shadow-lg transition-transform active:scale-95 ${
              type === 'success' ? 'bg-green-600 hover:bg-green-700' :
              type === 'error' ? 'bg-red-600 hover:bg-red-700' :
              type === 'warning' ? 'bg-amber-600 hover:bg-amber-700' :
              'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={() => {
              if (onAction) onAction()
              onClose()
            }}
          >
            {actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
