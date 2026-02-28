import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

export default function PersonaBuilder({ activePersona, personas }) {
    // State untuk Form Upload & Extract
    const [file, setFile] = useState(null);
    const [targetName, setTargetName] = useState('Abdul Aziz');
    const [systemPrompt, setSystemPrompt] = useState(activePersona?.system_prompt || '');
    const [isLoading, setIsLoading] = useState(false);

    // State untuk Form Penyimpanan ke Database
    const [personaName, setPersonaName] = useState('');
    const [isGlobal, setIsGlobal] = useState(false);

    // Fungsi Extract memakai Axios (Bypass Inertia agar text 100% muncul)
    const handleExtract = async (e) => {
        e.preventDefault();
        if (!file || !targetName) return alert('Pilih file dan isi nama target dulu!');

        setIsLoading(true);

        const formData = new FormData();
        formData.append('chat_file', file);
        formData.append('target_name', targetName);

        try {
            const response = await axios.post('/personas/extract', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Masukkan data balasan langsung ke dalam kotak teks
            if (response.data.generated_prompt) {
                setSystemPrompt(response.data.generated_prompt);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            alert('Gagal mengekstrak: ' + errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk menyimpan System Prompt ke tabel personas
    const handleSavePrompt = () => {
        if (!personaName) return alert('Tuliskan Nama Persona terlebih dahulu!');
        if (!systemPrompt) return alert('System prompt masih kosong!');

        router.post('/personas/save', {
            name: personaName,
            system_prompt: systemPrompt,
            is_active: isGlobal
        }, {
            onSuccess: () => {
                alert('✅ Persona berhasil disimpan ke Database!');
                setPersonaName(''); // Kosongkan nama setelah sukses
            }
        });
    };

    // Fungsi untuk menghapus persona dari database
    const deletePersona = (id) => {
        if (confirm('Yakin ingin menghapus persona ini? Kontak yang memakainya akan otomatis kembali ke Persona Global.')) {
            router.delete(`/personas/${id}`, { preserveScroll: true });
        }
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

                    {/* Kolom Kanan: Hasil Prompt & Form Simpan */}
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

                            <div className="space-y-4 pt-4 border-t border-dashed">
                                <div className="space-y-2">
                                    <Label htmlFor="personaName">Simpan Sebagai (Nama Persona)</Label>
                                    <Input
                                        id="personaName"
                                        placeholder="Contoh: Gaya Asik Teman Kuliah"
                                        value={personaName}
                                        onChange={(e) => setPersonaName(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is-global"
                                        checked={isGlobal}
                                        onCheckedChange={setIsGlobal}
                                    />
                                    <Label htmlFor="is-global">Jadikan Persona Global (Default untuk semua kontak)</Label>
                                </div>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={handleSavePrompt}
                                    disabled={!systemPrompt}
                                >
                                    Simpan ke Database
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bagian Bawah: Tabel Daftar Persona */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Persona Tersimpan</CardTitle>
                        <CardDescription>Semua "kepribadian" AI yang sudah kamu buat.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Persona</TableHead>
                                    <TableHead>Status Global</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!personas || personas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            Belum ada persona yang tersimpan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    personas.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">{p.name}</TableCell>
                                            <TableCell>
                                                {p.is_active ? (
                                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                        ✅ Aktif (Global)
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                        Spesifik Kontak
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => deletePersona(p.id)}
                                                >
                                                    Hapus
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </SidebarLayout>
    );
}
