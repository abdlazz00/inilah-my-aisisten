// abdlazz00/inilah-my-aisisten/inilah-my-aisisten-9404085dbc41017fe6b81e2296df251b30b802f2/resources/js/Layouts/SidebarLayout.jsx
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, MessageSquareCode, Bot, Settings, LogOut } from 'lucide-react';

export default function SidebarLayout({ children }) {
    const { url, props } = usePage();
    const { auth } = props;

    // State untuk memunculkan sub-menu "Pengaturan" di mobile
    const [showMobileSettings, setShowMobileSettings] = useState(false);

    // Menu navigasi dengan fitur Sub-menu
    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Persona Builder', href: '/personas', icon: MessageSquareCode },
        { name: 'Whitelist Kontak', href: '/contacts', icon: Users },
        {
            name: 'Pengaturan',
            icon: Settings,
            subItems: [
                { name: 'Profile Akun', href: '/profile' },
                { name: 'Konfigurasi Sistem', href: '/settings' },
            ]
        },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden relative">

            {/* =========================================
                1. MOBILE TOP HEADER (Hanya muncul di Mobile)
            ========================================= */}
            <header className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 h-14 fixed top-0 w-full z-30">
                <div className="flex items-center">
                    <Bot className="w-6 h-6 text-indigo-600 mr-2" />
                    <span className="font-bold text-lg tracking-tight text-slate-900">My AIsisten</span>
                </div>
                {/* Tombol Logout langsung di header untuk mobile */}
                <Link href={route('logout')} method="post" as="button" className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                    <LogOut className="w-5 h-5" />
                </Link>
            </header>

            {/* =========================================
                2. DESKTOP SIDEBAR (Sembunyi di Mobile)
            ========================================= */}
            <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col z-20">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <Bot className="w-6 h-6 text-indigo-600 mr-2" />
                    <span className="font-bold text-lg tracking-tight text-slate-900">Inilah My AIsisten</span>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        if (item.subItems) {
                            const isParentActive = item.subItems.some(sub => url.startsWith(sub.href));
                            return (
                                <div key={item.name} className="space-y-1 mb-2">
                                    <div className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium ${isParentActive ? 'text-slate-900' : 'text-slate-600'}`}>
                                        <Icon className={`w-5 h-5 mr-3 ${isParentActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        {item.name}
                                    </div>
                                    <div className="ml-9 space-y-1 border-l-2 border-slate-100 pl-2">
                                        {item.subItems.map(sub => {
                                            const isSubActive = url.startsWith(sub.href);
                                            return (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                        isSubActive
                                                            ? 'bg-indigo-50 text-indigo-700'
                                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                                    }`}
                                                >
                                                    {sub.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }

                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2.5 mb-1 rounded-md text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3 uppercase">
                            {auth?.user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="text-sm truncate pr-2">
                            <p className="font-medium text-slate-900 truncate">{auth?.user?.name || 'Admin'}</p>
                            <Link href={route('logout')} method="post" as="button" className="text-xs text-slate-500 hover:text-red-600">
                                Log out
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* =========================================
                3. MAIN CONTENT
            ========================================= */}
            {/* mt-14 mb-16 adalah ruang untuk header dan nav bawah di mobile */}
            <main className="flex-1 overflow-y-auto mt-14 mb-16 md:mt-0 md:mb-0">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>

            {/* =========================================
                4. MOBILE SUB-MENU POPUP (PENGATURAN)
            ========================================= */}
            {/* Background hitam transparan saat popup muncul */}
            {showMobileSettings && (
                <div
                    className="md:hidden fixed inset-0 bg-slate-900/20 z-30 transition-opacity"
                    onClick={() => setShowMobileSettings(false)}
                />
            )}

            {/* Modal popup-nya */}
            {showMobileSettings && (
                <div className="md:hidden fixed bottom-16 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-40 rounded-t-xl transition-all duration-300 ease-in-out">
                    <div className="p-3 space-y-1">
                        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                            <span>Pengaturan Menu</span>
                            <span className="text-[10px] font-normal lowercase">{auth?.user?.name}</span>
                        </div>
                        {navItems.find(i => i.name === 'Pengaturan').subItems.map(sub => {
                            const isSubActive = url.startsWith(sub.href);
                            return (
                                <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={() => setShowMobileSettings(false)}
                                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        isSubActive
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {sub.name}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* =========================================
                5. MOBILE BOTTOM NAVIGATION BAR
            ========================================= */}
            <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center h-16 z-40 pb-safe">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    // Kalau menu punya Sub-Menu (Pengaturan)
                    if (item.subItems) {
                        const isParentActive = item.subItems.some(sub => url.startsWith(sub.href));
                        return (
                            <button
                                key={item.name}
                                onClick={() => setShowMobileSettings(!showMobileSettings)}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                                    isParentActive || showMobileSettings ? 'text-indigo-600' : 'text-slate-500'
                                }`}
                            >
                                <Icon className={`w-6 h-6 ${isParentActive || showMobileSettings ? 'fill-indigo-50/50' : ''}`} />
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </button>
                        );
                    }

                    // Menu biasa
                    const isActive = url.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setShowMobileSettings(false)}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'fill-indigo-50/50' : ''}`} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

        </div>
    );
}
