import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, MessageSquareCode, Bot, Settings } from 'lucide-react';

export default function SidebarLayout({ children }) {
    const { url, props } = usePage();
    const { auth } = props; // Ambil data URL dan User yang sedang login

    // Menu navigasi dengan fitur Sub-menu
    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Persona Builder', href: '/personas', icon: MessageSquareCode },
        { name: 'Whitelist Kontak', href: '/contacts', icon: Users },
        {
            name: 'Pengaturan',
            icon: Settings,
            // Tambahkan subItems di sini
            subItems: [
                { name: 'Profile Akun', href: '/profile' },
                { name: 'Konfigurasi Sistem', href: '/settings' },
            ]
        },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar Kiri */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <Bot className="w-6 h-6 text-indigo-600 mr-2" />
                    <span className="font-bold text-lg tracking-tight text-slate-900">My AIsisten</span>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        // JIKA MENU MEMILIKI SUB-MENU (Pengaturan)
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

                        // JIKA MENU BIASA (TANPA SUB-MENU)
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

                {/* Profil User di Bawah Sidebar */}
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

            {/* Konten Utama Kanan */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
