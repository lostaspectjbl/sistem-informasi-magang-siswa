'use client';

import { useState } from 'react';
import { Plus, FileText, CheckCircle, Clock, XCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Jurnal {
  id: number;
  tanggal: string;
  kegiatan: string;
  kendala: string;
  status: 'Disetujui' | 'Menunggu Verifikasi' | 'Ditolak';
  feedback: string;
}

export default function JurnalPage() {
  const [jurnalList, setJurnalList] = useState<Jurnal[]>([
    {
      id: 1,
      tanggal: '2024-03-01',
      kegiatan: 'Membuat desain UI aplikasi kasir menggunakan Figma. Melakukan analisis user experience dan wireframing untuk interface yang user-friendly.',
      kendala: 'Tidak ada kendala berarti',
      status: 'Disetujui',
      feedback: 'Bagus, lanjutkan dengan implementasi',
    },
    {
      id: 2,
      tanggal: '2024-03-02',
      kegiatan: 'Belajar backend Laravel untuk membangun REST API sistem kasir. Mempelajari konsep MVC dan routing.',
      kendala: 'Error saat menjalankan migration database dan kesulitan memahami relationship antar tabel',
      status: 'Menunggu Verifikasi',
      feedback: '',
    },
    {
      id: 3,
      tanggal: '2024-03-03',
      kegiatan: 'Melanjutkan pengembangan frontend dengan ReactJs. Implementasi komponen dashboard dan integrasi dengan API.',
      kendala: 'Kesulitan mengintegrasikan API dengan frontend',
      status: 'Ditolak',
      feedback: 'Kegiatan terlalu singkat, tolong deskripsikan lebih detail',
    },
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingJurnal, setViewingJurnal] = useState<Jurnal | null>(null);
  const [form, setForm] = useState({
    tanggal: '',
    kegiatan: '',
    kendala: '',
  });

  // Stats calculation
  const totalJurnal = jurnalList.length;
  const disetujui = jurnalList.filter(j => j.status === 'Disetujui').length;
  const menunggu = jurnalList.filter(j => j.status === 'Menunggu Verifikasi').length;
  const ditolak = jurnalList.filter(j => j.status === 'Ditolak').length;

  const statsData = [
    {
      title: 'Total Jurnal',
      value: totalJurnal.toString(),
      description: 'Jurnal yang telah dibuat',
      icon: FileText,
      color: 'text-[#ad46ff]',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Disetujui',
      value: disetujui.toString(),
      description: 'Jurnal disetujui guru',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Menunggu',
      value: menunggu.toString(),
      description: 'Belum diverifikasi',
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Ditolak',
      value: ditolak.toString(),
      description: 'Perlu diperbaiki',
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.tanggal && form.kegiatan && form.kendala) {
      if (editingId) {
        // Update existing jurnal
        setJurnalList(jurnalList.map(j =>
          j.id === editingId
            ? { ...j, tanggal: form.tanggal, kegiatan: form.kegiatan, kendala: form.kendala }
            : j
        ));
        setEditingId(null);
      } else {
        // Add new jurnal
        const newJurnal: Jurnal = {
          id: Math.max(...jurnalList.map(j => j.id), 0) + 1,
          tanggal: form.tanggal,
          kegiatan: form.kegiatan,
          kendala: form.kendala,
          status: 'Menunggu Verifikasi',
          feedback: '',
        };
        setJurnalList([...jurnalList, newJurnal]);
      }

      // Reset form
      setForm({ tanggal: '', kegiatan: '', kendala: '' });
      setShowDialog(false);
    }
  };

  const handleEdit = (jurnal: Jurnal) => {
    setForm({
      tanggal: jurnal.tanggal,
      kegiatan: jurnal.kegiatan,
      kendala: jurnal.kendala,
    });
    setEditingId(jurnal.id);
    setShowDialog(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus jurnal ini?')) {
      setJurnalList(jurnalList.filter(j => j.id !== id));
    }
  };

  const handleView = (jurnal: Jurnal) => {
    setViewingJurnal(jurnal);
    setShowDetailDialog(true);
  };

  const handleCancel = () => {
    setShowDialog(false);
    setEditingId(null);
    setForm({ tanggal: '', kegiatan: '', kendala: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return 'bg-green-100 text-green-700';
      case 'Menunggu Verifikasi':
        return 'bg-yellow-100 text-yellow-700';
      case 'Ditolak':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Jurnal Harian Magang</h1>
        <Button 
          onClick={() => setShowDialog(true)}
          className="bg-[#ad46ff] hover:bg-[#9b36f0] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Jurnal
        </Button>
      </div>

      {/* Alert Info - Only show if no journal today */}
      {!jurnalList.some(j => j.tanggal === new Date().toISOString().split('T')[0]) && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
          <FileText className="w-5 h-5 text-[#ad46ff] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-purple-900 mb-1">
              Jangan Lupa Jurnal Hari Ini!
            </h3>
            <p className="text-sm text-purple-700">
              Anda belum membuat jurnal untuk hari ini. Dokumentasikan kegiatan magang Anda sekarang.
            </p>
          </div>
          <Button 
            onClick={() => {
              setForm({ ...form, tanggal: new Date().toISOString().split('T')[0] });
              setShowDialog(true);
            }}
            className="bg-[#ad46ff] hover:bg-[#9b36f0] text-white flex-shrink-0"
          >
            Buat Sekarang
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border--200 p-5 hover:shadow-md transition-shadow"
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
            <FileText className="w-5 h-5 text-[#ad46ff]" />
            <h2 className="text-lg font-semibold text-gray-800">Riwayat Jurnal</h2>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3">
            <Input
              placeholder="Cari kegiatan atau kendala..."
              className="max-w-md"
            />
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
              {jurnalList.map((jurnal) => (
                <tr key={jurnal.id} className="hover:bg-purple-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(jurnal.tanggal)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 mb-1">Kegiatan:</p>
                      <p className="text-gray-600 line-clamp-2 mb-2">{jurnal.kegiatan}</p>
                      <p className="font-medium text-gray-900 mb-1">Kendala:</p>
                      <p className="text-gray-600 line-clamp-2">{jurnal.kendala}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`${getStatusColor(jurnal.status)} border-0`}>
                      {jurnal.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {jurnal.feedback ? (
                        <>
                          <p className="text-xs text-gray-500 mb-1">📝 Catatan Guru:</p>
                          <p className="text-gray-700">{jurnal.feedback}</p>
                        </>
                      ) : (
                        <p className="text-gray-500">Belum ada feedback</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleView(jurnal)}
                        className="text-gray-400 hover:text-[#ad46ff] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(jurnal)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(jurnal.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
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
            Menampilkan 1 sampai {jurnalList.length} dari {jurnalList.length} entri
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              ‹‹
            </Button>
            <Button variant="outline" size="sm" disabled>
              ‹
            </Button>
            <Button size="sm" className="bg-[#ad46ff] hover:bg-[#9b36f0] text-white">
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

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingId ? 'Edit Jurnal' : 'Tambah Jurnal Baru'}
            </DialogTitle>
            <DialogDescription>
              Dokumentasikan kegiatan magang Anda hari ini
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Tanggal */}
            <div className="space-y-2">
              <Label htmlFor="tanggal">
                Tanggal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tanggal"
                type="date"
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                required
              />
            </div>

            {/* Kegiatan */}
            <div className="space-y-2">
              <Label htmlFor="kegiatan">
                Kegiatan <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="kegiatan"
                value={form.kegiatan}
                onChange={(e) => setForm({ ...form, kegiatan: e.target.value })}
                placeholder="Deskripsikan kegiatan yang Anda lakukan hari ini..."
                rows={5}
                required
              />
            </div>

            {/* Kendala */}
            <div className="space-y-2">
              <Label htmlFor="kendala">
                Kendala <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="kendala"
                value={form.kendala}
                onChange={(e) => setForm({ ...form, kendala: e.target.value })}
                placeholder="Jelaskan kendala yang dihadapi (jika tidak ada, tuliskan 'Tidak ada kendala')"
                rows={4}
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Batal
              </Button>
              <Button type="submit" className="bg-[#ad46ff] hover:bg-[#9b36f0]">
                {editingId ? 'Simpan Perubahan' : 'Tambah Jurnal'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Detail Jurnal Harian
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap jurnal harian siswa
            </DialogDescription>
          </DialogHeader>

          {viewingJurnal && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-gray-600">Tanggal</Label>
                <p className="font-medium">{formatDate(viewingJurnal.tanggal)}</p>
              </div>

              <div>
                <Label className="text-gray-600">Kegiatan</Label>
                <p className="text-sm text-gray-800 mt-1">{viewingJurnal.kegiatan}</p>
              </div>

              <div>
                <Label className="text-gray-600">Kendala</Label>
                <p className="text-sm text-gray-800 mt-1">{viewingJurnal.kendala}</p>
              </div>

              <div>
                <Label className="text-gray-600">Status</Label>
                <div className="mt-1">
                  <Badge className={`${getStatusColor(viewingJurnal.status)} border-0`}>
                    {viewingJurnal.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-gray-600">Feedback Guru</Label>
                <p className="text-sm text-gray-800 mt-1">
                  {viewingJurnal.feedback || 'Belum ada feedback dari guru'}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}