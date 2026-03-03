import { Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea'; // <--- Import Textarea
import { Save, BrainCircuit } from 'lucide-react';

export default function SettingsIndex({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        groq_api_key: settings.groq_api_key || '',
        fonnte_token: settings.fonnte_token || '',
        owner_phone: settings.owner_phone || '',
        memory_vault: settings.memory_vault || '', // <--- State Baru
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* CARD 1: API & TOKEN */}
                    <Card>
                        <CardHeader>
                            <CardTitle>API & Integrasi</CardTitle>
                            <CardDescription>
                                Kredensial untuk mengaktifkan fitur AI dan WhatsApp.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="groq_api_key">Groq API Key (Otak AI)</Label>
                                <Input
                                    id="groq_api_key"
                                    type="password"
                                    value={data.groq_api_key}
                                    onChange={e => setData('groq_api_key', e.target.value)}
                                    placeholder="gsk_..."
                                />
                                <p className="text-xs text-muted-foreground">Dapatkan dari console.groq.com</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fonnte_token">Fonnte Token (Penghubung WhatsApp)</Label>
                                <Input
                                    id="fonnte_token"
                                    type="password"
                                    value={data.fonnte_token}
                                    onChange={e => setData('fonnte_token', e.target.value)}
                                    placeholder="Masukkan token dari md.fonnte.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="owner_phone">Nomor WhatsApp Admin (Owner)</Label>
                                <Input
                                    id="owner_phone"
                                    value={data.owner_phone}
                                    onChange={e => setData('owner_phone', e.target.value)}
                                    placeholder="Contoh: 628123456789"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* CARD 2: MEMORY VAULT */}
                    <Card className="border-indigo-100 shadow-sm">
                        <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-4">
                            <CardTitle className="flex items-center text-indigo-800">
                                <BrainCircuit className="w-5 h-5 mr-2" /> Memory Vault (Buku Pintar)
                            </CardTitle>
                            <CardDescription className="text-indigo-600/80">
                                Masukkan fakta-fakta penting yang AI harus tahu, seperti jadwal kuliah, daftar harga project, atau alamat rumah.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="memory_vault">Data Pengetahuan Global</Label>
                                <Textarea
                                    id="memory_vault"
                                    className="min-h-[200px] bg-slate-50 font-mono text-sm"
                                    value={data.memory_vault}
                                    onChange={e => setData('memory_vault', e.target.value)}
                                    placeholder={`Contoh:\n- Jadwal Kuliah: Senin 08:00 (Basis Data), Selasa 10:00 (Web Dev)\n- Harga SaaS Laundry: Rp 2.500.000 / tahun\n- Pacar saat ini: Belum ada (sedang PDKT dengan ...)`}
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Tips: Gunakan format list (bullet points) agar AI lebih mudah membaca data.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* TOMBOL SIMPAN GLOBAL */}
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
