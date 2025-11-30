// File: src/app/admin/layout.tsx
'use client';


import AppLayout from '@/components/layout/appLayout';
import { adminMenuItems } from '@/components/layout/MenuConfig';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = {
    name: 'Admin Sistem',
    email: 'admin@smkplusalmaarif.sch.id',
    role: 'Admin',
    avatar: 'AS'
  };

  return (
    <AppLayout 
      userInfo={userInfo} 
      menuItems={adminMenuItems}
      baseRoute="/admin"
    >
      {children}
    </AppLayout>
  );
}