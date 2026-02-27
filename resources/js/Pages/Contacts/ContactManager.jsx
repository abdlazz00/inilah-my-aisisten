import { Head, useForm, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ContactManager({ contacts }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        phone_number: '',
    });

    const submitContact = (e) => {
        e.preventDefault();
        post('/contacts', {
            onSuccess: () => reset(),
        });
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
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Whitelist Kontak</h1>
                    <p className="text-muted-foreground">AI hanya akan membalas pesan dari nomor yang ada di daftar ini.</p>
                </div>

                {/* Form Tambah Kontak */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Target Kontak</CardTitle>
                        <CardDescription>Masukkan nama dan nomor WA (format bebas, akan otomatis jadi 628...)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitContact} className="flex gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="name">Nama Panggilan</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Contoh: Cindy"
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="phone">Nomor WhatsApp</Label>
                                <Input
                                    id="phone"
                                    value={data.phone_number}
                                    onChange={e => setData('phone_number', e.target.value)}
                                    placeholder="Contoh: 08123456789"
                                />
                                {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                            </div>
                            <Button type="submit" disabled={processing}>Tambah Kontak</Button>
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
                                    <TableHead>Status AI</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">Belum ada kontak whitelist.</TableCell>
                                    </TableRow>
                                ) : (
                                    contacts.map((contact) => (
                                        <TableRow key={contact.id}>
                                            <TableCell className="font-medium">{contact.name}</TableCell>
                                            <TableCell>{contact.phone_number}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={contact.is_active}
                                                        onCheckedChange={() => toggleContact(contact.id)}
                                                    />
                                                    <span className="text-sm">
                                                        {contact.is_active ? 'Aktif' : 'Mati'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="destructive" size="sm" onClick={() => deleteContact(contact.id)}>
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
