import { Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export default function SettingsIndex({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        groq_api_key: settings.groq_api_key || '',
        fonnte_token: settings.fonnte_token || '',
        owner_phone: settings.owner_phone || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/settings');
    };

    return (
        <SidebarLayout>
            <Head title="Pengaturan Sistem" />
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pengaturan Sistem</h1>
                    <p className="text-muted-foreground">Konfigurasi API Key dan Token untuk mengaktifkan fitur AI dan WhatsApp.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>API & Integrasi</CardTitle>
                        <CardDescription>
                            Data ini disimpan dengan aman di database. Kosongkan jika belum memiliki API Key.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                <p className="text-xs text-muted-foreground">Nomor ini bisa digunakan untuk menerima notifikasi sistem atau bypass aturan tertentu.</p>
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Konfigurasi'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </SidebarLayout>
    );
}
