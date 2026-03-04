import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Key, Webhook, MessageSquareCode, Users, ExternalLink } from 'lucide-react';

export default function Documentation({ auth }) {
    return (
        <SidebarLayout>
            <Head title="Panduan Penggunaan" />

            <div className="max-w-4xl mx-auto pb-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Panduan Penggunaan</h1>
                    <p className="text-slate-500 mt-1">Langkah-langkah lengkap mengatur My AIsisten Anda agar dapat beroperasi maksimal.</p>
                </div>

                <div className="space-y-8">
                    {/* 1. API KEY GROQ */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-4">
                                <Key className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">1. Mendapatkan Groq API Key</h2>
                        </div>
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                            Groq adalah "otak" AI yang kita gunakan. Anda wajib memiliki API Key agar bot dapat berpikir dan membalas pesan.
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-2">
                            <li>Buka <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline inline-flex items-center">console.groq.com <ExternalLink className="w-3 h-3 ml-1"/></a> dan login/daftar.</li>
                            <li>Masuk ke menu <strong>API Keys</strong>.</li>
                            <li>Klik tombol <strong>Create API Key</strong>.</li>
                            <li>Copy kunci rahasia yang muncul (simpan baik-baik karena hanya muncul sekali).</li>
                            <li>Buka menu <strong>Pengaturan &gt; Konfigurasi Sistem</strong> di aplikasi ini, lalu paste kunci tersebut ke kolom <strong>Groq API Key</strong>.</li>
                        </ol>
                    </section>

                    {/* 2. FONNTE TOKEN */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-4">
                                <Webhook className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">2. Menghubungkan WhatsApp (Fonnte)</h2>
                        </div>
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                            Fonnte adalah jembatan (Gateway) yang menghubungkan sistem ini dengan aplikasi WhatsApp di HP Anda.
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-2">
                            <li>Buka <a href="https://md.fonnte.com/" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline inline-flex items-center">md.fonnte.com <ExternalLink className="w-3 h-3 ml-1"/></a> dan login.</li>
                            <li>Masuk ke menu <strong>Device</strong>, lalu scan QR Code dengan WhatsApp Anda (Tautkan Perangkat).</li>
                            <li>Masuk ke menu <strong>API/Webhook</strong>.</li>
                            <li>Copy teks panjang di bagian <strong>Token</strong>. Paste ke kolom <strong>Fonnte Token</strong> di menu <strong>Konfigurasi Sistem</strong> aplikasi ini.</li>
                            <li>Masih di Fonnte, isi kolom Webhook URL dengan format: <code className="bg-slate-100 px-2 py-0.5 rounded text-pink-600">http://IP_VPS_ANDA/api/fonnte</code>, lalu klik Save.</li>
                        </ol>
                    </section>

                    {/* 3. PERSONA BUILDER */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4">
                                <MessageSquareCode className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">3. Membuat Persona (Karakter AI)</h2>
                        </div>
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                            Agar AI tidak membalas seperti robot kaku, Anda harus membuat Persona. Persona menentukan gaya bahasa, logat, dan batas pengetahuan bot.
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-2">
                            <li>Masuk ke menu <strong>Persona Builder</strong>.</li>
                            <li>Klik tombol <strong>Buat Persona Baru</strong>.</li>
                            <li>Isi Nama Persona (Misal: "Gaya Asik" atau "CS Formal").</li>
                            <li>Isi <strong>System Prompt</strong> dengan instruksi jelas. <em>Contoh: "Kamu adalah Aziz, mahasiswa IT yang suka membalas dengan kata 'bre' dan santai. Jangan pernah menyebut dirimu AI."</em></li>
                            <li>Simpan Persona.</li>
                        </ol>
                    </section>

                    {/* 4. WHITELIST KONTAK */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                                <Users className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">4. Menambahkan Whitelist Kontak</h2>
                        </div>
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                            Demi keamanan dan menghemat kuota API, bot hanya akan merespons pesan dari nomor yang ada di daftar Whitelist.
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-2">
                            <li>Masuk ke menu <strong>Whitelist Kontak</strong>.</li>
                            <li>Klik tombol <strong>Tambah Kontak Baru</strong>.</li>
                            <li>Masukkan Nomor WA tujuan. <strong>Wajib menggunakan format 62</strong> (Contoh: 628123456789).</li>
                            <li>Tentukan <strong>Persona</strong> spesifik yang akan aktif khusus untuk kontak tersebut.</li>
                            <li>Klik Simpan. Sekarang bot siap melayani kontak tersebut!</li>
                        </ol>
                    </section>
                </div>
            </div>
        </SidebarLayout>
    );
}
