// File: src/app/siswa/dashboard/page.tsx
'use client';

import AppLayout from '@/components/layout/appLayout'; // ✅ Huruf besar 'A'
import { Home, Book, User } from 'lucide-react';

export default function DashboardPage() {
  const userInfo = {
    name: 'Jabal Ario Dewantoro',
    email: 'siswa@gmail.com',
    role: 'Siswa',
    avatar: '/avatar/default.png',
  };

  const menuItems = [
    {
      title: 'Dashboard',
      description: 'Halaman utama siswa',
      icon: Home,
      href: '/siswa/dashboard',
    },
    {
      title: 'Jurnal Harian',
      description: 'Catatan kegiatan magang',
      icon: Book,
      href: '/siswa/jurnal',
    },
    {
      title: 'Magang',
      description: 'Data Magang Saya',
      icon: User,
      href: '/siswa/magang',
    },
  ];

  return (
    <AppLayout userInfo={userInfo} menuItems={menuItems} baseRoute="/siswa">
      <div className="p-8 bg-[#faf5ff] min-h-screen w-full flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Selamat Datang Jabal Ario Dewantoro
        </h1>

        <p className="text-gray-600 text-lg">
          Selamat datang di sistem pelaporan magang siswa SMK Plus Almaarif Singosari
        </p>
      </div>
    </AppLayout>
  );
}