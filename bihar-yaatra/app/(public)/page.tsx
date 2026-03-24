"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/common/Hero";
import Features from "@/components/common/Features";
import Destinations from "@/components/destination/Destinations";
import TrendingPackages from "@/components/destination/TrendingPackages";
import Testimonials from "@/components/common/Testimonials";
import FAQ from "@/components/common/FAQ";
import SaarthiChat from "@/components/ai/SaarthiChat";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import Footer from "@/components/layout/Footer";

export default function Home() {
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    // Custom cursor dot logic matching Alpine @mousemove on body
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden relative">
            {/* Custom Cursor Dot (hidden on small screens) */}
            {mouseX > 0 && (
                <div 
                    className="cursor-dot hidden lg:block" 
                    style={{ left: `${mouseX}px`, top: `${mouseY}px` }} 
                ></div>
            )}

            <Navbar />
            <Hero />
            <Features />
            <Destinations />
            <TrendingPackages />
            <Testimonials />
            <FAQ />
            
            <SaarthiChat />
            <MobileBottomNav />
            <Footer />
        </main>
    );
}