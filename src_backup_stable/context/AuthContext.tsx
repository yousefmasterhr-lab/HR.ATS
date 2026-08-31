import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PermissionKey, ROLE_DEFINITIONS, RoleDefinition } from '../types/auth';
import { MOCK_USERS } from '../data/mockUsers';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  users: User[];
  roleDefinitions: Record<UserRole, RoleDefinition>;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  hasPermission: (permission: PermissionKey) => boolean;
  canViewSalary: () => boolean;
  canEditSalary: () => boolean;
  canApproveRequisition: () => boolean;
  canViewScorecards: () => boolean;
  updateRolePermissions: (role: UserRole, permissions: PermissionKey[]) => void;
  togglePermissionForRole: (role: UserRole, permission: PermissionKey) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ats_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [roleDefinitions, setRoleDefinitions] = useState<Record<UserRole, RoleDefinition>>(() => {
    const saved = localStorage.getItem('ats_role_definitions');
    return saved ? JSON.parse(saved) : ROLE_DEFINITIONS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUserId = localStorage.getItem('ats_active_user_id');
    const found = users.find((u) => u.id === savedUserId);
    return found || users[0]; // Defaults to Sarah Al-Mansoor (HR Manager)
  });

  useEffect(() => {
    localStorage.setItem('ats_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ats_role_definitions', JSON.stringify(roleDefinitions));
  }, [roleDefinitions]);

  useEffect(() => {
    localStorage.setItem('ats_active_user_id', currentUser.id);
  }, [currentUser]);

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const switchRole = (role: UserRole) => {
    // Find existing user with that role or create temp view
    const matchingUser = users.find((u) => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    } else {
      // Switch active user's role
      const updatedUser: User = {
        ...currentUser,
        role,
      };
      setCurrentUser(updatedUser);
    }
  };

  const hasPermission = (permission: PermissionKey): boolean => {
    if (currentUser.role === 'super_admin') return true;

    // Check custom user override permissions first
    if (currentUser.customPermissions && currentUser.customPermissions.includes(permission)) {
      return true;
    }

    const roleDef = roleDefinitions[currentUser.role];
    if (!roleDef) return false;

    return roleDef.permissions.includes(permission);
  };

  const canViewSalary = (): boolean => {
    return hasPermission('view_salary');
  };

  const canEditSalary = (): boolean => {
    return hasPermission('edit_salary');
  };

  const canApproveRequisition = (): boolean => {
    return hasPermission('approve_requisition');
  };

  const canViewScorecards = (): boolean => {
    return hasPermission('view_scorecards') || hasPermission('view_all_evaluations');
  };

  const updateRolePermissions = (role: UserRole, permissions: PermissionKey[]) => {
    setRoleDefinitions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        permissions,
      },
    }));
  };

  const togglePermissionForRole = (role: UserRole, permission: PermissionKey) => {
    setRoleDefinitions((prev) => {
      const currentPerms = prev[role].permissions;
      const exists = currentPerms.includes(permission);
      const newPerms = exists
        ? currentPerms.filter((p) => p !== permission)
        : [...currentPerms, permission];

      return {
        ...prev,
        [role]: {
          ...prev[role],
          permissions: newPerms,
        },
      };
    });
  };

  const addUser = (newUser: User) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        users,
        roleDefinitions,
        switchRole,
        switchUser,
        hasPermission,
        canViewSalary,
        canEditSalary,
        canApproveRequisition,
        canViewScorecards,
        updateRolePermissions,
        togglePermissionForRole,
        addUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
