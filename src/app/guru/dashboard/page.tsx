// File: src/app/guru/dashboard/page.tsx
'use client';

import React from 'react';
import { Users, Building2, BookOpen, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function DashboardPage() {
  const stats = [
    { title: "Total Siswa", value: "150", subtitle: "Seluruh siswa terdaftar", icon: Users },
    { title: "Siswa Magang", value: "120", subtitle: "Sedang aktif magang", icon: Users },
    { title: "Logbook Hari Ini", value: "85", subtitle: "Laporan masuk hari ini", icon: BookOpen },
  ];

  const internships = [
    { student: 'Ahmad Rizki', company: 'PT. Teknologi Nusantara', date: '15/1/2024 - 15/4/2024', status: 'Aktif' },
    { student: 'Siti Nurhaliza', company: 'CV. Digital Kreatifa', date: '20/1/2024 - 20/4/2024', status: 'Aktif' }
  ];
  const logbooks = [
    { title: 'Mempelajari sistem database dan melakukan backup data harian', date: '11/7/2024', status: 'Disetujui', detail: 'Kendala: tidak ada kendala berarti' },
    { title: 'Membuat design mockup untuk website perusahaan', date: '21/7/2024', status: 'Pending', detail: 'Kendala: Software design masih belum familiar' },
    { title: 'Mengikuti training keamanan sistem informasi', date: '30/7/2024', status: 'Ditolak', detail: 'Kendala: Materi cukup kompleks untuk dipahami' }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Guru</h1>
        <p className="text-gray-600">
          Pantau dan kelola siswa bimbingan anda
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-[#ad46ff]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Magang Terbaru */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#ad46ff]" />
              Magang Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {internships.map((internship, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-[#ad46ff] text-white">
                      {internship.student[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-800">{internship.student}</p>
                    <p className="text-sm text-gray-600">{internship.company}</p>
                    <p className="text-xs text-gray-500">{internship.date}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {internship.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Logbook Terbaru */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-[#ad46ff]" />
            Logbook Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {logbooks.map((logbook, index) => {
            const statusVariant =
              logbook.status === 'Disetujui' ? 'default' :
              logbook.status === 'Pending' ? 'secondary' :
              'destructive';

            return (
              <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3 flex-1">
                    <Avatar className="bg-[#ad46ff]">
                      <AvatarFallback className="bg-[#ad46ff] text-white">
                        <BookOpen className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{logbook.title}</p>
                      <p className="text-xs text-gray-500">{logbook.date}</p>
                    </div>
                  </div>
                  <Badge
                    variant={statusVariant}
                    className={
                      logbook.status === 'Disetujui' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                      logbook.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                      'bg-red-100 text-red-700 hover:bg-red-100'
                    }
                  >
                    {logbook.status}
                  </Badge>
                </div>
                <p className="text-sm text-purple-600 ml-13">{logbook.detail}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
