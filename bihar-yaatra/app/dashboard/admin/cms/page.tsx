"use client";
import React, { useState } from 'react';

export default function AdminCMSPage() {
    const [activeTab, setActiveTab] = useState<'packages' | 'destinations' | 'homestays'>('packages');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Using mock items for UI presentation
    const [items] = useState<any[]>([
        { id: 1, title: 'Bodh Gaya Retreat', description: 'A peaceful spiritual journey.', category: 'Spiritual', image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=800' }
    ]); 

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 md:px-8 shrink-0">
                <div className="flex gap-6 h-full">
                    <button 
                        onClick={() => setActiveTab('packages')} 
                        className={`font-bold h-full border-b-2 transition-colors ${activeTab === 'packages' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                        Packages
                    </button>
                    <button 
                        onClick={() => setActiveTab('destinations')} 
                        className={`font-bold h-full border-b-2 transition-colors ${activeTab === 'destinations' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                        Destinations
                    </button>
                    <button 
                        onClick={() => setActiveTab('homestays')} 
                        className={`font-bold h-full border-b-2 transition-colors ${activeTab === 'homestays' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                        Homestays
                    </button>
                </div>
                <button onClick={openModal} className="bg-black hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-md flex items-center gap-2">
                    <i className="fas fa-plus"></i>
                    <span className="capitalize">Add {activeTab.slice(0, -1)}</span>
                </button>
            </header>

            <div className="flex-1 overflow-auto p-6 md:p-8 custom-scroll">
                
                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No {activeTab} found. Click "Add" to create one.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 group relative">
                                <div className="h-48 overflow-hidden bg-gray-100 relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-8 h-8 rounded-full bg-white text-blue-600 shadow-md flex items-center justify-center hover:bg-blue-50">
                                            <i className="fas fa-pencil-alt text-xs"></i>
                                        </button>
                                        <button className="w-8 h-8 rounded-full bg-white text-red-500 shadow-md flex items-center justify-center hover:bg-red-50">
                                            <i className="fas fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg leading-tight truncate pr-2">{item.title}</h3>
                                        {item.price && <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded-md">{item.price}</span>}
                                    </div>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                        {item.category && <span className="bg-gray-100 px-2 py-0.5 rounded">{item.category}</span>}
                                        {item.duration && <span className="bg-gray-100 px-2 py-0.5 rounded">{item.duration}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg capitalize">Add New {activeTab.slice(0, -1)}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-900">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scroll">
                            <p className="text-gray-500 text-sm mb-6">Create real forms connected to your Express API right here!</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title / Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition" placeholder="e.g. Royal Bodh Gaya Tour" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                    <textarea rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"></textarea>
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3">
                                <button onClick={closeModal} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">Cancel</button>
                                <button className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
