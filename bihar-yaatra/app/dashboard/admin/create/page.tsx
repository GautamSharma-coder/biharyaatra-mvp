"use client";

import React, { useState, useMemo, useCallback } from 'react';

type SystemUser = {
    id: string;
    name: string;
    email: string;
    personalEmail?: string;
    role: string;
    phone?: string;
    status: string;
    createdAt: string;
};

type PasswordStrength = {
    score: number;
    color: string;
    label: string;
    textColor: string;
};

const MOCK_USERS: SystemUser[] = [
    { id: 'uid-a1b2c3d4', name: 'Super Admin', email: 'admin@biharyaatra.com', personalEmail: 'admin.personal@gmail.com', role: 'super_admin', phone: '+91 98765 00000', status: 'active', createdAt: '2025-01-01' },
    { id: 'uid-e5f6g7h8', name: 'Ramesh Kumar', email: 'ramesh@biharyaatra.com', personalEmail: 'ramesh@gmail.com', role: 'homestay', phone: '+91 98765 11111', status: 'active', createdAt: '2025-06-15' },
    { id: 'uid-i9j0k1l2', name: 'Sanjay Verma', email: 'sanjay@biharyaatra.com', role: 'transport', phone: '+91 87654 22222', status: 'active', createdAt: '2025-07-20' },
    { id: 'uid-m3n4o5p6', name: 'Priya Sinha', email: 'priya@biharyaatra.com', personalEmail: 'priya.sinha@gmail.com', role: 'guide', phone: '+91 76543 33333', status: 'active', createdAt: '2025-08-10' },
    { id: 'uid-q7r8s9t0', name: 'Bihar Regional Admin', email: 'regional@biharyaatra.com', role: 'admin', status: 'active', createdAt: '2025-03-01' },
];

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
    const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedPwd, setGeneratedPwd] = useState('');

    // Form state
    const [form, setForm] = useState({
        name: '', email: '', gmail: '', password: '', phone: '', role: 'admin', showPassword: false
    });
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, color: 'bg-gray-600', label: '', textColor: 'text-gray-500' });

    // Modal state
    const [modal, setModal] = useState<{ show: boolean; type: string; title: string; body: string; btnLabel: string; confirmText: string; onConfirm: () => void }>({
        show: false, type: '', title: '', body: '', btnLabel: 'Confirm', confirmText: '', onConfirm: () => { }
    });

    // Toast
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warn' }>({ show: false, message: '', type: 'success' });

    // Audit log
    const [auditLog, setAuditLog] = useState<{ time: string; type: string; msg: string }[]>([
        { time: new Date().toLocaleTimeString(), type: 'info', msg: 'Session started' }
    ]);

    const log = useCallback((type: string, msg: string) => {
        setAuditLog(prev => [{ time: new Date().toLocaleTimeString(), type, msg }, ...prev]);
    }, []);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'warn') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    }, []);

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
        log('info', 'Strong password auto-generated');
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
        log('info', `Creating identity for ${form.email}...`);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const newUser: SystemUser = {
            id: 'uid-' + Math.random().toString(36).substring(2, 10),
            name: form.name,
            email: form.email,
            personalEmail: form.gmail,
            role: form.role,
            phone: form.phone,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
        };

        setUsers(prev => [newUser, ...prev]);
        showToast(`✅ ${form.name} registered as ${form.role}!`, 'success');
        log('info', `Identity created: ${form.email} (${form.role})`);
        setForm({ name: '', email: '', gmail: '', password: '', phone: '', role: 'admin', showPassword: false });
        setPasswordStrength({ score: 0, color: 'bg-gray-600', label: '', textColor: 'text-gray-500' });
        setGeneratedPwd('');
        setLoading(false);
    };

    const confirmDelete = (user: SystemUser) => {
        setModal({
            show: true, type: 'delete',
            title: 'Delete Identity',
            body: `Permanently remove "${user.name}" (${user.email})? This cannot be undone.`,
            btnLabel: 'Delete',
            confirmText: '',
            onConfirm: () => {
                setUsers(prev => prev.filter(u => u.id !== user.id));
                showToast(`🗑️ ${user.name} removed.`, 'warn');
                log('warn', `Identity deleted: ${user.email}`);
                setModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    const confirmRoleChange = (user: SystemUser, newRole: string) => {
        if (newRole === user.role) return;
        setModal({
            show: true, type: 'role',
            title: 'Change Role',
            body: `Change ${user.name} from "${user.role}" to "${newRole}"?`,
            btnLabel: 'Confirm',
            confirmText: '',
            onConfirm: () => {
                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
                showToast(`Role updated for ${user.name}.`, 'success');
                log('info', `Role changed: ${user.email} → ${newRole}`);
                setModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    const getRoleColor = (role: string) => {
        if (role === 'super_admin') return 'bg-gradient-to-br from-orange-500 to-red-500';
        if (role === 'admin') return 'bg-gradient-to-br from-blue-500 to-indigo-600';
        if (role === 'homestay') return 'bg-gradient-to-br from-amber-400 to-orange-500';
        if (role === 'transport') return 'bg-gradient-to-br from-cyan-500 to-blue-500';
        return 'bg-gradient-to-br from-green-500 to-emerald-600';
    };

    const getRoleBadge = (role: string) => {
        if (role === 'super_admin') return 'bg-orange-100 text-orange-600 border border-orange-200';
        if (role === 'admin') return 'bg-blue-100 text-blue-600 border border-blue-200';
        if (role === 'homestay') return 'bg-amber-100 text-amber-600 border border-amber-200';
        if (role === 'transport') return 'bg-cyan-100 text-cyan-600 border border-cyan-200';
        return 'bg-green-100 text-green-600 border border-green-200';
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="flex-1 flex h-full overflow-hidden">
            {/* Left Sidebar — Create Form */}
            <aside className="w-80 bg-white border-r border-gray-100 flex flex-col shrink-0 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <i className="fas fa-shield-halved text-orange-400"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-mono text-orange-400 uppercase tracking-widest">Root Access</p>
                            <p className="font-display font-bold text-sm text-white">Identity Manager</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-xs font-mono text-gray-500 leading-relaxed">
                        <i className="fas fa-terminal text-orange-400 mr-2"></i>
                        Operator: <span className="text-orange-600">admin@biharyaatra.com</span>
                    </div>
                </div>

                {/* Create Form */}
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
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Personal Gmail <span className="text-orange-500">*</span></label>
                            <input type="email" value={form.gmail} onChange={e => setForm(prev => ({ ...prev, gmail: e.target.value }))} required placeholder="personal@gmail.com"
                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm outline-none focus:border-orange-500 transition placeholder-gray-400" />
                            <p className="text-[10px] text-gray-400 mt-1"><i className="fas fa-info-circle mr-1"></i>Used for recovery & contact only.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Official Login Email <span className="text-orange-500">*</span></label>
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
                                <option value="super_admin">⚡ Super Admin (Root)</option>
                                <option value="admin">🛡️ Regional Admin</option>
                                <option value="homestay">🏠 Homestay Partner</option>
                                <option value="transport">🚕 Transport Partner</option>
                                <option value="guide">🚩 Tour Guide</option>
                            </select>
                            {form.role === 'super_admin' && (
                                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 items-start">
                                    <i className="fas fa-exclamation-triangle text-red-500 mt-0.5 text-xs"></i>
                                    <p className="text-[10px] text-red-600 font-bold">You are granting ROOT-level access. This user will have unrestricted control over all system data.</p>
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

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="font-display font-bold text-gray-900">Active System Users</h1>
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
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Regional Admin</option>
                            <option value="homestay">Homestay</option>
                            <option value="transport">Transport</option>
                            <option value="guide">Guide</option>
                        </select>
                    </div>
                </header>

                {/* Users Grid */}
                <div className="flex-1 overflow-y-auto p-8">
                    {filteredUsers.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <i className="fas fa-users-slash text-3xl mb-3"></i>
                            <p className="text-sm">No users match your search.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {filteredUsers.map(user => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onDelete={confirmDelete}
                                onRoleChange={confirmRoleChange}
                                getRoleColor={getRoleColor}
                                getRoleBadge={getRoleBadge}
                                formatDate={formatDate}
                                showToast={showToast}
                                log={log}
                            />
                        ))}
                    </div>

                    {/* Audit Log */}
                    <div className="mt-8">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fas fa-scroll text-orange-400"></i> Session Audit Log
                        </h2>
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 font-mono text-xs space-y-2 max-h-48 overflow-y-auto shadow-sm">
                            {auditLog.map((entry, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="text-gray-400 shrink-0">{entry.time}</span>
                                    <span className={entry.type === 'error' ? 'text-red-500' : entry.type === 'warn' ? 'text-amber-500' : 'text-green-500'}>
                                        [{entry.type.toUpperCase()}]
                                    </span>
                                    <span className="text-gray-700">{entry.msg}</span>
                                </div>
                            ))}
                            {auditLog.length === 0 && <div className="text-gray-400">No activity yet in this session.</div>}
                        </div>
                    </div>
                </div>
            </main>

            {/* Confirmation Modal */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModal(prev => ({ ...prev, show: false }))}>
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto ${modal.type === 'delete' ? 'bg-red-50' : 'bg-amber-50'}`}>
                            <i className={`text-2xl ${modal.type === 'delete' ? 'fas fa-trash-alt text-red-500' : 'fas fa-user-shield text-amber-500'}`}></i>
                        </div>
                        <h3 className="font-bold text-xl text-center mb-2">{modal.title}</h3>
                        <p className="text-gray-500 text-sm text-center mb-6">{modal.body}</p>
                        {modal.type === 'delete' && (
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Type <span className="text-red-500 font-mono">DELETE</span> to confirm</label>
                                <input type="text" value={modal.confirmText} onChange={e => setModal(prev => ({ ...prev, confirmText: e.target.value }))}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-red-500 outline-none focus:border-red-500" />
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button onClick={() => setModal(prev => ({ ...prev, show: false }))} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition">Cancel</button>
                            <button onClick={modal.onConfirm} disabled={modal.type === 'delete' && modal.confirmText !== 'DELETE'}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition disabled:opacity-30 ${modal.type === 'delete' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}>
                                {modal.btnLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-[100] max-w-sm w-full animate-in slide-in-from-right duration-300">
                    <div className={`flex items-start gap-3 p-4 rounded-2xl border shadow-2xl ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                        <i className={`mt-0.5 ${toast.type === 'success' ? 'fas fa-check-circle text-green-500' : toast.type === 'error' ? 'fas fa-times-circle text-red-500' : 'fas fa-exclamation-triangle text-amber-500'}`}></i>
                        <p className="text-sm font-bold">{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// User Card sub-component
function UserCard({ user, onDelete, onRoleChange, getRoleColor, getRoleBadge, formatDate, showToast, log }: {
    user: SystemUser;
    onDelete: (user: SystemUser) => void;
    onRoleChange: (user: SystemUser, newRole: string) => void;
    getRoleColor: (role: string) => string;
    getRoleBadge: (role: string) => string;
    formatDate: (date: string) => string;
    showToast: (msg: string, type: 'success' | 'error' | 'warn') => void;
    log: (type: string, msg: string) => void;
}) {
    const [showPwdPanel, setShowPwdPanel] = useState(false);
    const [newPass, setNewPass] = useState('');
    const [pwdStrength, setPwdStrength] = useState<PasswordStrength>({ score: 0, color: '', label: '', textColor: '' });

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shrink-0 ${getRoleColor(user.role)}`}>
                        {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">{user.name || 'Unnamed User'}</h3>
                        <p className="text-xs font-mono text-gray-500">{user.email}</p>
                        {user.personalEmail && <p className="text-xs text-gray-400 font-mono">↳ {user.personalEmail}</p>}
                    </div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${getRoleBadge(user.role)}`}>{user.role?.replace('_', ' ')}</span>
            </div>

            <div className="flex items-center gap-4 mb-4 text-[10px] font-mono text-gray-400">
                <span><i className="fas fa-fingerprint mr-1"></i>{user.id.substring(0, 12)}...</span>
                <span><i className="fas fa-clock mr-1"></i>{formatDate(user.createdAt)}</span>
                <span className="ml-auto flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span className="text-green-600">{user.status}</span>
                </span>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="relative flex-1">
                    <select defaultValue={user.role} onChange={e => onRoleChange(user, e.target.value)}
                        className="w-full text-xs font-bold bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 outline-none focus:border-orange-500 cursor-pointer appearance-none">
                        <option value="super_admin">⚡ Super Admin</option>
                        <option value="admin">🛡️ Admin</option>
                        <option value="homestay">🏠 Homestay</option>
                        <option value="transport">🚕 Transport</option>
                        <option value="guide">🚩 Guide</option>
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-2.5 text-gray-400 text-[10px] pointer-events-none"></i>
                </div>
                <button onClick={() => setShowPwdPanel(!showPwdPanel)} title="Password Management"
                    className={`w-9 h-9 flex items-center justify-center rounded-xl border transition ${showPwdPanel ? 'bg-blue-50 text-blue-500 border-blue-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-blue-500'}`}>
                    <i className="fas fa-key text-xs"></i>
                </button>
                <button onClick={() => onDelete(user)} title="Delete Identity"
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition">
                    <i className="fas fa-trash-alt text-xs"></i>
                </button>
            </div>

            {showPwdPanel && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-3">
                        <i className="fas fa-lock text-orange-400 mr-1"></i>Password Management
                    </p>
                    <div className="space-y-3">
                        <div>
                            <input type="password" value={newPass} onChange={e => { setNewPass(e.target.value); setPwdStrength(calcStrength(e.target.value)); }}
                                placeholder="New password (min 8 chars)"
                                className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono outline-none focus:border-orange-500 transition" />
                            <div className="mt-1.5 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${pwdStrength.color}`} style={{ width: `${pwdStrength.score}%` }}></div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { showToast(`Password updated for ${user.name}`, 'success'); log('info', `Password force-updated: ${user.email}`); setShowPwdPanel(false); setNewPass(''); }}
                                disabled={newPass.length < 8}
                                className="flex-1 py-2 bg-gray-100 text-gray-800 text-xs font-bold rounded-xl hover:bg-orange-500 hover:text-white transition disabled:opacity-30">
                                <i className="fas fa-bolt mr-1"></i>Force Update
                            </button>
                            <button onClick={() => { showToast(`Reset link sent to ${user.email}`, 'success'); log('info', `Password reset email sent: ${user.email}`); setShowPwdPanel(false); }}
                                className="flex-1 py-2 bg-gray-50 text-gray-600 border border-gray-200 text-xs font-bold rounded-xl hover:bg-gray-100 transition">
                                <i className="fas fa-envelope mr-1"></i>Send Reset Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
