import { useState } from 'react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Switch } from '@/Components/ui/switch';
import { Bot, Users, MessageSquareCode, MessageCircle, Activity, ArrowRight, Zap, Sparkles } from 'lucide-react';

export default function Dashboard({ auth, stats, recentContacts }) {

    // State Laporan Ajudan
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

    const toggleAi = () => {
        router.post('/settings/toggle-ai', {}, { preserveScroll: true });
    };

    // Fungsi panggil AI perangkum
    const generateSummary = async () => {
        setIsSummarizing(true);
        try {
            const response = await axios.get('/dashboard/summarize');
            setSummary(response.data.summary);
        } catch (error) {
            setSummary('Gagal mengambil laporan dari server. Cek koneksi API.');
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <SidebarLayout>
            <Head title="Dashboard Overview" />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Welcome & Master Switch */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Halo, {auth.user.name}! 👋
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Berikut adalah ringkasan performa My AIsisten hari ini.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <div className="flex flex-col text-sm text-right">
                            <span className="font-semibold text-slate-900">Master Engine AI</span>
                            <span className={`text-xs font-medium ${stats?.ai_status ? 'text-green-600' : 'text-slate-500'}`}>
                                {stats?.ai_status ? 'Menjawab Otomatis' : 'AI Sedang Tidur'}
                            </span>
                        </div>
                        <Switch
                            checked={stats?.ai_status}
                            onCheckedChange={toggleAi}
                            className="scale-110"
                        />
                    </div>
                </div>

                {/* 4 Kartu Statistik */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Status Engine AI</CardTitle>
                            <Bot className={`w-5 h-5 ${stats?.ai_status ? 'text-green-500' : 'text-slate-400'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">
                                {stats?.ai_status ? 'Aktif' : 'Nonaktif'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats?.ai_status ? 'Siap membalas WhatsApp' : 'Tidak ada balasan otomatis'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Total Persona</CardTitle>
                            <MessageSquareCode className="w-5 h-5 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{stats?.total_personas || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Kepribadian AI tersimpan</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Whitelist Kontak</CardTitle>
                            <Users className="w-5 h-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{stats?.total_contacts || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Orang yang dilayani AI</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Total Interaksi</CardTitle>
                            <MessageCircle className="w-5 h-5 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{stats?.total_messages || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Pesan WA masuk & keluar</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    {/* Tabel Mini: Kontak Terbaru */}
                    <Card className="lg:col-span-4 border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                                Kontak Terakhir Ditambahkan
                            </CardTitle>
                            <CardDescription>
                                5 kontak terbaru yang masuk ke dalam whitelist Anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {(!recentContacts || recentContacts.length === 0) ? (
                                    <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed rounded-xl border-slate-200">
                                        Belum ada kontak di whitelist.
                                    </div>
                                ) : (
                                    recentContacts.map((contact) => (
                                        <div key={contact.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold uppercase ring-1 ring-indigo-100">
                                                    {contact.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                                                    <p className="text-xs text-slate-500">{contact.phone_number}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wider ${contact.is_active ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10'}`}>
                                                    {contact.is_active ? 'AI Aktif' : 'AI Mati'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jalan Pintas & Banner Info */}
                    <Card className="lg:col-span-3 border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Tindakan Cepat</CardTitle>
                            <CardDescription>Jalan pintas mengelola asisten Anda.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link href={route('contacts.index')} className="block">
                                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">Ke Whitelist Kontak</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">Izinkan kontak & intip Spy Mode</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </Link>

                            <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-lg border border-slate-700">
                                <Zap className="w-32 h-32 absolute -right-6 -bottom-6 text-white opacity-5" />
                                <div className="relative z-10 flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <h3 className="font-semibold text-sm tracking-wide text-slate-200 uppercase">Sistem Berjalan Mulus</h3>
                                </div>
                                <h4 className="font-bold text-lg relative z-10">Asisten Siap Tempur!</h4>
                                <p className="text-sm text-slate-400 mt-2 relative z-10 leading-relaxed">
                                    Biarkan My AIsisten yang membalas pesan saat Anda sibuk.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ============================================================== */}
                {/* FITUR BARU: LAPORAN AJUDAN */}
                {/* ============================================================== */}
                <Card className="border-indigo-100 shadow-sm bg-indigo-50/30 overflow-hidden">
                    <CardHeader className="bg-white border-b border-indigo-50 pb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="flex items-center text-lg text-indigo-900">
                                    <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                                    Summary Hari Ini
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Malas baca log Spy Mode satu per satu? Biar AI yang merangkum semua obrolanmu hari ini.
                                </CardDescription>
                            </div>
                            <Button
                                onClick={generateSummary}
                                disabled={isSummarizing}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                            >
                                {isSummarizing ? (
                                    <><span className="animate-pulse mr-2">⏳</span> Menyusun Laporan...</>
                                ) : (
                                    <><Bot className="w-4 h-4 mr-2" /> Buat Laporan Hari Ini</>
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {summary ? (
                            <div className="p-5 bg-white border border-indigo-100 rounded-xl text-sm leading-relaxed whitespace-pre-wrap font-medium text-slate-700 shadow-sm">
                                {summary}
                            </div>
                        ) : (
                            <div className="py-8 text-center border-2 border-dashed border-indigo-200 rounded-xl bg-white">
                                <Bot className="w-10 h-10 text-indigo-300 mx-auto mb-3 opacity-50" />
                                <p className="text-slate-500 font-medium">Laporan belum di-generate.</p>
                                <p className="text-xs text-slate-400 mt-1">Klik tombol di atas untuk mendapatkan rangkuman obrolan hari ini.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </SidebarLayout>
    );
}
