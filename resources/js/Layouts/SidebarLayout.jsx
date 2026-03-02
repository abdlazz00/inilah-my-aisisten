import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, MessageSquareCode, Bot, Settings } from 'lucide-react'; // <--- TAMBAH IMPORT Settings

export default function SidebarLayout({ children }) {
    const { url } = usePage();

    // Menu navigasi
    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Persona Builder', href: '/personas', icon: MessageSquareCode },
        { name: 'Whitelist Kontak', href: '/contacts', icon: Users },
        { name: 'Pengaturan', href: '/settings', icon: Settings }, // <--- TAMBAHAN MENU PENGATURAN
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar Kiri */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <Bot className="w-6 h-6 text-indigo-600 mr-2" />
                    <span className="font-bold text-lg tracking-tight text-slate-900">My AIsisten</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
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
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                            A
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-slate-900">Admin</p>
                            <Link href="/logout" method="post" as="button" className="text-xs text-slate-500 hover:text-red-600">
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
