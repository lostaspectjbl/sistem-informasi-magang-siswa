'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from 'lucide-react'
import type { LoginData } from '@/app/types'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const users: LoginData[] = [
    { id: 1, name: 'Admin', email: 'admin@gmail.com', password: '123', role: 'admin', created_at: '', updated_at: '' },
    { id: 2, name: 'Guru', email: 'guru@gmail.com', password: '123', role: 'guru', created_at: '', updated_at: '' },
    { id: 3, name: 'Siswa', email: 'siswa@gmail.com', password: '123', role: 'siswa', created_at: '', updated_at: '' },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const user = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    )

    if (!user) {
      setError('Email atau password salah.')
      setIsLoading(false)
      return
    }

    localStorage.setItem('user', JSON.stringify(user))

    if (user.role === 'admin') router.push('/admin/dashboard')
    else if (user.role === 'guru') router.push('/guru/dashboard')
    else if (user.role === 'siswa') router.push('/siswa/dashboard')

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 rounded-2xl" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Selamat Datang
              </h1>
              <p className="text-gray-600">Masuk ke akun anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Masukkan email anda"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/70 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Masukkan password anda"
                    disabled={isLoading}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl 
                    bg-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl 
                font-medium hover:from-purple-600 hover:to-purple-700 transform hover:scale-[1.02] 
                transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sedang masuk...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Sistem Informasi Magang Siswa</p>
        </div>
      </div>
    </div>
  )
}
