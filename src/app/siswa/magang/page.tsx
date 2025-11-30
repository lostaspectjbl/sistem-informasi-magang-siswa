// File: src/app/siswa/magang/page.tsx
'use client';

import { Building2, MapPin, Users, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function MagangPage() {
  const perusahaanData = [
    {
      nama: 'PT Kreatif Teknologi',
      bidang: 'Teknologi Informasi',
      alamat: 'Jl. Merdeka No. 123, Jakarta',
      pic: 'PIC: Andi Wijaya',
      kuotaMagang: '8/12',
      slotTersisa: '4 slot tersisa',
      deskripsi: 'Perusahaan teknologi yang bergerak dalam pengembangan aplikasi web dan mobile. Memberikan kesempatan magang untuk siswa SMK jurusan IT.',
      progress: 66.67,
      progressColor: 'bg-cyan-500',
    },
    {
      nama: 'CV Digital Solusi',
      bidang: 'Digital Marketing',
      alamat: 'Jl. Sudirman No. 45, Surabaya',
      pic: 'PIC: Sari Dewi',
      kuotaMagang: '5/8',
      slotTersisa: '3 slot tersisa',
      deskripsi: 'Konsultan digital marketing yang membantu UMKM berkembang di era digital.',
      progress: 62.5,
      progressColor: 'bg-cyan-500',
    },
    {
      nama: 'PT Inovasi Mandiri',
      bidang: 'Software Development',
      alamat: 'Jl. Diponegoro No. 78, Bandung',
      pic: 'PIC: Budi Santoso',
      kuotaMagang: '12/15',
      slotTersisa: '3 slot tersisa',
      deskripsi: 'Perusahaan software house yang mengembangkan sistem informasi untuk berbagai industri.',
      progress: 80,
      progressColor: 'bg-cyan-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Sistem Magang Siswa</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-gray-200">
        <button className="px-6 py-3 bg-cyan-500 text-white rounded-t-lg font-medium flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Cari Tempat Magang
        </button>
        <button className="px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-t-lg font-medium flex items-center gap-2">
          <Users className="w-4 h-4" />
          Status Magang
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari perusahaan, bidang usaha, lokasi..."
              className="pl-10"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600">Tampilkan:</span>
            <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
              <option>6</option>
              <option>12</option>
              <option>24</option>
            </select>
            <span className="text-sm text-gray-600">per halaman</span>
          </div>
        </div>
      </div>

      {/* Perusahaan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {perusahaanData.map((perusahaan, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
              <div className="flex items-start gap-3">
                <div className="bg-white p-3 rounded-lg">
                  <Building2 className="w-6 h-6 text-cyan-500" />
                </div>
                <div className="flex-1 text-white">
                  <h3 className="font-semibold text-lg mb-1">{perusahaan.nama}</h3>
                  <p className="text-sm text-cyan-50">{perusahaan.bidang}</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-4">
              {/* Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{perusahaan.alamat}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>{perusahaan.pic}</span>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Kuota Magang</span>
                  <span className="text-sm font-semibold text-gray-800">{perusahaan.kuotaMagang}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div
                    className={`${perusahaan.progressColor} h-2.5 rounded-full transition-all`}
                    style={{ width: `${perusahaan.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{perusahaan.slotTersisa}</p>
              </div>

              {/* Deskripsi */}
              <p className="text-sm text-gray-600 line-clamp-3">
                {perusahaan.deskripsi}
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" size="sm">
                  <Search className="w-4 h-4 mr-1" />
                  Detail
                </Button>
                <Button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white" size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Daftar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg border border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan 1 sampai 3 dari 3 perusahaan
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              ‹‹
            </Button>
            <Button variant="outline" size="sm" disabled>
              ‹
            </Button>
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              ›
            </Button>
            <Button variant="outline" size="sm" disabled>
              ››
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
