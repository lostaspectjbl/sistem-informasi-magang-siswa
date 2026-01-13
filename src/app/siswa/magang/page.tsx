'use client';

import { useState } from 'react';
import { Building2, MapPin, Users, Calendar, Phone, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface StatusMagang {
  namaLengkap: string;
  nis: string;
  kelas: string;
  jurusan: string;
  perusahaan: string;
  alamatPerusahaan: string;
  telepon: string;
  pembimbing: string;
  nipPembimbing: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'Berlangsung' | 'Selesai' | 'Pending';
  pendaftaranPending: number;
  totalPendaftaran: number;
}

export default function MagangPage() {
  const [activeTab, setActiveTab] = useState<'status' | 'cari'>('status');

  // Data status magang siswa
  const statusMagang: StatusMagang = {
    namaLengkap: 'Jabal Ario Dewantoro',
    nis: '2021001',
    kelas: 'XI',
    jurusan: 'RPL',
    perusahaan: 'PT. Teknologi Nusantara',
    alamatPerusahaan: 'Jl. HR Muhammad No. 123, Surabaya',
    telepon: '031-5551234',
    pembimbing: 'Suryanto, S.Pd',
    nipPembimbing: '197501012000031001',
    tanggalMulai: '01/07/2024',
    tanggalSelesai: '30/09/2024',
    status: 'Berlangsung',
    pendaftaranPending: 0,
    totalPendaftaran: 3,
  };

  const riwayatPendaftaran = [
    {
      id: 1,
      perusahaan: 'PT. Teknologi Nusantara',
      tanggalDaftar: '15 Juni 2024',
      status: 'Diterima',
      statusColor: 'bg-green-100 text-green-700',
    },
    {
      id: 2,
      perusahaan: 'CV. Digital Kreativa',
      tanggalDaftar: '10 Juni 2024',
      status: 'Ditolak',
      statusColor: 'bg-red-100 text-red-700',
    },
    {
      id: 3,
      perusahaan: 'PT. Inovasi Mandiri',
      tanggalDaftar: '5 Juni 2024',
      status: 'Ditolak',
      statusColor: 'bg-red-100 text-red-700',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Magang Siswa</h1>
        <p className="text-cyan-50">Cari tempat magang dan pantau status pendaftaran Anda</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200 w-fit">
        <button
          onClick={() => setActiveTab('status')}
          className={`px-6 py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'status'
              ? 'bg-purple-500 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" />
          Status Magang Saya
        </button>
        <button
          onClick={() => setActiveTab('cari')}
          className={`px-6 py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'cari'
              ? 'bg-purple-500 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Cari Tempat Magang
        </button>
      </div>

      {/* Tab Content: Status Magang */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          {/* Info Siswa & Pendaftaran */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {statusMagang.namaLengkap} • {statusMagang.nis}
                  </h2>
                  <p className="text-gray-600">
                    {statusMagang.kelas} • {statusMagang.jurusan}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-cyan-500">
                    {statusMagang.pendaftaranPending}/{statusMagang.totalPendaftaran}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Pendaftaran Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detail Magang Aktif */}
          <Card className="border-2 bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500 p-1.5 rounded-full">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Detail Magang Aktif</h3>
                </div>
                <Badge className="bg-green-500 text-white hover:bg-green-500 px-4 py-1">
                  {statusMagang.status}
                </Badge>
              </div>

              {/* Data Siswa */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Data Siswa</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                    <p className="font-medium text-gray-800">{statusMagang.namaLengkap}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">NIS</p>
                    <p className="font-medium text-gray-800">{statusMagang.nis}</p>
                  </div>
                </div>
              </div>

              {/* Tempat Magang */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Tempat Magang</h4>
                </div>
                <div className="pl-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{statusMagang.perusahaan}</p>
                      <div className="flex items-start gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{statusMagang.alamatPerusahaan}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Phone className="w-4 h-4" />
                        <span>{statusMagang.telepon}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guru Pembimbing */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Guru Pembimbing</h4>
                </div>
                <div className="pl-6 flex items-start gap-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{statusMagang.pembimbing}</p>
                    <p className="text-sm text-gray-600">NIP: {statusMagang.nipPembimbing}</p>
                  </div>
                </div>
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-6 pl-6">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-gray-700">Tanggal Mulai</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{statusMagang.tanggalMulai}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-gray-700">Tanggal Selesai</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{statusMagang.tanggalSelesai}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Riwayat Pendaftaran */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Riwayat Pendaftaran</h3>
            <div className="space-y-3">
              {riwayatPendaftaran.map((item) => (
                <Card key={item.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <Building2 className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{item.perusahaan}</p>
                          <p className="text-sm text-gray-600">{item.tanggalDaftar}</p>
                        </div>
                      </div>
                      <Badge className={`${item.statusColor} border-0`}>
                        {item.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Cari Tempat Magang */}
      {activeTab === 'cari' && (
        <div className="bg-white rounded-lg border p-8 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Fitur pencarian tempat magang akan segera hadir</p>
        </div>
      )}
    </div>
  );
}