import React, { useState } from 'react';
import { useAuth, defaultPermissions } from '../../../context/AuthContext';
import type { UserRole } from '../../../types';
import {
  ShieldCheck,
  Building2,
  BookOpen,
  GraduationCap,
  Plus,
  Save,
  CheckCircle2,
  Users,
  Lock,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Badge } from '../../common/Badge';

interface CustomRole {
  id: string;
  name: string;
  description: string;
  baseRole: UserRole;
  userCount: number;
  isSystem: boolean;
}

const defaultRoles: CustomRole[] = [
  { id: 'r-1', name: 'Super Admin', description: 'Unrestricted global system access across all institutes', baseRole: 'SUPER_ADMIN', userCount: 3, isSystem: true },
  { id: 'r-2', name: 'Institute Admin', description: 'Full operational control over assigned institute instance', baseRole: 'INSTITUTE_ADMIN', userCount: 12, isSystem: true },
  { id: 'r-3', name: 'Faculty Trainer', description: 'Curriculum creation, live teaching, grading, and batch attendance', baseRole: 'FACULTY', userCount: 45, isSystem: true },
  { id: 'r-4', name: 'Student Portal', description: 'Course enrollment, video streaming, quiz taking, fee invoices', baseRole: 'STUDENT', userCount: 645, isSystem: true },
  { id: 'r-5', name: 'Teaching Assistant (TA)', description: 'Assists faculty with grading homework and answering forum Q&A', baseRole: 'FACULTY', userCount: 8, isSystem: false },
  { id: 'r-6', name: 'Finance Auditor', description: 'Read-only access to tuition fee invoices, payments, and revenue reports', baseRole: 'INSTITUTE_ADMIN', userCount: 4, isSystem: false },
];

