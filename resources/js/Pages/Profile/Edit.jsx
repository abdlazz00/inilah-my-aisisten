import { useState } from 'react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { User, KeyRound, ShieldAlert } from 'lucide-react'; // Import Ikon

export default function Edit({ mustVerifyEmail, status }) {
    // State untuk mendeteksi Tab mana yang sedang aktif
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <SidebarLayout>
            <Head title="Profile Akun" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile Akun</h1>
                    <p className="text-muted-foreground">Kelola informasi profil dan keamanan akun Anda.</p>
                </div>

                {/* --- MENU TABS NAVIGASI --- */}
                <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-[-1px]">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                            activeTab === 'profile'
                                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        <User className="w-4 h-4 mr-2" />
                        Informasi Umum
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                            activeTab === 'password'
                                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        <KeyRound className="w-4 h-4 mr-2" />
                        Keamanan & Password
                    </button>
                    <button
                        onClick={() => setActiveTab('danger')}
                        className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                            activeTab === 'danger'
                                ? 'border-red-600 text-red-700 bg-red-50/50 rounded-t-lg'
                                : 'border-transparent text-slate-500 hover:text-red-600 hover:border-red-300'
                        }`}
                    >
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        Danger Zone
                    </button>
                </div>

                {/* --- KONTEN TABS --- */}
                <div className="pt-2">

                    {/* Konten 1: Informasi Umum */}
                    {activeTab === 'profile' && (
                        <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl border border-slate-100">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                    )}

                    {/* Konten 2: Keamanan & Password */}
                    {activeTab === 'password' && (
                        <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl border border-slate-100">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>
                    )}

                    {/* Konten 3: Danger Zone */}
                    {activeTab === 'danger' && (
                        <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl border border-red-100">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    )}

                </div>
            </div>
        </SidebarLayout>
    );
}
