"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/components/providers/AuthProvider';

interface SystemUser {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    created_at: string;
    avatar_url?: string;
}

export default function SystemUsersPage() {
    const { user: admin } = useAuth();
    const [users, setUsers] = useState<SystemUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [toast, setToast] = useState<{ show: boolean; message: string; type: string }>({ show: false, message: '', type: 'success' });

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
            setLoading(false);
        }
    };

    const showToast = (message: string, type: string = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await apiClient.patch(`/auth/users/${userId}/role`, { role: newRole });
            showToast(`User role updated to "${newRole}"`);
            await fetchUsers();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            showToast(error.response?.data?.error || 'Failed to update role', 'error');
        }
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) return;
        try {
            await apiClient.delete(`/auth/users/${userId}`);
            showToast(`User "${userName}" deleted successfully`);
            await fetchUsers();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            showToast(error.response?.data?.error || 'Failed to delete user', 'error');
        }
    };

    const filtered = users.filter(u => {
        const q = search.toLowerCase();
        const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
        const matchRole = !filterRole || u.role === filterRole;
        return matchSearch && matchRole;
    });

    const roleColors: Record<string, string> = {
        superadmin: 'bg-red-50 text-red-700 border-red-100',
        admin: 'bg-purple-50 text-purple-700 border-purple-100',
        provider: 'bg-blue-50 text-blue-700 border-blue-100',
        traveller: 'bg-green-50 text-green-700 border-green-100',
    };

    const roleIcons: Record<string, string> = {
        superadmin: 'fas fa-crown text-red-500',
        admin: 'fas fa-shield-alt text-purple-500',
        provider: 'fas fa-store text-blue-500',
        traveller: 'fas fa-user text-green-500',
    };

    const roleCounts = {
        total: users.length,
        traveller: users.filter(u => u.role === 'traveller').length,
        provider: users.filter(u => u.role === 'provider').length,
        admin: users.filter(u => u.role === 'admin' || u.role === 'superadmin').length,
    };

    return (
        <>
            <header className="h-16 bg-white border-b border-gray-100 flex justify-between items-center px-8 shadow-sm z-10 shrink-0">
                <h2 className="text-xl font-bold font-display">System Users</h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{filtered.length} of {users.length} users</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scroll">
                <div className="animate-fade-in max-w-7xl mx-auto space-y-6">

                    {/* Toast */}
                    {toast.show && (
                        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-3 animate-fade-in ${
                            toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                            <i className={`fas ${toast.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                            {toast.message}
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Users</p>
                            <h3 className="text-3xl font-display font-bold text-gray-900">{roleCounts.total}</h3>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-green-500 font-bold uppercase mb-1">Travellers</p>
                            <h3 className="text-3xl font-display font-bold text-green-600">{roleCounts.traveller}</h3>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-blue-500 font-bold uppercase mb-1">Providers</p>
                            <h3 className="text-3xl font-display font-bold text-blue-600">{roleCounts.provider}</h3>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-purple-500 font-bold uppercase mb-1">Admins</p>
                            <h3 className="text-3xl font-display font-bold text-purple-600">{roleCounts.admin}</h3>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name, email, or ID..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-orange-500 outline-none font-medium text-sm"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={e => setFilterRole(e.target.value)}
                            className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-orange-500 outline-none font-bold text-sm cursor-pointer min-w-[160px]"
                        >
                            <option value="">All Roles</option>
                            <option value="traveller">Traveller</option>
                            <option value="provider">Provider</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">Super Admin</option>
                        </select>
                    </div>

                    {/* Users Table */}
                    {loading ? (
                        <div className="flex items-center justify-center min-h-64 bg-white border border-gray-100 rounded-2xl">
                            <i className="fas fa-spinner fa-spin text-3xl text-orange-500"></i>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-users text-gray-300 text-2xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No users found</h3>
                            <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">User</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Email</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Role</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Joined</th>
                                            {admin?.role === 'superadmin' && (
                                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(u => (
                                            <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                                                            {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-800 text-sm">{u.name || 'Unnamed'}</p>
                                                            <p className="text-[10px] text-gray-400 font-mono">{u.id.substring(0, 8)}...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${roleColors[u.role] || 'bg-gray-100 text-gray-600'}`}>
                                                        <i className={roleIcons[u.role] || 'fas fa-user text-gray-400'}></i>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500">
                                                    {new Date(u.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                {admin?.role === 'superadmin' && (
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                defaultValue={u.role}
                                                                onChange={e => handleRoleChange(u.id, e.target.value)}
                                                                className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-orange-500 cursor-pointer"
                                                            >
                                                                <option value="traveller">Traveller</option>
                                                                <option value="provider">Provider</option>
                                                                <option value="admin">Admin</option>
                                                                <option value="superadmin">Super Admin</option>
                                                            </select>
                                                            {u.id !== admin.id && (
                                                                <button
                                                                    onClick={() => handleDeleteUser(u.id, u.name || u.email)}
                                                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition text-xs"
                                                                    title="Delete user"
                                                                >
                                                                    <i className="fas fa-trash-alt"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
