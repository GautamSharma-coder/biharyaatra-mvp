"use client";
import React, { useState, useRef, useEffect } from 'react';

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'system';
};

export default function UserSupportPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can we help you today?", sender: 'system' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const newUserMessage: Message = {
            id: Date.now(),
            text: chatInput,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setChatInput('');

        // Simulate auto-reply
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    text: "Thanks for reaching out! A support agent will respond to you shortly.",
                    sender: 'system'
                }
            ]);
        }, 1000);
    };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto space-y-8 h-[calc(100vh-140px)] flex flex-col">
            <h2 className="text-3xl font-display font-black text-gray-900 mb-2 shrink-0">Support Center</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 min-h-[400px]">
                {/* Contact Info Widget */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center col-span-1 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-24 h-24 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner">
                        <i className="fas fa-headset"></i>
                    </div>
                    <h2 className="text-2xl font-black font-display text-gray-900 mb-3 tracking-tight">Need Help?</h2>
                    <p className="text-gray-500 mb-8 font-medium leading-relaxed">Our support team is available 24/7 to assist you with your journey and bookings.</p>
                    <a 
                        href="mailto:support@biharyaatra.com" 
                        className="bg-green-50 text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-100 transition-colors"
                    >
                        <i className="far fa-envelope mr-2"></i> support@biharyaatra.com
                    </a>
                </div>

                {/* Chat Interface */}
                <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-gray-100 col-span-1 md:col-span-2 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-6 shrink-0">
                        <div className="relative">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl">
                                <i className="fas fa-robot"></i>
                            </div>
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 leading-tight">BiharYaatra Support Assistant</h3>
                            <p className="text-xs text-green-600 font-bold mt-0.5">Online</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 p-4 lg:p-6 border border-gray-100 rounded-2xl bg-[#FAFAFA] mb-6 custom-scroll">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                <div className={`inline-block px-5 py-3.5 rounded-2xl text-sm max-w-[80%] md:max-w-[70%] font-medium shadow-sm 
                                     ${msg.sender === 'user' 
                                        ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-br-sm' 
                                        : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-3 shrink-0">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type your message..." 
                            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-medium outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900"
                        />
                        <button 
                            type="submit" 
                            disabled={!chatInput.trim()}
                            className="bg-gray-900 text-white w-14 lg:w-32 rounded-2xl hover:bg-orange-600 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2 group"
                        >
                            <span className="hidden lg:block font-bold text-sm">Send</span>
                            <i className="fas fa-paper-plane text-lg group-hover:translate-x-1 transition-transform"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
