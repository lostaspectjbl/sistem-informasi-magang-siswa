// File: src/components/layout/menuConfig.ts
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  ClipboardList,
  Award,
  Calendar,
  FileText,
  GraduationCap
} from 'lucide-react';

export interface MenuItem {
  title: string;
  icon: any;
  href: string;
  description: string;
}

export const adminMenuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
    description: 'Ringkasan sistem'
  },
  {
    title: 'DUDI',
    icon: Building2,
    href: '/admin/dudi',
    description: 'Manajemen DUDI'
  },
  {
    title: 'Pengguna',
    icon: Users,
    href: '/admin/users',
    description: 'Manajemen user'
  },
  {
    title: 'Pengaturan',
    icon: Settings,
    href: '/admin/settings',
    description: 'Konfigurasi sistem'
  },
  {
    title: 'Siswa',
    icon: Award,
    href: '/admin/siswa',
    description: 'Manajemen siswa'
  },
  {
    title: 'Guru',
    icon: Users,
    href: '/admin/guru',
    description: 'Manajemen guru'
  }
];

export const guruMenuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/guru/dashboard',
    description: 'Ringkasan aktivitas'
  },
  {
    title: 'DUDI',
    icon: Building2,
    href: '/guru/dudi',
    description: 'Dunia Usaha & Industri'
  },
  {
    title: 'Magang',
    icon: GraduationCap,
    href: '/guru/magang',
    description: 'Data siswa magang'
  },
  {
    title: 'Jurnal Harian',
    icon: ClipboardList,
    href: '/guru/jurnal',
    description: 'Catatan harian'
  }
];

export const siswaMenuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/siswa/dashboard',
    description: 'Ringkasan magang'
  },
  {
    title: 'Jurnal',
    icon: ClipboardList,
    href: '/siswa/jurnal',
    description: 'Catatan harian'
  },
  {
    title: 'Magang',
    icon: Building2,
    href: '/siswa/magang',
    description: 'Info magang'
  },
];