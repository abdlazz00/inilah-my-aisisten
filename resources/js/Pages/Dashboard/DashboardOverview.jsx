import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card.jsx';
import { Switch } from '@/Components/ui/switch.jsx';
import { Bot, Users, BrainCircuit } from 'lucide-react';

export default function DashboardOverview({ isAiActive, totalContacts, activePersonaName }) {

    // Fungsi menekan saklar global
    const handleToggleAi = () => {
        router.post('/settings/toggle-ai', {}, { preserveScroll: true });
    };

    return (
        <SidebarLayout>
            <Head title="Dashboard" />
            <div className="max-w-5xl mx-auto space-y-8">

                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground">Pusat kendali Inilah My AIsisten.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">

                    {/* Card 1: Saklar Utama */}
                    <Card className={`border-2 ${isAiActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200'}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Status AI Global</CardTitle>
                            <Bot className={`w-5 h-5 ${isAiActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isAiActive ? 'Aktif' : 'Non-aktif'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 mb-4">
                                {isAiActive
                                    ? 'AI sedang berjaga membalas pesan.'
                                    : 'Semua webhook masuk akan diabaikan.'}
                            </p>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={isAiActive}
                                    onCheckedChange={handleToggleAi}
                                    className="data-[state=checked]:bg-indigo-600"
                                />
                                <span className="text-sm font-medium text-slate-600">
                                    {isAiActive ? 'Matikan AI' : 'Hidupkan AI'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Statistik Kontak */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Target Kontak</CardTitle>
                            <Users className="w-5 h-5 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalContacts} Orang</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Berada di dalam daftar whitelist.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Card 3: Persona Aktif */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Persona Aktif</CardTitle>
                            <BrainCircuit className="w-5 h-5 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold truncate">{activePersonaName}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Karakter AI yang sedang digunakan.
                            </p>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </SidebarLayout>
    );
}
