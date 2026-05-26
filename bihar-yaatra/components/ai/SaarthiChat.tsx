"use client";
import React, { useState, useRef, useEffect } from "react";
// Assuming you have an action that returns text.
import { askSaarthi } from "@/app/actions";

type UserMessage = { role: "user"; text: string };
type AssistantMessage = { role: "assistant"; text?: string; displayedText: string };
type ChatMessage = UserMessage | AssistantMessage;

export default function SaarthiChat() {
    const [saarthiSidebar, setSaarthiSidebar] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    const formatMessage = (text: string) => {
        if (!text) return '';
        let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-gray-900'>$1</strong>");
        formatted = formatted.replace(/^\* (.*)/gm, "<div class='flex gap-2 ml-1 my-1'><span>•</span><span>$1</span></div>");
        return `<div class="prose prose-sm prose-gray max-w-none break-words">${formatted.replace(/\n/g, '<br/>')}</div>`;
    };

    const typeMessage = async (fullText: string, indexToUpdate: number) => {
        let currentText = '';
        const words = fullText.split(' ');
        for (let i = 0; i < words.length; i++) {
            currentText += words[i] + ' ';
            setChatHistory(prev => {
                const newHistory = [...prev];
                if (newHistory[indexToUpdate]) {
                    newHistory[indexToUpdate].displayedText = formatMessage(currentText);
                }
                return newHistory;
            });

            // Auto-scroll as text grows
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }

            await new Promise(resolve => setTimeout(resolve, 30)); // Typing speed
        }
    };

    const sendMessage = async (textOveride?: string) => {
        const textToUse = textOveride || userInput;
        if (!textToUse.trim() || isLoading) return;

        // Push user message
        setChatHistory(prev => [...prev, { role: 'user', text: textToUse }]);
        setUserInput("");
        setIsLoading(true);

        try {
            // Wait for response via fetch/action
            const aiResponse = await askSaarthi(textToUse);
            if (!aiResponse.ok) {
                throw new Error(aiResponse.error);
            }
            const response = aiResponse.text;

            // Push empty assistant message
            setChatHistory(prev => {
                return [...prev, { role: 'assistant', text: response, displayedText: '' }];
            });

            setIsLoading(false);

            // Wait for React to render the new state item before typing effect
            setTimeout(() => {
                typeMessage(response, chatHistory.length + 1); // +1 because we just pushed 'user' and 'assistant' simultaneously
            }, 50);

        } catch {
            setIsLoading(false);
            setChatHistory(prev => [...prev, { role: 'assistant', displayedText: 'I apologize, I am having trouble connecting. Please try again.' }]);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, saarthiSidebar]);

    return (
        <>
            {/* Sidebar toggle button (Fixed separately so it doesn't take flex space for the drawer) */}
            <div className={`fixed inset-y-0 right-0 z-[9997] flex items-center pointer-events-none transition-opacity duration-300 ${saarthiSidebar ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                <button
                    onClick={() => setSaarthiSidebar(true)}
                    className="pointer-events-auto bg-gray-900 text-white py-6 px-2 rounded-l-2xl shadow-2xl flex flex-col items-center gap-4 transition-all hover:pr-4 group border-y border-l border-white/10"
                >
                    <i className="fas fa-robot text-orange-500 group-hover:scale-110 transition-transform"></i>
                    <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">Saarthi AI</span>
                </button>
            </div>

            {/* Overlay for clicking outside */}
            <div
                onClick={() => setSaarthiSidebar(false)}
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-500 ${saarthiSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            ></div>

            {/* Sidebar window */}
            <div
                className={`fixed top-0 bottom-0 right-0 z-[9999] w-full md:w-[400px] bg-white shadow-2xl flex flex-col transform transition-transform duration-500 will-change-transform ${saarthiSidebar ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="font-display font-bold text-xl text-gray-900">Bihar Saarthi</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">AI Concierge Service</p>
                    </div>
                    <button onClick={() => setSaarthiSidebar(false)} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <i className="fas fa-times text-gray-400"></i>
                    </button>
                </div>

                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-hidden">
                    {chatHistory.length === 0 && (
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <div className="inline-block bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold">NAMASTE</div>
                                <h4 className="text-2xl font-display font-bold text-gray-900 leading-tight">Your Bihar journey starts here.</h4>
                            </div>

                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-sm text-gray-600 leading-relaxed italic">
                                &quot;I can help you coordinate transport to the Buddhist Circuit, find heritage stays, or explain the history of Nalanda.&quot;
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suggested Queries</p>
                                <button onClick={() => sendMessage("Tell me about the Mahabodhi Temple history")} className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-orange-500 hover:shadow-md transition-all group">
                                    <span className="text-sm font-semibold text-gray-900 text-left">Mahabodhi Temple History</span>
                                    <i className="fas fa-chevron-right text-xs text-gray-300 group-hover:text-orange-500"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    {chatHistory.map((msg, index) => (
                        <div key={index} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                            <div
                                className={`inline-block p-4 max-w-[90%] text-sm shadow-sm leading-relaxed text-left ${msg.role === 'user' ? 'bg-orange-500 text-white rounded-l-2xl rounded-tr-2xl' : 'bg-gray-100 text-gray-800 rounded-r-2xl rounded-tl-2xl border border-gray-200'}`}
                                dangerouslySetInnerHTML={{ __html: msg.role === 'user' ? formatMessage(msg.text) : (msg.displayedText || '') }}
                            ></div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="text-left">
                            <div className="bg-gray-100 p-4 rounded-r-2xl rounded-tl-2xl inline-block border border-gray-200">
                                <i className="fas fa-circle-notch animate-spin text-orange-500"></i>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 md:p-8 bg-white border-t border-gray-100">
                    <div className="relative">
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="Ask Saarthi anything..."
                            className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none resize-none text-gray-900"
                            rows={1}
                        ></textarea>
                        <button onClick={() => sendMessage()} className="absolute bottom-3 right-3 text-orange-500 hover:scale-110 transition-transform bg-white w-8 h-8 rounded-full shadow-sm border border-gray-100 flex items-center justify-center">
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
