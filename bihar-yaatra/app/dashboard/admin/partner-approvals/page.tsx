"use client";

import React, { useState } from 'react';

type PartnerRequest = {
    id: string;
    businessName: string;
    name: string;
    email: string;
    phone: string;
    partnerType: 'homestay' | 'transport' | 'guide';
    location: string;
    description?: string;
    rooms?: number;
    capacity?: number;
    vehicleType?: string;
    fleetSize?: number;
    languages?: string;
    speciality?: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    reviewedBy?: string;
    submittedAt?: string;
};

type Listing = {
    id: string;
    name: string;
    location: string;
    price: number;
    description?: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    reviewedBy?: string;
    submittedAt?: string;
    rooms?: string[];
    amenities?: string[];
};

const MOCK_REQUESTS: PartnerRequest[] = [
    { id: 'req-001', businessName: 'Ganges View Homestay', name: 'Ramesh Kumar', email: 'ramesh@gmail.com', phone: '+91 98765 43210', partnerType: 'homestay', location: 'Patna', description: 'Beautiful riverside heritage property with 5 rooms.', rooms: 5, capacity: 15, status: 'pending', submittedAt: '2025-12-10' },
    { id: 'req-002', businessName: 'Bihar Express Cabs', name: 'Sanjay Verma', email: 'sanjay@gmail.com', phone: '+91 87654 32100', partnerType: 'transport', location: 'Gaya', vehicleType: 'SUV', fleetSize: 8, status: 'pending', submittedAt: '2025-12-12' },
    { id: 'req-003', businessName: 'Heritage Walk Tours', name: 'Priya Sinha', email: 'priya@gmail.com', phone: '+91 76543 21000', partnerType: 'guide', location: 'Nalanda', languages: 'Hindi, English, Japanese', speciality: 'Buddhist Circuit', status: 'approved', reviewedBy: 'admin@biharyaatra.com', submittedAt: '2025-11-20' },
    { id: 'req-004', businessName: 'Village Retreat', name: 'Ankit Singh', email: 'ankit@gmail.com', phone: '+91 65432 10000', partnerType: 'homestay', location: 'Madhubani', rooms: 3, capacity: 8, status: 'rejected', rejectionReason: 'Incomplete property documents.', reviewedBy: 'admin@biharyaatra.com', submittedAt: '2025-11-15' },
];

const MOCK_LISTINGS: Listing[] = [
    { id: 'lst-001', name: 'Bodhi Tree Retreat', location: 'Bodh Gaya', price: 2200, description: 'A peaceful retreat near the Mahabodhi Temple with modern amenities.', status: 'pending', submittedAt: '2025-12-14', rooms: ['Deluxe', 'Standard'], amenities: ['WiFi', 'AC', 'Kitchen'] },
    { id: 'lst-002', name: 'Riverfront Cottage', location: 'Patna', price: 1500, description: 'Charming cottage with a view of the Ganges.', status: 'approved', reviewedBy: 'admin@biharyaatra.com', submittedAt: '2025-12-01' },
    { id: 'lst-003', name: 'Rural Farmhouse Stay', location: 'Muzaffarpur', price: 900, description: 'Authentic village experience with local food.', status: 'rejected', rejectionReason: 'Photos do not match listing description.', reviewedBy: 'admin@biharyaatra.com', submittedAt: '2025-11-28' },
];

