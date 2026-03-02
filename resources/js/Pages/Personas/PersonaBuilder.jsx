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
import { Plus, ArrowLeft, Eye } from 'lucide-react'; // <-- Tambah ikon Eye

export default function PersonaBuilder({ activePersona, personas }) {
    const [isCreating, setIsCreating] = useState(false);
    const [editId, setEditId] = useState(null); // <-- State baru untuk nyimpen ID yang lagi diedit

    const [file, setFile] = useState(null);
    const [targetName, setTargetName] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [personaName, setPersonaName] = useState('');
    const [isGlobal, setIsGlobal] = useState(false);

    // Fungsi klik tombol "Buat Persona Baru"
    const handleCreateNew = () => {
        setEditId(null);
        setFile(null);
        setTargetName('');
        setSystemPrompt('');
        setPersonaName('');
        setIsGlobal(false);
        setIsCreating(true);
    };

    // Fungsi klik tombol "Detail / Edit" di tabel
    const handleEdit = (persona) => {
        setEditId(persona.id);
        setFile(null);
        setTargetName('');

        // Isi form dengan data dari database
        setSystemPrompt(persona.system_prompt);
        setPersonaName(persona.name);
        setIsGlobal(persona.is_active);

        setIsCreating(true); // Buka form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

    const handleSavePrompt = () => {
        if (!personaName) return alert('Tuliskan Nama Persona terlebih dahulu!');
        if (!systemPrompt) return alert('System prompt masih kosong!');

        const payload = {
            name: personaName,
            system_prompt: systemPrompt,
            is_active: isGlobal
        };

        // CEK: Apakah ini lagi ngedit atau bikin baru?
        if (editId) {
            router.put(`/personas/${editId}`, payload, {
                onSuccess: () => {
                    alert('✅ Persona berhasil diupdate!');
                    setIsCreating(false);
                }
            });
        } else {
            router.post('/personas/save', payload, {
                onSuccess: () => {
                    alert('✅ Persona baru berhasil disimpan!');
                    setIsCreating(false);
                }
            });
        }
    };

    const deletePersona = (id) => {
        if (confirm('Yakin ingin menghapus persona ini? Kontak yang memakainya akan otomatis kembali ke Persona Global.')) {
            router.delete(`/personas/${id}`, { preserveScroll: true });
        }
    };

    return (
        <SidebarLayout>
            <Head title="Persona Builder" />
            <div className="max-w-6xl mx-auto space-y-8">

                {!isCreating ? (
                    <>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Daftar Persona</h1>
                                <p className="text-muted-foreground">Kelola berbagai "kepribadian" AI yang sudah kamu buat.</p>
                            </div>
                            <Button onClick={handleCreateNew} className="flex items-center">
                                <Plus className="w-4 h-4 mr-2" />
                                Buat Persona Baru
                            </Button>
                        </div>

                        <Card>
                            <CardContent className="pt-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-1/4">Nama Persona</TableHead>
                                            <TableHead className="w-2/4">Isi Prompt (The Brain)</TableHead>
                                            <TableHead>Status Global</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {!personas || personas.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                    Belum ada persona yang tersimpan. Yuk buat baru!
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            personas.map((p) => (
                                                <TableRow key={p.id}>
                                                    <TableCell className="font-medium">{p.name}</TableCell>
                                                    <TableCell>
                                                        <p className="text-sm text-slate-500 line-clamp-2" title={p.system_prompt}>
                                                            {p.system_prompt}
                                                        </p>
                                                    </TableCell>
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
                                                        <div className="flex justify-end gap-2">
                                                            {/* TOMBOL EDIT/DETAIL BARU */}
                                                            <Button variant="outline" size="sm" onClick={() => handleEdit(p)}>
                                                                <Eye className="w-4 h-4 mr-1" /> Detail
                                                            </Button>
                                                            <Button variant="destructive" size="sm" onClick={() => deletePersona(p.id)}>
                                                                Hapus
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                {/* Judul berubah dinamis tergantung mode */}
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {editId ? 'Edit Detail Persona' : 'Persona Builder'}
                                </h1>
                                <p className="text-muted-foreground">
                                    {editId ? 'Baca, ubah nama, atau edit instruksi prompt persona ini.' : 'Latih AI dengan gaya bahasamu sendiri dari file export WhatsApp.'}
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => setIsCreating(false)} className="flex items-center">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali ke Daftar
                            </Button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Form Upload: Tetap dimunculkan buat jaga-jaga kalau mau nimpa/ekstrak ulang */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>1. Upload Chat WhatsApp</CardTitle>
                                    <CardDescription>Pilih file .txt hasil export chat dari WA (opsional untuk memperbarui gaya bahasa).</CardDescription>
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
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="chatFile">File .txt Chat</Label>
                                            <Input
                                                id="chatFile"
                                                type="file"
                                                accept=".txt"
                                                key={isCreating ? 'file-input-active' : 'file-input-inactive'}
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                        </div>
                                        <Button type="submit" disabled={isLoading} className="w-full">
                                            {isLoading ? 'Menganalisis Ulang...' : 'Extract & Timpa Prompt AI'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>2. System Prompt (The Brain)</CardTitle>
                                    <CardDescription>Instruksi otak AI. Kamu bebas mengubah teks ini secara manual.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Textarea
                                        className="min-h-[250px]"
                                        placeholder="Prompt AI akan tampil di sini..."
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
                                            {editId ? 'Simpan Perubahan (Update)' : 'Simpan ke Database'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </SidebarLayout>
    );
}
