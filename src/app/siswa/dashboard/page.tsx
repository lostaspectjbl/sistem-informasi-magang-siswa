// File: src/app/siswa/dashboard/page.tsx
'use client';

import React from 'react';
import { BookOpen, Calendar, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function SiswaDashboardPage() {
  // Data siswa - nanti bisa diganti dengan data real dari session/API
  const studentName = "Jabal Ario Dewantoro";
  const studentClass = "XII RPL 1";
  const studentNIS = "2024001";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        {/* Icon */}
        <div className="mb-6 relative">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 text-center">
          Selamat Datang, {studentName}!
        </h1>
        
        <p className="text-lg text-gray-600 mb-2 text-center">
          {studentClass} • NIS: {studentNIS}
        </p>

        <p className="text-base text-gray-500 text-center max-w-2xl">
          Selamat datang di Sistem Informasi Manajemen Magang Siswa<br />
          <span className="font-semibold text-purple-600">SMK Plus Almaarif Singosari</span>
        </p>

        {/* Footer Message */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Gunakan menu di sebelah kiri untuk navigasi
          </p>
        </div>
      </div>
    </div>
  );
}