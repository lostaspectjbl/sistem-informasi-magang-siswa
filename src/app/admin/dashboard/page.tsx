// File: src/app/admin/dashboard/page.tsx
'use client';

import React from 'react';
import { Users, Building2, BookOpen, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function DashboardPage() {
  const stats = [
    { title: "Total Siswa", value: "150", subtitle: "Seluruh siswa terdaftar", icon: Users },
    { title: "DUDI Partner", value: "45", subtitle: "Perusahaan mitra", icon: Building2 },
    { title: "Siswa Magang", value: "120", subtitle: "Sedang aktif magang", icon: Users },
    { title: "Logbook Hari Ini", value: "85", subtitle: "Laporan masuk hari ini", icon: BookOpen },
  ];

  const internships = [
    { student: 'Ahmad Rizki', company: 'PT. Teknologi Nusantara', date: '15/1/2024 - 15/4/2024', status: 'Aktif' },
    { student: 'Siti Nurhaliza', company: 'CV. Digital Kreatifa', date: '20/1/2024 - 20/4/2024', status: 'Aktif' }
  ];

  const activeDUDI = [
    { name: 'PT. Teknologi Nusantara', address: 'Jl. HR Muhammad No. 123, Surabaya', phone: '031-5551234', students: 8 },
    { name: 'CV. Digital Kreatifa', address: 'Jl. Pemuda No. 45, Surabaya', phone: '031-555-1980', students: 6 },
    { name: 'PT. Inovasi Mandiri', address: 'Jl. Diponegoro No. 78, Surabaya', phone: '031-5353458', students: 12 }
  ];

  const logbooks = [
    { title: 'Mempelajari sistem database dan melakukan backup data harian', date: '11/7/2024', status: 'Disetujui', detail: 'Kendala: tidak ada kendala berarti' },
    { title: 'Membuat design mockup untuk website perusahaan', date: '21/7/2024', status: 'Pending', detail: 'Kendala: Software design masih belum familiar' },
    { title: 'Mengikuti training keamanan sistem informasi', date: '30/7/2024', status: 'Ditolak', detail: 'Kendala: Materi cukup kompleks untuk dipahami' }
  ];

  return (
    <div className="p-8 bg-[#faf5ff] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Selamat datang di sistem pelaporan magang siswa SMK Negeri 1 Surabaya
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <Card className="lg:col-span-2">
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

        {/* DUDI Aktif */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-[#ad46ff]" />
              DUDI Aktif
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDUDI.map((dudi, index) => (
              <div key={index} className="p-3 bg-white rounded-lg shadow-sm">
                <p className="font-medium text-gray-800 text-sm mb-1">{dudi.name}</p>
                <div className="text-xs text-gray-600 mb-2 flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-[#ad46ff]" />
                  {dudi.address}
                </div>
                <div className="text-xs text-gray-600 mb-2 flex items-center">
                  <Phone className="w-3 h-3 mr-1 text-[#ad46ff]" />
                  {dudi.phone}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">Siswa Magang</span>
                  <Badge variant="secondary" className="bg-[#f2e6ff] text-[#ad46ff]">
                    {dudi.students}
                  </Badge>
                </div>
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
