// File: src/components/layout/AppLayout.tsx
'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

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

interface AppLayoutProps {
  children: React.ReactNode;
  userInfo: UserInfo;
  menuItems: MenuItem[];
  baseRoute?: string;
}

export default function AppLayout({ 
  children, 
  userInfo, 
  menuItems,
  baseRoute = '/admin'
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      {/* Topbar */}
      <Topbar 
        userInfo={userInfo}
        baseRoute={baseRoute}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Sidebar - Desktop */}
      <Sidebar 
        userInfo={userInfo}
        menuItems={menuItems}
        sidebarOpen={sidebarOpen}
        isMobile={false}
        onClose={() => {}}
      />

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <Sidebar 
            userInfo={userInfo}
            menuItems={menuItems}
            sidebarOpen={true}
            isMobile={true}
            onClose={() => setMobileMenuOpen(false)}
          />
        </>
      )}

      {/* Main Content */}
      <main 
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        }`}
        suppressHydrationWarning
      >
        <div className="p-6" suppressHydrationWarning>
          {children}
        </div>
      </main>
    </div>
  );
}

export type { MenuItem, UserInfo };