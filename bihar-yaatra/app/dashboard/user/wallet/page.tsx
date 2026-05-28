"use client";
import React from 'react';

export default function UserWalletPage() {
    const user = {
        name: 'Traveler',
        balance: '4,500'
    };

    const transactions = [
        { id: 1, type: 'credit', desc: 'Added via UPI', date: '2h ago', amount: '2,000' },
        { id: 2, type: 'debit', desc: 'Bodh Gaya Booking', date: 'Yesterday', amount: '1,500' },
        { id: 3, type: 'credit', desc: 'Refund: Cancelled Trip', date: '3d ago', amount: '4,000' }
    ];

    return (
        <div className="animate-fade-in max-w-6xl mx-auto space-y-8">
            <h2 className="text-3xl font-display font-black text-gray-900 mb-2">My Wallet</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Credit Card */}
                <div className="bg-linear-to-br from-gray-900 via-gray-800 to-black text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden h-64 flex flex-col justify-between hover:shadow-gray-900/40 transition-shadow duration-300 transform hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-medium tracking-wide">Total Balance</p>
                            <h3 className="text-4xl lg:text-5xl font-display font-black mt-2 tracking-tight">₹{user.balance}</h3>
                        </div>
                        <i className="fab fa-cc-visa text-5xl opacity-50 mix-blend-overlay"></i>
                    </div>
                    <div className="relative z-10 pt-8 border-t border-white/10 mt-auto">
                        <p className="tracking-widest font-mono text-xl mb-4 opacity-90 drop-shadow-md">**** **** **** 4291</p>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Card Holder</p>
                                <p className="font-bold text-sm tracking-wide">{user.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Expires</p>
                                <p className="font-bold text-sm tracking-wide">12/28</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Recent Transactions */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-display font-black text-xl text-gray-900">Recent Transactions</h3>
                        <button className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">View All</button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scroll pr-2 -mr-2 max-h-60">
                        {transactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-[1.25rem] transition-colors border hover:border-gray-100 group cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 duration-300 ${tx.type === 'debit' ? 'bg-red-500' : 'bg-green-500'}`}>
                                        <i className={tx.type === 'debit' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}></i>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{tx.desc}</p>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">{tx.date}</p>
                                    </div>
                                </div>
                                <span className={`font-black tracking-tight ${tx.type === 'debit' ? 'text-red-500' : 'text-green-500'}`}>
                                    {tx.type === 'debit' ? '-' : '+'} ₹{tx.amount}
                                </span>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <div className="text-center text-gray-400 text-sm py-8 font-medium">No transactions yet.</div>
                        )}
                    </div>
                    <button className="mt-4 w-full bg-gray-50 hover:bg-orange-50 text-gray-900 hover:text-orange-600 font-bold py-3.5 rounded-xl transition-colors border border-gray-100 hover:border-orange-100">
                        <i className="fas fa-plus mr-2"></i> Add Money to Wallet
                    </button>
                </div>
            </div>
        </div>
    );
}
