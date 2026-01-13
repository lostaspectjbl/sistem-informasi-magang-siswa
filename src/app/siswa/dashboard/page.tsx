// File: src/app/siswa/dashboard/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, CheckCircle, Clock, XCircle, Building2, User, Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SiswaDashboardPage() {
  const router = useRouter();

  // Data siswa - nanti bisa diganti dengan data real dari session/API
  const studentName = "Jabal Ario Dewantoro";
  const studentNIS = "2021001";
  const studentClass = "XI";
  const studentMajor = "RPL";

  // Data magang
  const internshipData = {
    company: "PT. Teknologi Nusantara",
    address: "Jl. HR Muhammad No. 123, Surabaya",
    supervisor: "Suryanto, S.Pd",
    supervisorRole: "Pemograman Web & Mobile",
    period: "1 Juli 2024 - 30 September 2024",
    status: "Aktif",
    notes: "Siswa menunjukkan performa baik"
  };

  // Stats data
  const stats = [
    { 
      label: "Total Jurnal", 
      value: "2", 
      sublabel: "Jurnal yang dibuat", 
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Disetujui", 
      value: "1", 
      sublabel: "Jurnal disetujui", 
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      label: "Pending", 
      value: "1", 
      sublabel: "Menunggu verifikasi", 
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    { 
      label: "Ditolak", 
      value: "0", 
      sublabel: "Jurnal ditolak", 
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
  ];

  // Aktivitas jurnal terbaru
  const journalActivities = [
    {
      date: "16 Juli 2024",
      status: "Menunggu",
      statusColor: "bg-yellow-100 text-yellow-700",
      description: "Belajar backend Laravel untuk membangun REST API sistem kasir. Mempelajari konsep MVC dan routing.",
    },
    {
      date: "15 Juli 2024",
      status: "Disetujui",
      statusColor: "bg-green-100 text-green-700",
      description: "Membuat desain UI aplikasi kasir menggunakan Figma. Melakukan analisis user experience dan wireframing untuk interface yang user-friendly.",
      notes: "Bagus, lanjutkan dengan implementasi",
    },
  ];

  // Fungsi untuk navigasi
  const handleBuatJurnal = () => {
    // Nanti ganti dengan path yang sesuai
    router.push('/siswa/jurnal');
  };

  const handleLihatJurnal = () => {
    // Nanti ganti dengan path yang sesuai
    router.push('/siswa/jurnal');
  };

  const handleInfoMagang = () => {
    // Nanti ganti dengan path yang sesuai
    router.push('/siswa/magang');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header dengan gradient */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              Selamat Datang, {studentName}! 👋
            </h1>
            <p className="text-cyan-50 text-lg">
              {studentNIS} • {studentClass} • {studentMajor}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>13 Januari 2026</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.sublabel}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informasi Magang - 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
              Informasi Magang
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tempat Magang */}
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tempat Magang</p>
                    <p className="font-semibold text-gray-800">{internshipData.company}</p>
                    <p className="text-sm text-gray-600 mt-1">{internshipData.address}</p>
                  </div>
                </div>
              </div>

              {/* Guru Pembimbing */}
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Guru Pembimbing</p>
                    <p className="font-semibold text-gray-800">{internshipData.supervisor}</p>
                    <p className="text-sm text-gray-600 mt-1">{internshipData.supervisorRole}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Periode Magang */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Periode Magang</p>
                  <p className="font-semibold text-gray-800">{internshipData.period}</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                {internshipData.status}
              </Badge>
            </div>

            {/* Catatan */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Catatan:</p>
              <p className="text-sm text-blue-800">{internshipData.notes}</p>
            </div>
          </CardContent>
        </Card>

        {/* Aksi Cepat - 1 column */}
        <Card>
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <Button 
              className="w-full bg-purple-500 hover:bg-purple-600 text-white justify-start"
              onClick={handleBuatJurnal}
            >
              <FileText className="w-4 h-4 mr-2" />
              Buat Jurnal Baru
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={handleLihatJurnal}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Lihat Semua Jurnal
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleInfoMagang}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Info Magang
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Aktivitas Jurnal Terbaru */}
      <Card>
        <CardHeader className="border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Aktivitas Jurnal Terbaru
            </CardTitle>
            <Button 
              variant="link" 
              className="text-purple-600"
              onClick={handleLihatJurnal}
            >
              Lihat Semua
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {journalActivities.map((activity, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{activity.date}</span>
                  </div>
                  <Badge className={activity.statusColor}>
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  {activity.description}
                </p>
                {activity.notes && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded">
                    <p className="text-xs font-medium text-gray-700 mb-1">Catatan Guru:</p>
                    <p className="text-xs text-green-800">{activity.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}