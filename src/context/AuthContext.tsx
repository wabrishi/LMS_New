import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, User } from '../types';
import { apiClient } from '../services/apiClient';

export interface PermissionRule {
  id: string;
  moduleName: string;
  category: 'Core System' | 'Academic' | 'Financial' | 'Communication';
  superAdmin: { view: boolean; create: boolean; edit: boolean; delete: boolean; export: boolean };
  instituteAdmin: { view: boolean; create: boolean; edit: boolean; delete: boolean; export: boolean };
  faculty: { view: boolean; create: boolean; edit: boolean; delete: boolean; export: boolean };
  student: { view: boolean; create: boolean; edit: boolean; delete: boolean; export: boolean };
}

export const defaultPermissions: PermissionRule[] = [
  {
    id: 'p-1',
    moduleName: 'Dashboard',
    category: 'Core System',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: false, export: true },
    faculty: { view: true, create: false, edit: false, delete: false, export: false },
    student: { view: true, create: false, edit: false, delete: false, export: false }
  },
  {
    id: 'p-2',
    moduleName: 'Students',
    category: 'Academic',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: true, create: false, edit: false, delete: false, export: true },
    student: { view: false, create: false, edit: false, delete: false, export: false }
  },
  {
    id: 'p-3',
    moduleName: 'Faculty',
    category: 'Academic',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: false, create: false, edit: false, delete: false, export: false },
    student: { view: false, create: false, edit: false, delete: false, export: false }
  },
  {
    id: 'p-4',
    moduleName: 'Courses',
    category: 'Academic',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: true, create: true, edit: true, delete: false, export: true },
    student: { view: true, create: false, edit: false, delete: false, export: false }
  },
  {
    id: 'p-5',
    moduleName: 'Batches',
    category: 'Academic',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: true, create: false, edit: false, delete: false, export: false },
    student: { view: false, create: false, edit: false, delete: false, export: false }
  },
  {
    id: 'p-6',
    moduleName: 'Live Classes',
    category: 'Academic',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: true, create: true, edit: true, delete: true, export: true },
    student: { view: true, create: false, edit: false, delete: false, export: false }
  },
  {
    id: 'p-7',
    moduleName: 'Video Library',
    category: 'Academic',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: true, create: true, edit: true, delete: false, export: true },
    student: { view: true, create: false, edit: false, delete: false, export: false }
  },
  {
    id: 'p-8',
    moduleName: 'Study Materials',
    category: 'Academic',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: true, create: true, edit: true, delete: false, export: true },
    student: { view: true, create: false, edit: false, delete: false, export: false }
  },
  {
    id: 'p-9',
    moduleName: 'Assignments',
    category: 'Academic',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: true, create: true, edit: true, delete: true, export: true },
    student: { view: true, create: true, edit: false, delete: false, export: false }
  },
  {
    id: 'p-10',
    moduleName: 'Quizzes & Exams',
    category: 'Academic',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: true, create: true, edit: true, delete: true, export: true },
    student: { view: true, create: true, edit: false, delete: false, export: false }
  },
  {
    id: 'p-11',
    moduleName: 'Attendance',
    category: 'Academic',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: true, create: true, edit: true, delete: false, export: true },
    student: { view: true, create: false, edit: false, delete: false, export: false }
  },
  {
    id: 'p-12',
    moduleName: 'Fees & Invoices',
    category: 'Financial',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: false, create: false, edit: false, delete: false, export: false },
    student: { view: true, create: true, edit: false, delete: false, export: true }
  },
  {
    id: 'p-13',
    moduleName: 'Certificates',
    category: 'Academic',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: true, create: true, edit: false, delete: false, export: true },
    student: { view: true, create: false, edit: false, delete: false, export: true }
  },
  {
    id: 'p-14',
    moduleName: 'Discussion Forum',
    category: 'Communication',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: true, create: true, edit: true, delete: true, export: true },
    student: { view: true, create: true, edit: false, delete: false, export: false }
  },
  {
    id: 'p-15',
    moduleName: 'Direct Messages',
    category: 'Communication',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    faculty: { view: true, create: true, edit: true, delete: true, export: true },
    student: { view: true, create: true, edit: false, delete: false, export: false }
  },
  {
    id: 'p-16',
    moduleName: 'Reports & Analytics',
    category: 'Core System',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: false, export: true },
    faculty: { view: true, create: false, edit: false, delete: false, export: false },
    student: { view: false, create: false, edit: false, delete: false, export: false }
  },
  {
    id: 'p-17',
    moduleName: 'Settings',
    category: 'Core System',
    superAdmin: { view: true, create: true, edit: true, delete: true, export: true },
    instituteAdmin: { view: true, create: true, edit: true, delete: false, export: true },
    faculty: { view: false, create: false, edit: false, delete: false, export: false },
    student: { view: false, create: false, edit: false, delete: false, export: false }
  }
];

