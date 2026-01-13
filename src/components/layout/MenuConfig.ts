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
  Clock,
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
  },
  {
    title: 'DUDI',
    icon: Building2,
    href: '/admin/dudi',
    description: 'Manajemen DUDI'
  },
  {
    title: 'Magang',
    icon : GraduationCap,
    href: '/admin/magang',
    description: 'Data magang siswa'
  },
  {
    title: 'Pengguna',
    icon: Users,
    href: '/admin/users',
    description: 'Manajemen user'
  },
  {
    title: 'Activity Logs ',
    icon: Clock,
    href: '/admin/activity',
    description: 'Riwayat aktivitas '
  },
  {
    title: 'Pengaturan',
    icon: Settings,
    href: '/admin/settings',
    description: 'Konfigurasi sistem'
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
    title: 'Magang',
    icon: GraduationCap,
    href: '/guru/magang',
    description: 'Kelola magang siswa'
  },
  {
    title: 'Approval Jurnal',
    icon: ClipboardList,
    href: '/guru/jurnal',
    description: 'Review jurnal harian'
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