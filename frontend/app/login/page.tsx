'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState<string>('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.username, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2E5BFF] to-[#00D4AA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <h1 className="text-5xl font-bold text-white mb-2" style={{ letterSpacing: '0.1em' }}>
              KAVAK
            </h1>
            <h2 className="text-3xl font-bold text-[#00D4AA]" style={{ letterSpacing: '0.05em' }}>
              CRÉDITO
            </h2>
          </div>
          <p className="text-white/90 text-sm">
            Sistema de Simulación de Crédito
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Iniciar Sesión
          </h3>
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                {...register('username', { required: 'Usuario es requerido' })}
                type="text"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
                placeholder="Ingresa tu usuario"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                {...register('password', { required: 'Contraseña es requerida' })}
                type="password"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
                placeholder="Ingresa tu contraseña"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <div className="text-center pt-4">
              <Link
                href="/register"
                className="font-medium text-[#2E5BFF] hover:text-[#00D4AA] transition-colors"
              >
                ¿No tienes cuenta? Regístrate
              </Link>
            </div>
          </form>
        </div>

        {/* Powered by Kuna */}
        <div className="text-center mt-6">
          <p className="text-white/70 text-sm">
            powered by <span className="font-semibold text-white">kuna</span>
          </p>
        </div>
      </div>
    </div>
  );
}






