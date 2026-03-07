import { Head, useForm, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Save, BrainCircuit } from 'lucide-react';

export default function SettingsIndex({ settings }) {
    // Tangkap webhook_url dari props (Inertia otomatis mengirimnya dari SettingController)
    const { webhook_url } = usePage().props;

    const { data, setData, post, processing } = useForm({
        groq_api_key: settings.groq_api_key || '',
        fonnte_token: settings.fonnte_token || '',
        owner_phone: settings.owner_phone || '',
        bot_phone: settings.bot_phone || '',
        memory_vault: settings.memory_vault || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/settings', { preserveScroll: true });
    };

    return (
        <SidebarLayout>
            <Head title="Pengaturan Sistem" />
            <div className="max-w-4xl mx-auto space-y-8 pb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Konfigurasi Sistem</h1>
                    <p className="text-muted-foreground">Kelola API Key, Token, dan Basis Pengetahuan (Memory) AI Anda.</p>
                </div>

                {/* 🌟 KOTAK INFO WEBHOOK URL 🌟 */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                    <h3 className="text-sm font-bold text-blue-800 mb-1">URL Webhook Fonnte Anda:</h3>
                    <p className="text-xs text-blue-600 mb-2">Copy dan paste link di bawah ini ke dashboard Fonnte Anda (Menu API/Webhook).</p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 block p-3 bg-white rounded border border-blue-100 text-sm font-mono text-gray-800 select-all">
                            {webhook_url}
                        </code>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>API & Integrasi</CardTitle>
                            <CardDescription>Kredensial untuk mengaktifkan fitur AI dan WhatsApp.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="groq_api_key">Groq API Key (Otak AI)</Label>
                                <Input id="groq_api_key" type="password" value={data.groq_api_key} onChange={e => setData('groq_api_key', e.target.value)} placeholder="gsk_..." />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fonnte_token">Fonnte Token (Penghubung WhatsApp)</Label>
                                <Input id="fonnte_token" type="password" value={data.fonnte_token} onChange={e => setData('fonnte_token', e.target.value)} placeholder="Masukkan token dari md.fonnte.com" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="owner_phone">No. WA Admin (Owner)</Label>
                                    <Input id="owner_phone" value={data.owner_phone} onChange={e => setData('owner_phone', e.target.value)} placeholder="Contoh: 62812345..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bot_phone">No. WA Bot (My AIsisten) 🤖</Label>
                                    <Input id="bot_phone" value={data.bot_phone} onChange={e => setData('bot_phone', e.target.value)} placeholder="Contoh: 19851959..." />
                                    <p className="text-[10px] text-muted-foreground mt-1">Wajib diisi untuk deteksi Mention @ di Grup WA</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-indigo-100 shadow-sm">
                        <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-4">
                            <CardTitle className="flex items-center text-indigo-800">
                                <BrainCircuit className="w-5 h-5 mr-2" /> Memory Vault (Buku Pintar)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <Textarea id="memory_vault" className="min-h-[200px] bg-slate-50 font-mono text-sm" value={data.memory_vault} onChange={e => setData('memory_vault', e.target.value)} placeholder="Masukkan memori..." />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end sticky bottom-6 z-10">
                        <Button type="submit" disabled={processing} className="shadow-lg shadow-indigo-200">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}
