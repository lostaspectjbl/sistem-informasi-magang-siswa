// File: src/app/siswa/layout.tsx
'use client';

import { Home, BookOpen, Building2, User, FileText } from 'lucide-react';
import AppLayout from '@/components/layout/appLayout';

export default function SiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ==== USER INFO ====
  const userInfo = {
    name: 'Jabal Ario Dewantoro',
    email: 'siswa@gmail.com',
    role: 'Siswa',
    avatar: '/avatar/default.png',
  };

  // ==== MENU ITEMS ====
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
      icon: BookOpen,
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
    <AppLayout 
      userInfo={userInfo} 
      menuItems={menuItems}
      baseRoute="/siswa"
    >
      {children}
    </AppLayout>
  );
}