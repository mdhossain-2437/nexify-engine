export type UserRole = 'super_admin' | 'tenant_admin' | 'staff' | 'customer'

export interface User {
  id: string
  tenantId: string | null
  name: string
  email: string
  role: UserRole
  avatar: string | null
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export type UserStatus = 'active' | 'inactive' | 'banned'
