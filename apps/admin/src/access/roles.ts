import type { Access, FieldAccess } from 'payload'

type UserWithRole = {
  id: string
  role: 'super_admin' | 'tenant_admin' | 'staff' | 'customer'
  tenant?: { id: string } | string | null
}

const getUserTenantId = (user: UserWithRole): string | null => {
  if (!user.tenant) return null
  if (typeof user.tenant === 'string') return user.tenant
  return user.tenant.id
}

export const superAdminAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  const u = user as unknown as UserWithRole
  return u.role === 'super_admin'
}

export const authenticatedAccess: Access = ({ req: { user } }) => {
  return !!user
}

export const tenantAdminAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  const u = user as unknown as UserWithRole
  if (u.role === 'super_admin') return true
  if (u.role === 'tenant_admin' || u.role === 'staff') {
    const tenantId = getUserTenantId(u)
    if (!tenantId) return false
    return {
      id: { equals: tenantId },
    }
  }
  return false
}

export const tenantIsolatedAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  const u = user as unknown as UserWithRole
  if (u.role === 'super_admin') return true
  const tenantId = getUserTenantId(u)
  if (!tenantId) return false
  return {
    tenant: { equals: tenantId },
  }
}

export const superAdminFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) return false
  const u = user as unknown as UserWithRole
  return u.role === 'super_admin'
}
