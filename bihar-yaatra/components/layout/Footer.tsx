import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10 rounded-t-[3rem] mt-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="font-display font-bold text-2xl tracking-tighter flex items-center gap-2 mb-6">
                            Bihar<span className="text-orange-500">Yaatra</span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed mb-6 gap-x-0">
                            Rediscover the land of enlightenment. We are dedicated to showcasing the true beauty and history of Bihar to the world.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/profile.php?id=61582069628622" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://www.instagram.com/biharyaatra?igsh=MXc5MGJneDhwNGJzNw==" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://x.com/biharyaatra" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition">
                                <i className="fab fa-twitter"></i>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 font-display">Destinations</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link href="#" className="hover:text-orange-400 transition">Bodh Gaya</Link></li>
                            <li><Link href="#" className="hover:text-orange-400 transition">Nalanda University</Link></li>
                            <li><Link href="#" className="hover:text-orange-400 transition">Rajgir Hills</Link></li>
                            <li><Link href="#" className="hover:text-orange-400 transition">Valmiki Nagar</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 font-display">Company</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link href="/about" className="hover:text-orange-400 transition">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-orange-400 transition">Contact</Link></li>
                            <li><Link href="/guide-support" className="hover:text-orange-400 transition">Become a Guide</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-orange-400 transition">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 font-display">Newsletter</h4>
                        <p className="text-gray-400 mb-4">Subscribe for seasonal offers and travel tips.</p>
                        <form className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-orange-500 transition"
                                suppressHydrationWarning
                            />
                            <button type="button" className="px-4 py-3 bg-gradient text-white font-bold rounded-xl hover:opacity-90 transition" suppressHydrationWarning>
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    &copy; 2025 Bihar Yaatra. Proudly Made in Bihar.
                </div>
            </div>
        </footer>
    );
}
