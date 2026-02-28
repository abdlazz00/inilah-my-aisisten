import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

export default function ContactManager({ contacts, personas }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        phone_number: '',
        persona_id: '',
    });

    const submitContact = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/contacts/${editId}`, {
                onSuccess: () => cancelEdit(),
            });
        } else {
            post('/contacts', {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (contact) => {
        setIsEditing(true);
        setEditId(contact.id);
        setData({
            name: contact.name,
            phone_number: contact.phone_number,
            persona_id: contact.persona_id || '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        reset();
    };

    const toggleContact = (id) => {
        router.post(`/contacts/${id}/toggle`, {}, { preserveScroll: true });
    };

    const deleteContact = (id) => {
        if (confirm('Yakin ingin menghapus kontak ini dari whitelist?')) {
            router.delete(`/contacts/${id}`, { preserveScroll: true });
        }
    };

    return (
        <SidebarLayout>
            <Head title="Contact Manager" />
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Whitelist Kontak</h1>
                    <p className="text-muted-foreground">AI hanya akan membalas pesan dari nomor yang ada di daftar ini.</p>
                </div>

                {/* Form Tambah/Edit Kontak */}
                <Card className={isEditing ? 'border-indigo-500 shadow-indigo-100' : ''}>
                    <CardHeader>
                        <CardTitle>{isEditing ? '✏️ Edit Kontak' : 'Tambah Target Kontak'}</CardTitle>
                        <CardDescription>
                            {isEditing ? 'Edit detail kontak atau ubah persona yang digunakan.' : 'Masukkan nama, nomor WA, dan pilih Persona AI untuk kontak ini.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitContact} className="flex gap-4 items-end flex-wrap">
                            <div className="flex-1 space-y-2 min-w-[180px]">
                                <Label htmlFor="name">Nama Panggilan</Label>
                                <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Contoh: Cindy" />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="flex-1 space-y-2 min-w-[180px]">
                                <Label htmlFor="phone">Nomor WhatsApp</Label>
                                <Input id="phone" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} placeholder="Contoh: 08123456789" />
                                {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                            </div>

                            <div className="flex-1 space-y-2 min-w-[200px]">
                                <Label htmlFor="persona">Pilih Persona (Opsional)</Label>
                                <select
                                    id="persona"
                                    value={data.persona_id}
                                    onChange={e => setData('persona_id', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">🌍 Gunakan Persona Global</option>
                                    {personas && personas.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            🎭 {p.name} {p.is_active && '(Global)'}
                                        </option>
                                    ))}
                                </select>
                                {errors.persona_id && <p className="text-sm text-red-500">{errors.persona_id}</p>}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing} className="mb-[2px]">
                                    {isEditing ? 'Update Kontak' : 'Tambah Kontak'}
                                </Button>
                                {isEditing && (
                                    <Button type="button" variant="outline" onClick={cancelEdit} className="mb-[2px]">Batal</Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Tabel Daftar Kontak */}
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Nomor WA</TableHead>
                                    <TableHead>Persona AI</TableHead>
                                    <TableHead>Status AI</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">Belum ada kontak whitelist.</TableCell>
                                    </TableRow>
                                ) : (
                                    contacts.map((contact) => (
                                        <TableRow key={contact.id}>
                                            <TableCell className="font-medium">{contact.name}</TableCell>
                                            <TableCell>{contact.phone_number}</TableCell>
                                            <TableCell>
                                                {contact.persona ? (
                                                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                                                        🎭 {contact.persona.name}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                        🌍 Global (Default)
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch checked={contact.is_active} onCheckedChange={() => toggleContact(contact.id)} />
                                                    <span className="text-sm">{contact.is_active ? 'Aktif' : 'Mati'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(contact)}>Edit</Button>
                                                    <Button variant="destructive" size="sm" onClick={() => deleteContact(contact.id)}>Hapus</Button>
                                                </div>
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
