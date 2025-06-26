'use client';

import { useAuthStore } from '@/store/useAuthStore';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignupPage() {

    const router = useRouter();

    const {
        username,
        password,
        setUsername,
        setPassword,
        signup,
        showPassword,
        toggleShowPassword,
        error,
        setError,
    } = useAuthStore();

    const isFormValid = username.trim() !== '' && password.trim() !== '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await signup();
        if (!success) {
            setError('Akun sudah terdaftar atau terjadi kesalahan saat pendaftaran');
        } else {
            setError('');
            router.push('/login');
        }
    };

    useEffect(() => {
        setError('');
        setUsername('');
        setPassword('');
    }, []);


    return (
        <div className="min-w-screen min-h-screen max-w-4xl bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
            <div className="bg-[#f2eee6] p-10 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-green-700">GreenRoute</h1>
                <p className="text-gray-900 font-semibold mt-2 text-center">
                    Sistem Optimasi Rute Pengangkutan Sampah
                </p>
                <Image
                    src="/truck.png" // ganti dengan path gambar yang sesuai di public folder
                    alt="Green Truck"
                    width={280}
                    height={280}
                    className="mb-6"
                />
            </div>

            <div className="p-10 flex flex-col justify-center bg-white mb-10 md:mb-0">
                <h2 className="text-2xl font-semibold mb-2">Sign up</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Silakan buat akun untuk melanjutkan ke sistem GreenRoute.
                </p>
                <hr className='w-full md:w-2/3 mb-8 border-gray-900' />
                {error &&
                    <div className='mb-4 w-full md:w-2/3 bg-red-100 text-red-800 p-2 rounded-md'>
                        <p className="text-sm">{error}</p>
                    </div>
                }
                <form
                    action=""
                    onSubmit={handleSubmit}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Username*</label>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder='Masukkan username anda'
                                className="mt-1 md:w-2/3 p-4"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Password*</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Masukkan password anda'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 pr-10 md:w-2/3 p-4s"
                                />
                                <button
                                    type="button"
                                    onClick={toggleShowPassword}
                                    className="absolute right-3 md:right-58 top-1/2 transform -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOffIcon className="" size={18} /> : <EyeIcon className="" size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            className="w-full bg-lime-500 hover:bg-lime-400 text-white md:w-2/3"
                            type='submit'
                            disabled={!isFormValid}
                        >
                            Signup
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
