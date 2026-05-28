"use client";
import React from 'react';

export default function CalendarPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight capitalize">Calendar</h1>
                <p className="text-gray-500 mt-2 font-medium">Manage your calendar information and settings here.</p>
            </header>

            <div className="bg-white rounded-4xl border border-gray-100 p-8 md:p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 text-3xl">
                    <i className="fas fa-hammer"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Under Construction</h2>
                <p className="text-gray-500 max-w-md mx-auto">This section of the Provider Panel is currently being built. Check back later for full functionality!</p>
            </div>
        </div>
    );
}
