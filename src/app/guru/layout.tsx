// File: src/app/admin/layout.tsx
'use client';


import AppLayout from '@/components/layout/appLayout';
import { guruMenuItems } from '@/components/layout/MenuConfig';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = {
    name: 'Pak Suryanto',
    email: 'guru@smkplusalmaarif.sch.id',
    role: 'Guru',
    avatar: 'GR'
  };

  return (
    <AppLayout 
      userInfo={userInfo} 
      menuItems={guruMenuItems}
      baseRoute="/guru"
    >
      {children}
    </AppLayout>
  );
}