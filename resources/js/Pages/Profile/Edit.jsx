import SidebarLayout from '@/Layouts/SidebarLayout'; // Kita panggil Sidebar baru kita
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <SidebarLayout>
            <Head title="Profile Akun" />

            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile Akun</h1>
                    <p className="text-muted-foreground">Kelola informasi profil dan keamanan akun Anda.</p>
                </div>

                <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl border border-slate-100">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl border border-slate-100">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl border border-red-100">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </SidebarLayout>
    );
}
