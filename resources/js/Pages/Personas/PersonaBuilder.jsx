import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function PersonaBuilder({ activePersona }) {
    const [file, setFile] = useState(null);
    const [targetName, setTargetName] = useState('Abdul Aziz'); // Default namamu
    const [systemPrompt, setSystemPrompt] = useState(activePersona?.system_prompt || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleExtract = (e) => {
        e.preventDefault();
        if (!file || !targetName) return alert('Pilih file dan isi nama target dulu!');

        setIsLoading(true);

        router.post('/personas/extract', {
            chat_file: file,
            target_name: targetName,
        }, {
            forceFormData: true,
            onSuccess: (page) => {
                if (page.props.flash?.generated_prompt) {
                    setSystemPrompt(page.props.flash.generated_prompt);
                }
                setIsLoading(false);
            },
            onError: () => {
                alert('Gagal mengekstrak chat. Pastikan formatnya benar dan API Key OpenAI valid.');
                setIsLoading(false);
            }
        });
    };

    const handleSavePrompt = () => {
        router.post('/personas/save', {
            name: 'Persona Utama',
            system_prompt: systemPrompt,
            is_active: true
        }, {
            onSuccess: () => alert('✅ Persona berhasil disimpan & diaktifkan!')
        });
    };

    return (
        <SidebarLayout>
            <Head title="Persona Builder" />
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Persona Builder</h1>
                    <p className="text-muted-foreground">Latih AI dengan gaya bahasamu sendiri dari file export WhatsApp.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Kolom Kiri: Form Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Upload Chat WhatsApp</CardTitle>
                            <CardDescription>Pilih file .txt hasil export chat dari WA (tanpa media).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleExtract} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="targetName">Nama Kamu di Chat</Label>
                                    <Input
                                        id="targetName"
                                        value={targetName}
                                        onChange={(e) => setTargetName(e.target.value)}
                                        placeholder="Contoh: Abdul Aziz"
                                    />
                                    <p className="text-xs text-muted-foreground">Sistem akan mengambil pesan milik nama ini saja.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="chatFile">File .txt Chat</Label>
                                    <Input
                                        id="chatFile"
                                        type="file"
                                        accept=".txt"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </div>

                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? 'Menganalisis Gaya Bahasa...' : 'Extract & Generate AI Prompt'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Kolom Kanan: Hasil Prompt */}
                    <Card>
                        <CardHeader>
                            <CardTitle>2. System Prompt (The Brain)</CardTitle>
                            <CardDescription>Hasil analisis AI. Kamu bisa mengeditnya manual sebelum disimpan.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                className="min-h-[200px]"
                                placeholder="Prompt akan muncul di sini setelah proses ekstraksi selesai..."
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                            />
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={handleSavePrompt}
                                disabled={!systemPrompt}
                            >
                                Simpan Persona
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SidebarLayout>
    );
}
