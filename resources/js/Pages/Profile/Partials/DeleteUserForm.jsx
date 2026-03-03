import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-semibold text-red-600">Hapus Akun Permanen</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Setelah akun Anda dihapus, semua data dan sumber daya yang terkait akan dihapus secara permanen.
                    Sebelum menghapus akun Anda, harap unduh data atau informasi yang ingin Anda simpan.
                </p>
            </header>

            <Button variant="destructive" onClick={confirmUserDeletion}>
                Hapus Akun
            </Button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Apakah Anda yakin ingin menghapus akun Anda?
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Sekali akun dihapus, tidak akan bisa dikembalikan lagi. Silakan masukkan password Anda untuk mengonfirmasi bahwa Anda benar-benar ingin menghapus akun ini secara permanen.
                    </p>

                    <div className="mt-6 space-y-2">
                        <Label htmlFor="password" className="sr-only">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Masukkan password Anda"
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={closeModal}>
                            Batal
                        </Button>

                        <Button variant="destructive" disabled={processing}>
                            Ya, Hapus Akun
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