export default function PartnerApprovalsPage() {
    const [viewMode, setViewMode] = useState<'partners' | 'listings'>('partners');
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
    const [listingTab, setListingTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
    const [requests, setRequests] = useState<PartnerRequest[]>(MOCK_REQUESTS);
    const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);

    // Reject modal
    const [rejectModal, setRejectModal] = useState<{ show: boolean; item: PartnerRequest | Listing | null; reason: string; type: 'partner' | 'listing' }>({ show: false, item: null, reason: '', type: 'partner' });
    // Approve modal
    const [approveModal, setApproveModal] = useState<{ show: boolean; applicant: PartnerRequest | null; loginEmail: string; password: string; done: boolean; working: boolean }>({ show: false, applicant: null, loginEmail: '', password: '', done: false, working: false });

    const filteredRequests = activeTab === 'all' ? requests : requests.filter(r => r.status === activeTab);
    const filteredListings = listingTab === 'all' ? listings : listings.filter(l => l.status === listingTab);
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const pendingListingCount = listings.filter(l => l.status === 'pending').length;

    const generatePwd = () => {
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
        return Array.from({ length: 12 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getTypeIcon = (type: string) => {
        if (type === 'homestay') return 'fas fa-home text-amber-400';
        if (type === 'transport') return 'fas fa-car text-blue-400';
        return 'fas fa-flag text-green-400';
    };

    const getTypeBg = (type: string) => {
        if (type === 'homestay') return 'bg-amber-500/10';
        if (type === 'transport') return 'bg-blue-500/10';
        return 'bg-green-500/10';
    };

    const getStatusBadge = (status: string) => {
        if (status === 'pending') return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
        if (status === 'approved') return 'bg-green-500/10 text-green-400 border border-green-500/30';
        return 'bg-red-500/10 text-red-400 border border-red-500/30';
    };

    const handleApprovePartner = (req: PartnerRequest) => {
        setApproveModal({ show: true, applicant: req, loginEmail: req.email, password: generatePwd(), done: false, working: false });
    };

    const confirmApprove = async () => {
        if (!approveModal.applicant) return;
        setApproveModal(prev => ({ ...prev, working: true }));
        await new Promise(resolve => setTimeout(resolve, 1500));
        setRequests(prev => prev.map(r => r.id === approveModal.applicant!.id ? { ...r, status: 'approved' as const, reviewedBy: 'admin@biharyaatra.com' } : r));
        setApproveModal(prev => ({ ...prev, working: false, done: true }));
    };

    const handleRejectPartner = (req: PartnerRequest) => {
        setRejectModal({ show: true, item: req, reason: '', type: 'partner' });
    };

    const confirmReject = () => {
        if (!rejectModal.item) return;
        if (rejectModal.type === 'partner') {
            setRequests(prev => prev.map(r => r.id === rejectModal.item!.id ? { ...r, status: 'rejected' as const, rejectionReason: rejectModal.reason, reviewedBy: 'admin@biharyaatra.com' } : r));
        } else {
            setListings(prev => prev.map(l => l.id === rejectModal.item!.id ? { ...l, status: 'rejected' as const, rejectionReason: rejectModal.reason, reviewedBy: 'admin@biharyaatra.com' } : l));
        }
        setRejectModal({ show: false, item: null, reason: '', type: 'partner' });
    };

    const approveListing = (lst: Listing) => {
        setListings(prev => prev.map(l => l.id === lst.id ? { ...l, status: 'approved' as const, reviewedBy: 'admin@biharyaatra.com' } : l));
    };

    const rejectListing = (lst: Listing) => {
        setRejectModal({ show: true, item: lst as any, reason: '', type: 'listing' });
    };

    const tabs = ['pending', 'approved', 'rejected', 'all'] as const;

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="font-display font-bold text-gray-900 text-lg">
                        {viewMode === 'listings' ? 'Listing Reviews' : 'Partner Applications'}
                    </h1>
                    <span className="bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-2 py-1 rounded-lg">
                        {viewMode === 'partners' ? `${pendingCount} pending` : `${pendingListingCount} pending`}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1 mr-4">
                        <button onClick={() => setViewMode('partners')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'partners' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                            <i className="fas fa-handshake mr-1 text-orange-400"></i> Partners
                            {pendingCount > 0 && <span className="ml-1 bg-orange-500 text-white text-[10px] px-1.5 rounded-full">{pendingCount}</span>}
                        </button>
                        <button onClick={() => setViewMode('listings')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'listings' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                            <i className="fas fa-home mr-1 text-green-400"></i> Listings
                            {pendingListingCount > 0 && <span className="ml-1 bg-green-500 text-white text-[10px] px-1.5 rounded-full">{pendingListingCount}</span>}
                        </button>
                    </div>

                    {/* Tab Filter */}
                    <div className="flex gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => viewMode === 'partners' ? setActiveTab(tab) : setListingTab(tab)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition ${(viewMode === 'partners' ? activeTab : listingTab) === tab ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {/* Partner Applications */}
                {viewMode === 'partners' && (
                    <div>
                        {filteredRequests.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                <i className="fas fa-inbox text-4xl mb-3"></i>
                                <p className="text-sm">No {activeTab === 'pending' ? 'pending' : activeTab} applications.</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                            {filteredRequests.map(req => (
                                <div key={req.id} className={`bg-white border rounded-2xl p-5 transition-all hover:shadow-md ${req.status === 'pending' ? 'border-gray-200' : req.status === 'approved' ? 'border-green-200' : 'border-red-200'}`}>
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${getTypeBg(req.partnerType)}`}>
                                                <i className={getTypeIcon(req.partnerType)}></i>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm">{req.businessName}</h3>
                                                <p className="text-gray-500 text-xs capitalize">{req.partnerType} • {req.location}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg shrink-0 ${getStatusBadge(req.status)}`}>{req.status}</span>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-1.5 mb-4 text-xs text-gray-500">
                                        <p><i className="fas fa-user w-4 text-gray-400"></i> {req.name}</p>
                                        <p><i className="fas fa-envelope w-4 text-gray-400"></i> <span className="font-mono">{req.email}</span></p>
                                        <p><i className="fas fa-phone w-4 text-gray-400"></i> {req.phone}</p>
                                        {req.description && <p><i className="fas fa-quote-left w-4 text-gray-400"></i> {req.description}</p>}
                                        {req.rooms && <p><i className="fas fa-bed w-4 text-gray-400"></i> {req.rooms} rooms, capacity {req.capacity}</p>}
                                        {req.vehicleType && <p><i className="fas fa-car w-4 text-gray-400"></i> {req.vehicleType} — {req.fleetSize} vehicles</p>}
                                        {req.languages && <p><i className="fas fa-language w-4 text-gray-400"></i> {req.languages}</p>}
                                        {req.speciality && <p><i className="fas fa-map-pin w-4 text-gray-400"></i> {req.speciality}</p>}
                                    </div>

                                    {req.status === 'rejected' && req.rejectionReason && (
                                        <div className="mb-3 p-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                                            <i className="fas fa-exclamation-circle mr-1"></i> Reason: {req.rejectionReason}
                                        </div>
                                    )}

                                    {req.reviewedBy && req.status !== 'pending' && (
                                        <p className="mb-3 text-[10px] text-gray-400 font-mono">
                                            <i className="fas fa-user-shield mr-1"></i>
                                            {req.status === 'approved' ? 'Approved' : 'Rejected'} by {req.reviewedBy}
                                        </p>
                                    )}

                                    <p className="text-[10px] text-gray-400 font-mono mb-4">
                                        <i className="fas fa-clock mr-1"></i> {formatDate(req.submittedAt)}
                                        <span className="ml-2 text-gray-300">ID: {req.id.substring(0, 8)}</span>
                                    </p>

                                    {req.status === 'pending' && (
                                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                                            <button onClick={() => handleApprovePartner(req)} className="flex-1 py-2.5 bg-green-50 border border-green-200 text-green-600 text-xs font-bold rounded-xl hover:bg-green-100 transition">
                                                <i className="fas fa-check mr-1"></i> Approve
                                            </button>
                                            <button onClick={() => handleRejectPartner(req)} className="flex-1 py-2.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition">
                                                <i className="fas fa-times mr-1"></i> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Listing Reviews */}
                {viewMode === 'listings' && (
                    <div>
                        {filteredListings.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                <i className="fas fa-home text-4xl mb-3"></i>
                                <p className="text-sm">No {listingTab === 'pending' ? 'pending' : listingTab} listings.</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                            {filteredListings.map(lst => (
                                <div key={lst.id} className={`bg-white border rounded-2xl p-5 transition-all hover:shadow-md ${lst.status === 'pending' ? 'border-amber-200' : lst.status === 'approved' ? 'border-green-200' : 'border-red-200'}`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{lst.name || 'Unnamed Property'}</h3>
                                            <p className="text-gray-500 text-xs mt-0.5">{lst.location} • ₹{lst.price}/night</p>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg shrink-0 ${getStatusBadge(lst.status)}`}>{lst.status}</span>
                                    </div>
                                    <div className="space-y-1 mb-3 text-xs text-gray-500">
                                        {lst.description && <p><i className="fas fa-align-left w-4 text-gray-400"></i> {lst.description.substring(0, 80)}{lst.description.length > 80 ? '...' : ''}</p>}
                                        {lst.rooms && lst.rooms.length > 0 && <p><i className="fas fa-bed w-4 text-gray-400"></i> {lst.rooms.length} room type(s)</p>}
                                        {lst.amenities && lst.amenities.length > 0 && <p><i className="fas fa-list-check w-4 text-gray-400"></i> {lst.amenities.join(', ')}</p>}
                                        {lst.submittedAt && <p><i className="fas fa-clock w-4 text-gray-400"></i> {formatDate(lst.submittedAt)}</p>}
                                    </div>
                                    {lst.status === 'rejected' && lst.rejectionReason && (
                                        <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                                            <i className="fas fa-exclamation-circle mr-1"></i> Reason: {lst.rejectionReason}
                                        </div>
                                    )}
                                    {lst.reviewedBy && (
                                        <p className="text-[10px] text-gray-400 font-mono mb-3">
                                            <i className="fas fa-user-shield mr-1"></i>
                                            {lst.status === 'approved' ? 'Approved' : 'Rejected'} by {lst.reviewedBy}
                                        </p>
                                    )}
                                    {lst.status === 'pending' && (
                                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                                            <button onClick={() => approveListing(lst)} className="flex-1 py-2.5 bg-green-50 border border-green-200 text-green-600 text-xs font-bold rounded-xl hover:bg-green-100 transition">
                                                <i className="fas fa-check mr-1"></i> Approve
                                            </button>
                                            <button onClick={() => rejectListing(lst)} className="flex-1 py-2.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition">
                                                <i className="fas fa-times mr-1"></i> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectModal.show && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setRejectModal({ show: false, item: null, reason: '', type: 'partner' })}>
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5 mx-auto">
                            <i className="fas fa-times text-red-500 text-xl"></i>
                        </div>
                        <h3 className="font-bold text-xl text-center mb-2">Reject {rejectModal.type === 'partner' ? 'Application' : 'Listing'}</h3>
                        <div className="mb-5">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reason (optional)</label>
                            <textarea
                                value={rejectModal.reason}
                                onChange={e => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                                rows={3}
                                placeholder="e.g. Incomplete documents, area not serviceable..."
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-red-500 resize-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setRejectModal({ show: false, item: null, reason: '', type: 'partner' })} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition">Cancel</button>
                            <button onClick={confirmReject} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition">
                                <i className="fas fa-times-circle mr-1"></i> Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Approve Modal */}
            {approveModal.show && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setApproveModal({ show: false, applicant: null, loginEmail: '', password: '', done: false, working: false })}>
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5 mx-auto">
                            <i className="fas fa-check text-green-500 text-xl"></i>
                        </div>
                        <h3 className="font-bold text-xl text-center mb-1">Approve Partner</h3>
                        <p className="text-gray-500 text-sm text-center mb-5">{approveModal.applicant?.name}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Login Email <span className="text-orange-500">*</span></label>
                                <input
                                    type="email"
                                    value={approveModal.loginEmail}
                                    onChange={e => setApproveModal(prev => ({ ...prev, loginEmail: e.target.value }))}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-green-500 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Set Initial Password <span className="text-orange-500">*</span></label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={approveModal.password}
                                        onChange={e => setApproveModal(prev => ({ ...prev, password: e.target.value }))}
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 font-mono outline-none focus:border-green-500"
                                    />
                                    <button type="button" onClick={() => setApproveModal(prev => ({ ...prev, password: generatePwd() }))} className="px-3 bg-gray-100 rounded-xl text-gray-500 hover:text-gray-800 transition" title="Generate">
                                        <i className="fas fa-dice"></i>
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Share these credentials with the partner after approval.</p>
                            </div>
                        </div>

                        {approveModal.done && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-xs">
                                <p className="text-green-700 font-bold mb-1">✅ Account Created! Share with partner:</p>
                                <p className="font-mono text-gray-800">Email: {approveModal.loginEmail}</p>
                                <p className="font-mono text-gray-800">Password: {approveModal.password}</p>
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setApproveModal({ show: false, applicant: null, loginEmail: '', password: '', done: false, working: false })} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
                                {approveModal.done ? 'Close' : 'Cancel'}
                            </button>
                            {!approveModal.done && (
                                <button
                                    onClick={confirmApprove}
                                    disabled={!approveModal.loginEmail || approveModal.password.length < 8 || approveModal.working}
                                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition disabled:opacity-40"
                                >
                                    {approveModal.working ? <><i className="fas fa-spinner fa-spin mr-1"></i> Creating...</> : <><i className="fas fa-user-plus mr-1"></i> Approve & Create</>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