export const RBACManagementView: React.FC = () => {
  const { permissionsMatrix, updatePermissionsMatrix } = useAuth();
  const [activeTab, setActiveTab] = useState<'matrix' | 'roles' | 'audits'>('matrix');
  const [saveToast, setSaveToast] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [customRoles, setCustomRoles] = useState<CustomRole[]>(() => {
    const saved = localStorage.getItem('lms_custom_roles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultRoles;
  });

  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleBase, setNewRoleBase] = useState<UserRole>('FACULTY');

  const togglePermission = (ruleId: string, roleKey: 'superAdmin' | 'instituteAdmin' | 'faculty' | 'student', permKey: 'view' | 'create' | 'edit' | 'delete' | 'export') => {
    const updated = permissionsMatrix.map(p => {
      if (p.id === ruleId) {
        return {
          ...p,
          [roleKey]: {
            ...p[roleKey],
            [permKey]: !p[roleKey][permKey]
          }
        };
      }
      return p;
    });

    updatePermissionsMatrix(updated);
    setHasUnsavedChanges(true);
  };

  const handleSaveMatrix = () => {
    updatePermissionsMatrix(permissionsMatrix);
    localStorage.setItem('lms_custom_roles', JSON.stringify(customRoles));
    setHasUnsavedChanges(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all RBAC permissions to default system model?')) {
      updatePermissionsMatrix(defaultPermissions);
      setCustomRoles(defaultRoles);
      localStorage.removeItem('lms_custom_roles');
      setHasUnsavedChanges(false);
      alert('RBAC matrix reset to default settings.');
    }
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const created: CustomRole = {
      id: `r-${Date.now()}`,
      name: newRoleName.trim(),
      description: newRoleDesc || 'Custom defined role with tailored RBAC access scope.',
      baseRole: newRoleBase,
      userCount: 1,
      isSystem: false
    };

    const updatedRoles = [...customRoles, created];
    setCustomRoles(updatedRoles);
    localStorage.setItem('lms_custom_roles', JSON.stringify(updatedRoles));
    setIsAddRoleOpen(false);
    setNewRoleName('');
    setNewRoleDesc('');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
  };

  const handleDeleteRole = (roleId: string) => {
    if (window.confirm('Delete this custom role? Users assigned to this role will revert to base role.')) {
      const updated = customRoles.filter(r => r.id !== roleId);
      setCustomRoles(updated);
      localStorage.setItem('lms_custom_roles', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2 border border-purple-200">
            <ShieldCheck className="w-4 h-4 text-purple-600" /> Super Admin Security Workspace
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Role-Based Access Control (RBAC)</h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure granular module permissions, custom enterprise roles, and security access policies across institutes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-200"
            title="Reset to default policies"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button
            onClick={() => setIsAddRoleOpen(true)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-200"
          >
            <Plus className="w-4 h-4 text-blue-600" /> Create Custom Role
          </button>
          <button
            onClick={handleSaveMatrix}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-200 shadow-md ${
              hasUnsavedChanges
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse shadow-emerald-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            <Save className="w-4 h-4" /> Save RBAC Policy
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>RBAC Matrix & Custom Roles saved permanently to local storage and active tenant session!</span>
          </div>
          <button onClick={() => setSaveToast(false)} className="text-emerald-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-200 flex items-center gap-2 ${
            activeTab === 'matrix' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Lock className="w-4 h-4" /> Granular Permission Matrix
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-200 flex items-center gap-2 ${
            activeTab === 'roles' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" /> System & Custom Roles ({customRoles.length})
        </button>
        <button
          onClick={() => setActiveTab('audits')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-200 flex items-center gap-2 ${
            activeTab === 'audits' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Security Audit Log
        </button>
      </div>

      {activeTab === 'matrix' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-card overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Module Capability Matrix</span>
            <span className="text-[11px] text-gray-500">Legend: View (V) | Create (C) | Edit (E) | Delete (D) | Export (X)</span>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-gray-100 border-b border-gray-200 text-slate-900 font-bold sticky top-0 z-10">
                <tr>
                  <th className="p-3.5 w-64">System Module</th>
                  <th className="p-3.5 text-center bg-purple-50/70 border-x border-purple-100 text-purple-900">
                    <div className="flex items-center justify-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-purple-600" /> Super Admin
                    </div>
                    <div className="text-[9px] text-purple-500 font-mono mt-0.5">V &bull; C &bull; E &bull; D &bull; X</div>
                  </th>
                  <th className="p-3.5 text-center bg-blue-50/70 border-r border-blue-100 text-blue-900">
                    <div className="flex items-center justify-center gap-1">
                      <Building2 className="w-4 h-4 text-blue-600" /> Institute Admin
                    </div>
                    <div className="text-[9px] text-blue-500 font-mono mt-0.5">V &bull; C &bull; E &bull; D &bull; X</div>
                  </th>
                  <th className="p-3.5 text-center bg-emerald-50/70 border-r border-emerald-100 text-emerald-900">
                    <div className="flex items-center justify-center gap-1">
                      <BookOpen className="w-4 h-4 text-emerald-600" /> Faculty / Trainer
                    </div>
                    <div className="text-[9px] text-emerald-500 font-mono mt-0.5">V &bull; C &bull; E &bull; D &bull; X</div>
                  </th>
                  <th className="p-3.5 text-center bg-amber-50/70 text-amber-900">
                    <div className="flex items-center justify-center gap-1">
                      <GraduationCap className="w-4 h-4 text-amber-600" /> Student Portal
                    </div>
                    <div className="text-[9px] text-amber-500 font-mono mt-0.5">V &bull; C &bull; E &bull; D &bull; X</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {permissionsMatrix.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50/80 transition-200">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>{rule.moduleName}</div>
                      <span className="text-[10px] text-gray-400 font-normal">{rule.category}</span>
                    </td>

                    <td className="p-3.5 text-center bg-purple-50/20 border-x border-purple-100">
                      <div className="flex items-center justify-center gap-1.5">
                        {(['view', 'create', 'edit', 'delete', 'export'] as const).map((perm) => (
                          <button
                            key={perm}
                            onClick={() => togglePermission(rule.id, 'superAdmin', perm)}
                            className={`w-6 h-6 rounded text-[10px] font-bold uppercase transition-200 ${
                              rule.superAdmin[perm]
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                            }`}
                            title={`Super Admin ${perm}`}
                          >
                            {perm[0]}
                          </button>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 text-center bg-blue-50/20 border-r border-blue-100">
                      <div className="flex items-center justify-center gap-1.5">
                        {(['view', 'create', 'edit', 'delete', 'export'] as const).map((perm) => (
                          <button
                            key={perm}
                            onClick={() => togglePermission(rule.id, 'instituteAdmin', perm)}
                            className={`w-6 h-6 rounded text-[10px] font-bold uppercase transition-200 ${
                              rule.instituteAdmin[perm]
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                            }`}
                            title={`Institute Admin ${perm}`}
                          >
                            {perm[0]}
                          </button>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 text-center bg-emerald-50/20 border-r border-emerald-100">
                      <div className="flex items-center justify-center gap-1.5">
                        {(['view', 'create', 'edit', 'delete', 'export'] as const).map((perm) => (
                          <button
                            key={perm}
                            onClick={() => togglePermission(rule.id, 'faculty', perm)}
                            className={`w-6 h-6 rounded text-[10px] font-bold uppercase transition-200 ${
                              rule.faculty[perm]
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                            }`}
                            title={`Faculty ${perm}`}
                          >
                            {perm[0]}
                          </button>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 text-center bg-amber-50/20">
                      <div className="flex items-center justify-center gap-1.5">
                        {(['view', 'create', 'edit', 'delete', 'export'] as const).map((perm) => (
                          <button
                            key={perm}
                            onClick={() => togglePermission(rule.id, 'student', perm)}
                            className={`w-6 h-6 rounded text-[10px] font-bold uppercase transition-200 ${
                              rule.student[perm]
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                            }`}
                            title={`Student ${perm}`}
                          >
                            {perm[0]}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSaveMatrix}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-200 shadow-md shadow-blue-500/20"
            >
              <Save className="w-4 h-4" /> Save Permission Matrix
            </button>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customRoles.map((role) => (
            <div key={role.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card hover:shadow-md transition-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{role.name}</span>
                  {role.isSystem ? (
                    <Badge variant="info">SYSTEM DEFAULT</Badge>
                  ) : (
                    <Badge variant="success">CUSTOM ROLE</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{role.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400">Assigned Users: <strong className="text-slate-800">{role.userCount} Active</strong></span>
                <div className="flex items-center gap-2">
                  {!role.isSystem && (
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-200"
                      title="Delete Custom Role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg font-semibold text-slate-700">
                    Edit Scope
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'audits' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Realtime Security & RBAC Audit Stream</h3>
            <span className="text-xs text-gray-400 font-mono">Total 1,420 events logged</span>
          </div>
          <div className="divide-y divide-gray-100 text-xs">
            <div className="p-3.5 flex items-center justify-between hover:bg-gray-50">
              <div>
                <span className="font-bold text-slate-900">Modified Permission Matrix</span>
                <p className="text-gray-500 text-[11px] mt-0.5">Operator: superadmin@edupulse.org &bull; IP: 172.1.3.234</p>
              </div>
              <span className="text-gray-400 text-[11px]">Just now</span>
            </div>
            <div className="p-3.5 flex items-center justify-between hover:bg-gray-50">
              <div>
                <span className="font-bold text-slate-900">Created Custom Role: Teaching Assistant (TA)</span>
                <p className="text-gray-500 text-[11px] mt-0.5">Operator: superadmin@edupulse.org &bull; IP: 172.1.3.234</p>
              </div>
              <span className="text-gray-400 text-[11px]">1 hour ago</span>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isAddRoleOpen}
        onClose={() => setIsAddRoleOpen(false)}
        title="Define New Custom Enterprise Role"
      >
        <form onSubmit={handleCreateRole} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Role Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Finance Auditor / Lab Assistant"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Inherit Base Permission Model</label>
            <select
              value={newRoleBase}
              onChange={(e) => setNewRoleBase(e.target.value as any)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            >
              <option value="INSTITUTE_ADMIN">Institute Admin Model</option>
              <option value="FACULTY">Faculty / Trainer Model</option>
              <option value="STUDENT">Student Model</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Role Scope Description</label>
            <textarea
              rows={3}
              placeholder="Specify target capabilities and restrictions..."
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddRoleOpen(false)}
              className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-semibold text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              Save & Create Role
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
