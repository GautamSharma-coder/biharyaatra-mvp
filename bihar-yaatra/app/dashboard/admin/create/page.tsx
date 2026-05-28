"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/components/providers/AuthProvider';

type SystemUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    created_at: string;
};

type PasswordStrength = {
    score: number;
    color: string;
    label: string;
    textColor: string;
};

const calcStrength = (pwd: string): PasswordStrength => {
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (pwd.length >= 12) score += 15;
    if (/[A-Z]/.test(pwd)) score += 15;
    if (/[a-z]/.test(pwd)) score += 10;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
    score = Math.min(100, score);

    if (score < 30) return { score, color: 'bg-red-500', label: 'Weak', textColor: 'text-red-400' };
    if (score < 60) return { score, color: 'bg-amber-500', label: 'Fair', textColor: 'text-amber-400' };
    if (score < 80) return { score, color: 'bg-green-500', label: 'Good', textColor: 'text-green-400' };
    return { score, color: 'bg-emerald-500', label: 'Strong', textColor: 'text-emerald-400' };
};

export default function AdminCreatePage() {
    const { user: currentUser } = useAuth();
    const isSuperAdmin = currentUser?.role === 'superadmin';

    const [users, setUsers] = useState<SystemUser[]>([]);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(true);
    const [generatedPwd, setGeneratedPwd] = useState('');

    const [form, setForm] = useState({
        name: '', email: '', password: '', phone: '', role: 'admin', showPassword: false
    });
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, color: 'bg-gray-600', label: '', textColor: 'text-gray-500' });

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warn' }>({ show: false, message: '', type: 'success' });

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'warn') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    }, []);

    // Fetch all users
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await apiClient.get('/auth/users');
            setUsers(res.data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setFetchingUsers(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const q = search.toLowerCase();
            const matchSearch = !q || (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
            const matchRole = !filterRole || u.role === filterRole;
            return matchSearch && matchRole;
        });
    }, [users, search, filterRole]);

    const generatePassword = () => {
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&';
        const pwd = Array.from({ length: 16 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
        setForm(prev => ({ ...prev, password: pwd }));
        setPasswordStrength(calcStrength(pwd));
        setGeneratedPwd(pwd);
    };

    const handlePasswordChange = (value: string) => {
        setForm(prev => ({ ...prev, password: value }));
        setPasswordStrength(calcStrength(value));
    };

    const createUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordStrength.score < 50) {
            showToast('Password is too weak. Use a stronger password.', 'error');
            return;
        }
        setLoading(true);
        try {
            await apiClient.post('/auth/admin/create', {
                name: form.name,
                email: form.email,
                password: form.password,
                phone: form.phone,
                role: form.role,
            });
            showToast(`✅ ${form.name} registered as ${form.role}!`, 'success');
            setForm({ name: '', email: '', password: '', phone: '', role: 'admin', showPassword: false });
            setPasswordStrength({ score: 0, color: 'bg-gray-600', label: '', textColor: 'text-gray-500' });
            setGeneratedPwd('');
            await fetchUsers();
        } catch (err: any) {
            showToast(err.response?.data?.error || 'Failed to create user', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await apiClient.patch(`/auth/users/${userId}/role`, { role: newRole });
            showToast('Role updated successfully', 'success');
            await fetchUsers();
        } catch (err: any) {
            showToast(err.response?.data?.error || 'Failed to update role', 'error');
        }
    };

    const handleDelete = async (user: SystemUser) => {
        if (!confirm(`Permanently remove "${user.name}" (${user.email})? This cannot be undone.`)) return;
        try {
            await apiClient.delete(`/auth/users/${user.id}`);
            showToast(`🗑️ ${user.name} removed.`, 'warn');
            await fetchUsers();
        } catch (err: any) {
            showToast(err.response?.data?.error || 'Failed to delete user', 'error');
        }
    };

    const getRoleColor = (role: string) => {
        if (role === 'superadmin') return 'bg-linear-to-br from-orange-500 to-red-500';
        if (role === 'admin') return 'bg-linear-to-br from-blue-500 to-indigo-600';
        if (role === 'provider') return 'bg-linear-to-br from-amber-400 to-orange-500';
        return 'bg-linear-to-br from-green-500 to-emerald-600';
    };

    const getRoleBadge = (role: string) => {
        if (role === 'superadmin') return 'bg-orange-100 text-orange-600 border border-orange-200';
        if (role === 'admin') return 'bg-blue-100 text-blue-600 border border-blue-200';
        if (role === 'provider') return 'bg-amber-100 text-amber-600 border border-amber-200';
        return 'bg-green-100 text-green-600 border border-green-200';
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="flex-1 flex h-full overflow-hidden">
            {/* Left Sidebar — Create Form */}
            {isSuperAdmin && (
                <aside className="w-80 bg-white border-r border-gray-100 flex flex-col shrink-0 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="bg-linear-to-r from-gray-900 to-gray-800 rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <i className="fas fa-shield-halved text-orange-400"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-mono text-orange-400 uppercase tracking-widest">Root Access</p>
                                <p className="font-display font-bold text-sm text-white">Identity Manager</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fas fa-user-plus text-orange-400"></i> Create New Identity
                        </h2>

                        <form onSubmit={createUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Full Name</label>
                                <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} required placeholder="e.g. Amit Kumar"
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm outline-none focus:border-orange-500 transition placeholder-gray-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Email <span className="text-orange-500">*</span></label>
                                <input type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} required placeholder="user@biharyaatra.com"
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm outline-none focus:border-orange-500 transition placeholder-gray-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Password</label>
                                <div className="relative">
                                    <input type={form.showPassword ? 'text' : 'password'} value={form.password} onChange={e => handlePasswordChange(e.target.value)} required placeholder="Min 8 characters"
                                        className="w-full p-3 pr-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm outline-none focus:border-orange-500 transition font-mono placeholder-gray-400" />
                                    <button type="button" onClick={() => setForm(prev => ({ ...prev, showPassword: !prev.showPassword }))} className="absolute right-3 top-3.5 text-gray-400 hover:text-orange-500 transition">
                                        <i className={`fas text-xs ${form.showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                                <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-400 ${passwordStrength.color}`} style={{ width: `${passwordStrength.score}%` }}></div>
                                </div>
                                {passwordStrength.label && <p className={`text-[10px] mt-1 font-bold ${passwordStrength.textColor}`}>{passwordStrength.label}</p>}
                            </div>
                            <button type="button" onClick={generatePassword}
                                className="w-full py-2 rounded-xl border border-dashed border-gray-300 text-gray-500 text-xs font-bold hover:border-orange-500 hover:text-orange-500 transition flex items-center justify-center gap-2">
                                <i className="fas fa-dice"></i> Auto-Generate Strong Password
                            </button>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Phone (Optional)</label>
                                <input type="tel" value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="+91 98765 43210"
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm outline-none focus:border-orange-500 transition placeholder-gray-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">System Role</label>
                                <select value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm outline-none focus:border-orange-500 transition appearance-none cursor-pointer">
                                    <option value="superadmin">⚡ Super Admin (Root)</option>
                                    <option value="admin">🛡️ Regional Admin</option>
                                    <option value="provider">🏠 Provider / Partner</option>
                                    <option value="traveller">🧳 Traveller</option>
                                </select>
                                {form.role === 'superadmin' && (
                                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 items-start">
                                        <i className="fas fa-exclamation-triangle text-red-500 mt-0.5 text-xs"></i>
                                        <p className="text-[10px] text-red-600 font-bold">ROOT-level access. This user will have unrestricted control.</p>
                                    </div>
                                )}
                            </div>
                            <button type="submit" disabled={loading || passwordStrength.score < 50}
                                className="w-full py-4 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-2">
                                {loading ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <><i className="fas fa-user-plus mr-2"></i>Create Identity & Register</>}
                            </button>
                        </form>

                        {generatedPwd && (
                            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                                <p className="text-[10px] text-orange-600 font-bold uppercase mb-2"><i className="fas fa-key mr-1"></i>Generated Password — Copy now!</p>
                                <p className="font-mono text-green-700 text-xs break-all">{generatedPwd}</p>
                                <button onClick={() => { navigator.clipboard.writeText(generatedPwd); showToast('Copied!', 'success'); }} className="mt-2 text-[10px] text-gray-500 hover:text-gray-800 transition">
                                    <i className="fas fa-copy mr-1"></i>Copy to clipboard
                                </button>
                            </div>
                        )}
                    </div>
                </aside>
            )}

            {/* Main Content — User List */}
            <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="font-display font-bold text-gray-900">System Users</h1>
                        <span className="bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-2 py-1 rounded-lg">
                            {filteredUsers.length} / {users.length} shown
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                                className="w-56 pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl outline-none focus:border-orange-500 transition placeholder-gray-400" />
                        </div>
                        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
                            className="py-2 px-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl outline-none focus:border-orange-500 transition">
                            <option value="">All Roles</option>
                            <option value="superadmin">Super Admin</option>
                            <option value="admin">Admin</option>
                            <option value="provider">Provider</option>
                            <option value="traveller">Traveller</option>
                        </select>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {fetchingUsers ? (
                        <div className="flex items-center justify-center h-48">
                            <i className="fas fa-spinner fa-spin text-2xl text-orange-500"></i>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <i className="fas fa-users-slash text-3xl mb-3"></i>
                            <p className="text-sm">No users match your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {filteredUsers.map(user => (
                                <div key={user.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shrink-0 ${getRoleColor(user.role)}`}>
                                                {(user.name || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm">{user.name || 'Unnamed'}</h3>
                                                <p className="text-xs font-mono text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${getRoleBadge(user.role)}`}>{user.role}</span>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4 text-[10px] font-mono text-gray-400">
                                        <span><i className="fas fa-fingerprint mr-1"></i>{user.id.substring(0, 12)}...</span>
                                        <span><i className="fas fa-clock mr-1"></i>{formatDate(user.created_at)}</span>
                                        {user.phone && <span><i className="fas fa-phone mr-1"></i>{user.phone}</span>}
                                    </div>

                                    {isSuperAdmin && (
                                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                            <div className="relative flex-1">
                                                <select defaultValue={user.role} onChange={e => handleRoleChange(user.id, e.target.value)}
                                                    className="w-full text-xs font-bold bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 outline-none focus:border-orange-500 cursor-pointer appearance-none">
                                                    <option value="superadmin">⚡ Super Admin</option>
                                                    <option value="admin">🛡️ Admin</option>
                                                    <option value="provider">🏠 Provider</option>
                                                    <option value="traveller">🧳 Traveller</option>
                                                </select>
                                                <i className="fas fa-chevron-down absolute right-3 top-2.5 text-gray-400 text-[10px] pointer-events-none"></i>
                                            </div>
                                            <button onClick={() => handleDelete(user)} title="Delete Identity"
                                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition">
                                                <i className="fas fa-trash-alt text-xs"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Toast */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-100 max-w-sm w-full animate-in slide-in-from-right duration-300">
                    <div className={`flex items-start gap-3 p-4 rounded-2xl border shadow-2xl ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                        <i className={`mt-0.5 ${toast.type === 'success' ? 'fas fa-check-circle text-green-500' : toast.type === 'error' ? 'fas fa-times-circle text-red-500' : 'fas fa-exclamation-triangle text-amber-500'}`}></i>
                        <p className="text-sm font-bold">{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
