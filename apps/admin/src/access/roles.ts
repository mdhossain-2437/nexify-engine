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

export const publicReadAccess: Access = () => {
  return true
}

export const tenantIsolatedReadAccess: Access = ({ req: { user } }) => {
  if (!user) return true
  const u = user as unknown as UserWithRole
  if (u.role === 'super_admin') return true
  const tenantId = getUserTenantId(u)
  if (!tenantId) return true
  return {
    tenant: { equals: tenantId },
  }
}

export const tenantIsolatedWriteAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  const u = user as unknown as UserWithRole
  if (u.role === 'super_admin') return true
  if (u.role === 'customer') return false
  const tenantId = getUserTenantId(u)
  if (!tenantId) return false
  return {
    tenant: { equals: tenantId },
  }
}

export const tenantCreateAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  const u = user as unknown as UserWithRole
  if (u.role === 'super_admin') return true
  if (u.role === 'tenant_admin' || u.role === 'staff') {
    return !!getUserTenantId(u)
  }
  return false
}

export const selfOrAdminAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  const u = user as unknown as UserWithRole
  if (u.role === 'super_admin') return true
  return {
    id: { equals: u.id },
  }
}

export const superAdminFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) return false
  const u = user as unknown as UserWithRole
  return u.role === 'super_admin'
}