const defaultUsers: Record<UserRole, User> = {
  SUPER_ADMIN: {
    id: 'u-super',
    email: 'superadmin@edupulse.org',
    firstName: 'Global',
    lastName: 'Administrator',
    role: 'SUPER_ADMIN',
    instituteId: 'inst-global',
    instituteName: 'EduPulse Global Network',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  INSTITUTE_ADMIN: {
    id: 'u-admin',
    email: 'admin@apex-tech.edu',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    role: 'INSTITUTE_ADMIN',
    instituteId: 'inst-001',
    instituteName: 'Apex Tech University',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  FACULTY: {
    id: 'u-fac',
    email: 'rajesh.kumar@faculty.edu',
    firstName: 'Dr. Rajesh',
    lastName: 'Kumar',
    role: 'FACULTY',
    instituteId: 'inst-001',
    instituteName: 'Apex Tech University',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  STUDENT: {
    id: 'u-std',
    email: 'aarav.sharma@student.edu',
    firstName: 'Aarav',
    lastName: 'Sharma',
    role: 'STUDENT',
    instituteId: 'inst-001',
    instituteName: 'Apex Tech University',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
};

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  setAuthUser: (role: UserRole, user?: any) => void;
  isAuthenticated: boolean;
  login: (role: UserRole, email: string) => void;
  logout: () => void;
  currentUser: User;
  activeModule: string;
  setActiveModule: (module: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  permissionsMatrix: PermissionRule[];
  updatePermissionsMatrix: (matrix: PermissionRule[]) => void;
  hasPermission: (
    role: UserRole,
    moduleName: string,
    permissionType?: 'view' | 'create' | 'edit' | 'delete' | 'export'
  ) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('lms_auth_role') as UserRole;
    return savedRole && defaultUsers[savedRole] ? savedRole : 'SUPER_ADMIN';
  });

  const [customUser, setCustomUserState] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('lms_auth_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch { return null; }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('lms_auth_token'));
  });

  const [activeModule, setActiveModuleState] = useState<string>(() => {
    const savedModule = localStorage.getItem('lms_active_module');
    return savedModule || 'Dashboard';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [permissionsMatrix, setPermissionsMatrix] = useState<PermissionRule[]>(() => {
    const saved = localStorage.getItem('lms_rbac_matrix');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultPermissions;
  });

  useEffect(() => {
    apiClient.checkHealth().then((connected) => {
      if (connected) {
        console.log('✅ Connected to Express REST API with MySQL Database');
      }
    });
  }, []);

  const setActiveModule = (moduleName: string) => {
    setActiveModuleState(moduleName);
    localStorage.setItem('lms_active_module', moduleName);
  };

  const setAuthUser = (newRole: UserRole, userObj?: any) => {
    setRoleState(newRole);
    setIsAuthenticated(true);
    if (userObj) {
      setCustomUserState(userObj);
    }
    localStorage.setItem('lms_auth_role', newRole);
    const savedModule = localStorage.getItem('lms_active_module');
    if (!savedModule) {
      setActiveModule('Dashboard');
    }
  };

  const login = async (_newRole: UserRole, userEmail: string) => {
    try {
      const response = await apiClient.login({ email: userEmail, password: 'SuperSecurePass123!' });
      if (response.success && response.user) {
        setAuthUser(response.user.role as UserRole, response.user);
        if (response.accessToken) {
          localStorage.setItem('lms_access_token', response.accessToken);
        }
      }
    } catch (err) {
      console.error('Database API login failed:', err);
      logout();
    }
  };

  const setRole = (newRole: UserRole) => {
    login(newRole, defaultUsers[newRole].email);
  };

  const logout = () => {
    localStorage.removeItem('lms_auth_token');
    localStorage.removeItem('lms_access_token');
    localStorage.removeItem('lms_auth_user');
    localStorage.removeItem('lms_auth_role');
    localStorage.removeItem('lms_active_module');
    setIsAuthenticated(false);
    setCustomUserState(null);
    setActiveModuleState('Dashboard');
  };

  const updatePermissionsMatrix = (newMatrix: PermissionRule[]) => {
    setPermissionsMatrix(newMatrix);
    localStorage.setItem('lms_rbac_matrix', JSON.stringify(newMatrix));
  };

  const hasPermission = (
    userRole: UserRole,
    moduleName: string,
    permissionType: 'view' | 'create' | 'edit' | 'delete' | 'export' = 'view'
  ): boolean => {
    if (userRole === 'SUPER_ADMIN' && (moduleName === 'RBAC Control' || moduleName === 'Dashboard')) {
      return true;
    }

    const rule = permissionsMatrix.find(p => p.moduleName.toLowerCase() === moduleName.toLowerCase());
    if (!rule) return true;

    let roleKey: 'superAdmin' | 'instituteAdmin' | 'faculty' | 'student';
    switch (userRole) {
      case 'SUPER_ADMIN': roleKey = 'superAdmin'; break;
      case 'INSTITUTE_ADMIN': roleKey = 'instituteAdmin'; break;
      case 'FACULTY': roleKey = 'faculty'; break;
      case 'STUDENT': roleKey = 'student'; break;
    }

    return Boolean(rule[roleKey]?.[permissionType]);
  };

  const currentUser = customUser || defaultUsers[role];

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        setAuthUser,
        isAuthenticated,
        login,
        logout,
        currentUser,
        activeModule,
        setActiveModule,
        searchQuery,
        setSearchQuery,
        permissionsMatrix,
        updatePermissionsMatrix,
        hasPermission
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
