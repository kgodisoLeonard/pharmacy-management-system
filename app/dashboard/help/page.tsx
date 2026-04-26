'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { HelpCircle, FileText, Lightbulb, AlertCircle, BookOpen } from 'lucide-react'

const faqs = [
  {
    question: 'How do I create a new patient record?',
    answer: 'Navigate to the Patients page and click the "Add Patient" button. Fill in the required information including name, date of birth, contact details, and medical history. Click Save to create the patient record.',
  },
  {
    question: 'What is the prescription workflow?',
    answer: 'The prescription workflow consists of: 1) Doctor creates a prescription in the Prescriptions page, 2) Prescription is marked as pending, 3) Pharmacist reviews and dispenses the medication, 4) Dispensing is confirmed in the system.',
  },
  {
    question: 'How does the medication cupboard access work?',
    answer: 'The medication cupboard requires authentication via Face ID or password. When you access the cupboard, you must authenticate. All access is logged for security and audit purposes.',
  },
  {
    question: 'How do I check medication inventory?',
    answer: 'Go to the Inventory page to view all medications, their current stock levels, reorder levels, and expiry dates. Items below the reorder level are highlighted for immediate restocking.',
  },
  {
    question: 'What does the Audit Log show?',
    answer: 'The Audit Log records all system activities including logins, medication access, dispensing, inventory updates, and user management actions. You can filter by action type, user, or search for specific medications.',
  },
  {
    question: 'How are user roles managed?',
    answer: 'Admin users can manage all user accounts in the Admin Panel. Each role has specific permissions: Admin (full access), Doctor (prescriptions), Pharmacist (dispensing & inventory), Assistant (dispensing), Stock Taker (inventory only).',
  },
  {
    question: 'Can I export data from the system?',
    answer: 'Yes, the Audit Log page has an Export CSV button to download transaction data. Individual pages may also have export functionality for their specific data.',
  },
  {
    question: 'What should I do if I forget my password?',
    answer: 'Contact your system administrator to reset your password. Passwords can be changed from the Settings page if you remember your current password.',
  },
]

const roles = [
  {
    name: 'Administrator',
    color: 'bg-red-100 text-red-800',
    access: 'Full system access',
    responsibilities: [
      'User account management',
      'System configuration',
      'Audit log review',
      'Permission management',
    ],
  },
  {
    name: 'Doctor',
    color: 'bg-blue-100 text-blue-800',
    access: 'Prescription creation',
    responsibilities: [
      'Create prescriptions',
      'View patient records',
      'Monitor patient medications',
    ],
  },
  {
    name: 'Pharmacist',
    color: 'bg-green-100 text-green-800',
    access: 'Medication management',
    responsibilities: [
      'Dispense medications',
      'Manage inventory',
      'Verify prescriptions',
      'Access medication cupboard',
    ],
  },
  {
    name: 'Pharmacy Assistant',
    color: 'bg-yellow-100 text-yellow-800',
    access: 'Assist pharmacist',
    responsibilities: [
      'Assist with dispensing',
      'Support inventory tasks',
      'Basic patient information access',
    ],
  },
  {
    name: 'Stock Taker',
    color: 'bg-purple-100 text-purple-800',
    access: 'Inventory management',
    responsibilities: [
      'Manage medication inventory',
      'Update stock levels',
      'Monitor expiry dates',
      'Generate stock reports',
    ],
  },
]

const tips = [
  {
    title: 'Quick Patient Search',
    description: 'Use the search field on the Patients page to quickly find patient records by name, ID, or contact information.',
  },
  {
    title: 'Prescription Filtering',
    description: 'Filter prescriptions by status (pending, completed, cancelled) to focus on prescriptions that need your attention.',
  },
  {
    title: 'Low Stock Alerts',
    description: 'The dashboard shows alerts for medications below reorder level. Review these regularly to maintain adequate stock.',
  },
  {
    title: 'Audit Trail',
    description: 'All actions are logged. Use the Audit Log to review who did what and when for compliance and quality assurance.',
  },
  {
    title: 'Cupboard Security',
    description: 'Always authenticate before accessing the medication cupboard. Face ID is the preferred method for security.',
  },
]

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <HelpCircle className="h-8 w-8" />
          Help & Documentation
        </h1>
        <p className="text-muted-foreground mt-2">Get support and learn how to use the pharmacy management system</p>
      </div>

      {/* Quick Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {tips.map((tip, i) => (
              <div key={i} className="p-3 bg-background rounded-lg border">
                <p className="font-medium text-sm">{tip.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            User Roles & Permissions
          </CardTitle>
          <CardDescription>Overview of system roles and their access levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.map((role) => (
            <div key={role.name} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{role.name}</h3>
                  <p className="text-sm text-muted-foreground">{role.access}</p>
                </div>
                <Badge className={`text-xs ${role.color}`}>
                  {role.name}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Responsibilities:</p>
                <ul className="list-disc list-inside space-y-1">
                  {role.responsibilities.map((resp, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{resp}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Find answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="bg-destructive/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Important Security Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Never share your login credentials with anyone</p>
          <p>• Always log out before leaving your workstation</p>
          <p>• Report any suspicious activity to the administrator</p>
          <p>• All system activities are logged and auditable</p>
          <p>• Medication access requires authentication for security and compliance</p>
          <p>• Follow your facility's standard operating procedures (SOPs)</p>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">If you need additional assistance:</p>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Email:</span> support@pharmacy-system.local
            </p>
            <p className="text-sm">
              <span className="font-medium">Phone:</span> Extension 5555
            </p>
            <p className="text-sm">
              <span className="font-medium">Hours:</span> Monday - Friday, 8 AM - 5 PM
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
