import { Link } from '@inertiajs/react';
import { Bot } from 'lucide-react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-10 sm:pt-0 bg-slate-50">
            {/* Bagian Logo & Branding */}
            <div className="mb-8 text-center">
                <Link href="/" className="flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
                    <Bot className="w-14 h-14" />
                </Link>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Inilah My AIsisten</h1>
                <p className="text-sm text-slate-500 mt-1">Platform Asisten AI Cerdas Berbasis WhatsApp</p>
            </div>

            {/* Kotak Form */}
            <div className="w-full sm:max-w-md mt-2 px-8 py-10 bg-white shadow-xl sm:rounded-2xl border border-slate-100">
                {children}
            </div>
        </div>
    );
}
