'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Pill,
  LayoutDashboard,
  Users,
  ClipboardList,
  Package,
  Lock,
  FileText,
  Settings,
  LogOut,
  ChevronUp,
  Syringe,
  UserCog,
} from 'lucide-react'

const menuItems = [
  {
    title: 'Main Menu',
    items: [
      { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, permission: 'dashboard' },
      { title: 'Patients', url: '/dashboard/patients', icon: Users, permission: 'patients' },
      { title: 'Medication Stock', url: '/dashboard/inventory', icon: Package, permission: 'inventory' },
      { title: 'Prescriptions', url: '/dashboard/prescriptions', icon: ClipboardList, permission: 'prescriptions' },
      { title: 'Dispensing & Transactions', url: '/dashboard/dispensing', icon: Syringe, permission: 'dispensing' },
      { title: 'Reports', url: '/dashboard/reports', icon: FileText, permission: 'dashboard' }, // dashboard perm as fallback
    ],
  },
  {
    title: 'Operations',
    items: [
      { title: 'Cupboard Access', url: '/dashboard/cupboard', icon: Lock, permission: 'cupboard' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { title: 'Admin Panel', url: '/dashboard/admin', icon: UserCog, permission: 'admin' },
      { title: 'Settings', url: '/dashboard/settings', icon: Settings, permission: 'settings' },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout, hasPermission, roleDisplayName } = useAuth()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <Pill className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-foreground">PharmaCare</span>
            <span className="text-xs text-sidebar-foreground/60">Hospital Pharmacy</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => {
          const visibleItems = group.items.filter(item => hasPermission(item.permission))
          
          if (visibleItems.length === 0) return null
          
          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user ? getInitials(user.fullName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.fullName}</span>
                    <span className="truncate text-xs text-sidebar-foreground/60">
                      {roleDisplayName}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={4}
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => {
                    logout()
                    window.location.href = '/'
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
