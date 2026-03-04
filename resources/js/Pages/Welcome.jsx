import { Head, Link } from '@inertiajs/react';
import { Bot, MessageSquare, Users, Zap, Shield, ChevronRight } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to My AIsisten" />
            <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

                {/* Navbar */}
                <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-slate-200 bg-white/60 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Bot className="w-8 h-8" />
                        <span className="text-xl font-bold tracking-tight">Inilah My AIsisten</span>
                    </div>
                    <div>
                        {auth.user ? (
                            <Link href={route('dashboard')} className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                                Ke Dashboard
                            </Link>
                        ) : (
                            <div className="space-x-2 flex items-center">
                                <Link href={route('login')} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600 h-9 px-3 md:px-4 py-2 shadow-sm">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 h-9 px-3 md:px-4 py-2 shadow-sm">
                                    Daftar Gratis
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
                    <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-indigo-600 mb-6 shadow-sm">
                        <Zap className="w-4 h-4 mr-2 text-amber-500" />
                        <span className="font-medium">Kini didukung oleh Groq AI Llama-3!</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight text-slate-900">
                        Ubah WhatsApp Anda Menjadi <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Asisten Pintar Pribadi</span>
                    </h1>

                    <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
                        Tingkatkan interaksi Anda dengan AI yang mampu meniru persis gaya bahasa Anda. Balas pesan otomatis secara cerdas, hanya untuk orang-orang spesial di kontak Anda.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="inline-flex items-center justify-center rounded-lg text-base font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 h-12 px-8 shadow-md">
                                Buka Dashboard <ChevronRight className="ml-2 w-5 h-5" />
                            </Link>
                        ) : (
                            <>
                                <Link href={route('register')} className="inline-flex items-center justify-center rounded-lg text-base font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 h-12 px-8 shadow-md">
                                    Mulai Sekarang <ChevronRight className="ml-2 w-5 h-5" />
                                </Link>
                                <a href="#features" className="inline-flex items-center justify-center rounded-lg text-base font-medium transition-colors bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 h-12 px-8">
                                    Pelajari Lebih Lanjut
                                </a>
                            </>
                        )}
                    </div>
                </main>

                {/* Features Section */}
                <section id="features" className="py-24 bg-white border-t border-slate-100">
                    <div className="max-w-6xl mx-auto px-6 md:px-12">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Fitur Unggulan</h2>
                            <p className="mt-4 text-lg text-slate-500">Semua yang Anda butuhkan untuk membangun asisten AI idaman.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-indigo-100">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Persona Builder</h3>
                                <p className="text-slate-600 leading-relaxed">Ekstrak gaya bahasa Anda dari riwayat chat WhatsApp. AI akan membalas dengan kosakata, logat, dan candaan persis seperti Anda.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-indigo-100">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Whitelist Kontak</h3>
                                <p className="text-slate-600 leading-relaxed">Aman dari spam. AI hanya akan bekerja dan merespons nomor-nomor khusus yang sudah Anda setujui ke dalam daftar putih.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-indigo-100">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900">Multi-Persona</h3>
                                <p className="text-slate-600 leading-relaxed">Satu nomor, ragam kepribadian. Gunakan gaya formal untuk klien, dan gaya santai untuk teman. Atur secara spesifik per kontak.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-slate-900 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2 mb-4 text-slate-300">
                        <Bot className="w-6 h-6" />
                        <span className="text-xl font-bold tracking-tight">My AIsisten</span>
                    </div>
                    <p className="text-sm">© {new Date().getFullYear()} Inilah My AIsisten. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
