// Roles del sistema
export enum UserRole {
  COMERCIAL_KAVAK = 'COMERCIAL_KAVAK',
  COMERCIAL_KUNA = 'COMERCIAL_KUNA',
  LIDER = 'LIDER',
  ADMIN = 'ADMIN'
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.COMERCIAL_KAVAK]: 'Comercial Kavak',
  [UserRole.COMERCIAL_KUNA]: 'Comercial Kuna',
  [UserRole.LIDER]: 'Líder',
  [UserRole.ADMIN]: 'Admin'
};

export const ROLE_PERMISSIONS = {
  [UserRole.COMERCIAL_KAVAK]: {
    canViewLeads: true,
    canEditOferta: true,
    canEditHandoff: false,
    canEditDictamen: false,
    canViewAllLeads: false,
    canManageSettings: false
  },
  [UserRole.COMERCIAL_KUNA]: {
    canViewLeads: true,
    canEditOferta: false,
    canEditHandoff: true,
    canEditDictamen: true,
    canViewAllLeads: false,
    canManageSettings: false
  },
  [UserRole.LIDER]: {
    canViewLeads: true,
    canEditOferta: true,
    canEditHandoff: true,
    canEditDictamen: true,
    canViewAllLeads: true,
    canManageSettings: false
  },
  [UserRole.ADMIN]: {
    canViewLeads: true,
    canEditOferta: true,
    canEditHandoff: true,
    canEditDictamen: true,
    canViewAllLeads: true,
    canManageSettings: true
  }
};

export function hasPermission(role: UserRole, permission: keyof typeof ROLE_PERMISSIONS[UserRole]): boolean {
  return ROLE_PERMISSIONS[role][permission];
}

