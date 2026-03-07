import { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { MessageSquare, X, Plus, Trash2, Edit, Users } from 'lucide-react';

export default function ContactManager({ contacts, personas }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [personaId, setPersonaId] = useState('');
    const [isGroup, setIsGroup] = useState(false); // <--- State Baru untuk Grup

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const chatEndRef = useRef(null);

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setName('');
        setPhone('');
        setPersonaId('');
        setIsGroup(false);
    };

    const handleEdit = (contact) => {
        setIsEditing(true);
        setEditId(contact.id);
        setName(contact.name);
        setPhone(contact.phone_number);
        setPersonaId(contact.persona_id || '');
        setIsGroup(contact.is_group === 1 || contact.is_group === true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name,
            phone_number: phone,
            persona_id: personaId || null,
            is_group: isGroup
        };

        if (isEditing) {
            router.put(`/contacts/${editId}`, payload, { onSuccess: resetForm });
        } else {
            router.post('/contacts', payload, { onSuccess: resetForm });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kontak ini?')) router.delete(`/contacts/${id}`);
    };

    const toggleActive = (id) => {
        router.post(`/contacts/${id}/toggle`, {}, { preserveScroll: true });
    };

    const openChat = async (contact) => {
        setSelectedContact(contact);
        setIsChatOpen(true);
        setIsLoadingChat(true);
        setChatMessages([]);
        try {
            const response = await axios.get(`/contacts/${contact.id}/messages`);
            setChatMessages(response.data);
        } catch (error) {
            console.error("Gagal mengambil pesan", error);
        } finally {
            setIsLoadingChat(false);
        }
    };

    const closeChat = () => {
        setIsChatOpen(false);
        setTimeout(() => setSelectedContact(null), 300);
    };

    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isChatOpen]);

    return (
        <SidebarLayout>
            <Head title="Whitelist Kontak" />
            <div className="max-w-6xl mx-auto space-y-8 relative">

                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Whitelist Kontak</h1>
                    <p className="text-muted-foreground">Kelola daftar nomor & grup yang diizinkan untuk direspons oleh AI.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* FORM TAMBAH/EDIT */}
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>{isEditing ? 'Edit Kontak' : 'Tambah Kontak'}</CardTitle>
                            <CardDescription>Masukkan ID Grup Fonnte atau nomor WA</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nama Kontak / Grup</Label>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Contoh: Grup Mabar / Dosen" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nomor / ID Fonnte</Label>
                                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="628... atau ID Grup" />
                                </div>

                                {/* FITUR TOGGLE GRUP WA */}
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                    <Switch checked={isGroup} onCheckedChange={setIsGroup} id="is-group-mode" />
                                    <Label htmlFor="is-group-mode" className="cursor-pointer">
                                        <div className="font-semibold text-slate-800">Ini adalah Grup WA</div>
                                        <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                                            Bot hanya akan membalas jika di-mention
                                        </div>
                                    </Label>
                                </div>

                                <div className="space-y-2">
                                    <Label>Gunakan Persona Spesifik</Label>
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={personaId}
                                        onChange={(e) => setPersonaId(e.target.value)}
                                    >
                                        <option value="">-- Gunakan Persona Global --</option>
                                        {personas.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button type="submit" className="flex-1">
                                        {isEditing ? 'Simpan' : <><Plus className="w-4 h-4 mr-2" /> Tambah</>}
                                    </Button>
                                    {isEditing && (
                                        <Button type="button" variant="outline" onClick={resetForm}>Batal</Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* TABEL KONTAK */}
                    <Card className="lg:col-span-2">
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama & Nomor</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead className="text-center">Status AI</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contacts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-slate-500">Belum ada kontak whitelist.</TableCell>
                                        </TableRow>
                                    ) : (
                                        contacts.map(c => (
                                            <TableRow key={c.id}>
                                                <TableCell>
                                                    <p className="font-semibold text-slate-900">{c.name}</p>
                                                    <p className="text-[11px] font-mono text-slate-500 truncate max-w-[120px]" title={c.phone_number}>{c.phone_number}</p>
                                                </TableCell>
                                                <TableCell>
                                                    {c.is_group ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md uppercase tracking-wider">
                                                            <Users className="w-3 h-3" /> Grup
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">
                                                            Personal
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Switch checked={c.is_active} onCheckedChange={() => toggleActive(c.id)} />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="secondary" size="sm" onClick={() => openChat(c)}>
                                                            <MessageSquare className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => handleEdit(c)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>
                                                            <Trash2 className="w-4 h-4" />
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
                </div>

                {/* --- LACI CHAT (SPY MODE) DIBIARKAN SAMA SEPERTI SEBELUMNYA --- */}
                {isChatOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={closeChat}></div>
                )}
                <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-slate-50 shadow-2xl transform transition-transform duration-300 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase ring-2 ring-indigo-50">
                                {selectedContact?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{selectedContact?.name}</h3>
                                <p className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">{selectedContact?.phone_number}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${selectedContact?.is_active ? 'bg-green-50 border-green-200' : 'bg-slate-100 border-slate-200'}`}>
                                <span className={`text-[11px] font-bold uppercase ${selectedContact?.is_active ? 'text-green-700' : 'text-slate-500'}`}>
                                    {selectedContact?.is_active ? 'AI: ON' : 'AI: OFF'}
                                </span>
                                <Switch
                                    checked={selectedContact?.is_active}
                                    onCheckedChange={() => {
                                        toggleActive(selectedContact.id);
                                        setSelectedContact({...selectedContact, is_active: !selectedContact.is_active});
                                    }}
                                />
                            </div>
                            <button onClick={closeChat} className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 0)', backgroundSize: '20px 20px' }}>
                        {isLoadingChat ? (
                            <div className="text-center mt-10"><span className="animate-pulse text-sm text-slate-500 bg-white px-4 py-2 rounded-full">Menyadap percakapan... 🕵️‍♂️</span></div>
                        ) : chatMessages.length === 0 ? (
                            <div className="text-center mt-10"><span className="text-sm text-slate-500 bg-white px-4 py-2 rounded-full">Belum ada obrolan.</span></div>
                        ) : (
                            chatMessages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'assistant' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-[15px] shadow-sm ${msg.role === 'assistant' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border text-slate-800 rounded-tl-sm'}`}>
                                        {msg.content}
                                        <div className={`text-[10px] mt-1 text-right ${msg.role === 'assistant' ? 'text-indigo-200' : 'text-slate-400'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={chatEndRef} className="h-2"></div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
