// File: src/components/layout/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
  description: string;
}

interface UserInfo {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface SidebarProps {
  userInfo: UserInfo;
  menuItems: MenuItem[];
  sidebarOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'bg-purple-500';
    case 'guru':
      return 'bg-purple-500';
    case 'siswa':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const getRoleLightColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'bg-purple-50 hover:bg-purple-100';
    case 'guru':
      return 'bg-purple-50 hover:bg-purple-100';
    case 'siswa':
      return 'bg-purple-50 hover:bg-purple-100';
    default:
      return 'bg-purple-50 hover:bg-purple-100';
  }
};

export default function Sidebar({
  userInfo,
  menuItems,
  sidebarOpen,
  isMobile,
  onClose
}: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const sidebarClasses = isMobile
    ? "fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-50 lg:hidden"
    : `fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 hidden lg:block ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`;

  return (
    <aside className={sidebarClasses}>
      <nav className="h-full flex flex-col p-4">
        <div className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? `${getRoleColor(userInfo.role)} text-white`
                    : `text-gray-600 ${getRoleLightColor(userInfo.role)}`
                }`}
              >
                <Icon className={`w-5 h-5 ${isMobile || sidebarOpen ? '' : 'flex-shrink-0'} ${active ? 'text-white' : 'text-gray-500'}`} />
                {(isMobile || sidebarOpen) && (
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${active ? 'text-white' : 'text-gray-800'}`}>
                      {item.title}
                    </p>
                    <p className={`text-xs truncate ${active ? 'text-white opacity-80' : 'text-gray-500'}`}>
                      {item.description}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Info */}
        {(isMobile || sidebarOpen) && (
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-medium">SMK Plus Almaarif</p>
              <p>Sistem Pelaporan v1.0</p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {userInfo.role}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}