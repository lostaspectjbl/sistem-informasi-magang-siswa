// File: src/app/siswa/jurnal/page.tsx
'use client';

import { Plus, FileText, CheckCircle, Clock, XCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function JurnalPage() {
  // Data dummy untuk contoh
  const statsData = [
    {
      title: 'Total Jurnal',
      value: '3',
      description: 'Jurnal yang telah dibuat',
      icon: FileText,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
    },
    {
      title: 'Disetujui',
      value: '1',
      description: 'Jurnal disetujui guru',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Menunggu',
      value: '1',
      description: 'Belum diverifikasi',
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Ditolak',
      value: '1',
      description: 'Perlu diperbaiki',
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  const jurnalData = [
    {
      tanggal: 'Min, 3 Mar 2024',
      kegiatan: 'Kegiatan:',
      deskripsi: 'Melanjutkan pengembangan frontend dengan ReactJs. Implementasi komponen dashboard dan integrasi dengan API.',
      status: 'Ditolak',
      statusColor: 'bg-red-100 text-red-700',
      feedback: 'Catatan Guru: Kegiatan terlalu singkat, tolong deskripsikan lebih...',
      feedbackBadge: 'Perlu diperbaiki',
    },
    {
      tanggal: 'Sab, 2 Mar 2024',
      kegiatan: 'Kegiatan:',
      deskripsi: 'Belajar backend Laravel untuk membangun REST API sistem kasir. Mempelajari konsep MVC dan routing.',
      status: 'Menunggu Verifikasi',
      statusColor: 'bg-yellow-100 text-yellow-700',
      feedback: 'Belum ada feedback',
      feedbackBadge: null,
    },
    {
      tanggal: 'Jum, 1 Mar 2024',
      kegiatan: 'Kegiatan:',
      deskripsi: 'Membuat desain UI aplikasi kasir menggunakan Figma. Melakukan analisis user experience dan wireframing untuk interface yang user-...',
      status: 'Disetujui',
      statusColor: 'bg-green-100 text-green-700',
      feedback: 'Catatan Guru: Bagus, lanjutkan dengan implementasi',
      feedbackBadge: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Jurnal Harian Magang</h1>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Jurnal
        </Button>
      </div>

      {/* Alert Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <FileText className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-800 mb-1">
            Jangan Lupa Jurnal Hari Ini!
          </h3>
          <p className="text-sm text-yellow-700">
            Anda belum membuat jurnal untuk hari ini. Dokumentasikan kegiatan magang Anda sekarang.
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-shrink-0">
          Buat Sekarang
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Riwayat Jurnal */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-cyan-500" />
            <h2 className="text-lg font-semibold text-gray-800">Riwayat Jurnal</h2>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3">
            <Input
              placeholder="Cari kegiatan atau kendala..."
              className="max-w-md"
            />
            <Button variant="outline" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Tampilkan Filter
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-600">Tampilkan:</span>
              <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-gray-600">per halaman</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kegiatan & Kendala
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback Guru
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jurnalData.map((jurnal, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {jurnal.tanggal}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 mb-1">{jurnal.kegiatan}</p>
                      <p className="text-gray-600 line-clamp-2">{jurnal.deskripsi}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`${jurnal.statusColor} border-0`}>
                      {jurnal.status}
                      {jurnal.feedbackBadge && (
                        <span className="block text-xs mt-0.5">{jurnal.feedbackBadge}</span>
                      )}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {jurnal.feedbackBadge ? (
                        <>
                          <p className="text-xs text-gray-500 mb-1">📝 Catatan Guru:</p>
                          <p className="text-gray-700">{jurnal.feedback}</p>
                        </>
                      ) : (
                        <p className="text-gray-500">{jurnal.feedback}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan 1 sampai 3 dari 3 entri
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