'use client';

import { useState } from 'react';
import { GraduationCap, Users, CheckCircle, XCircle, Search, Plus, Edit, Trash2, Calendar, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Magang {
  id: number;
  siswa: string;
  dudi: string;
  pembimbing: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'aktif' | 'selesai' | 'dibatalkan';
}

export default function ManajemenMagangPage() {
  const [magangList, setMagangList] = useState<Magang[]>([
    { id: 1, siswa: 'Ahmad Rizki Ramadhan', dudi: 'PT. Teknologi Nusantara', pembimbing: 'Suryanto, S.Pd', tanggalMulai: '2024-07-01', tanggalSelesai: '2024-09-30', status: 'aktif' },
    { id: 2, siswa: 'Siti Nurhaliza', dudi: 'CV. Digital Kreatifa', pembimbing: 'Suryanto, S.Pd', tanggalMulai: '2024-07-01', tanggalSelesai: '2024-09-30', status: 'aktif' },
    { id: 3, siswa: 'Budi Santoso', dudi: 'PT. Inovasi Mandiri', pembimbing: 'Kartika Sari, S.Kom', tanggalMulai: '2024-07-01', tanggalSelesai: '2024-09-30', status: 'aktif' },
    { id: 4, siswa: 'Dewi Lestari', dudi: 'PT. Media Interaktif', pembimbing: 'Suryanto, S.Pd', tanggalMulai: '2024-06-15', tanggalSelesai: '2024-09-15', status: 'selesai' },
    { id: 5, siswa: 'Eko Prasetyo', dudi: 'CV. Solusi Digital Indonesia', pembimbing: 'Kartika Sari, S.Kom', tanggalMulai: '2024-08-01', tanggalSelesai: '2024-10-31', status: 'aktif' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    siswa: '',
    dudi: '',
    pembimbing: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    status: 'aktif' as 'aktif' | 'selesai' | 'dibatalkan',
  });

  // Calculate stats
  const totalMagang = magangList.length;
  const sedangAktif = magangList.filter(m => m.status === 'aktif').length;
  const selesai = magangList.filter(m => m.status === 'selesai').length;
  const dibatalkan = magangList.filter(m => m.status === 'dibatalkan').length;

  const stats = [
    { title: 'Total Magang', value: totalMagang, color: 'text-gray-800' },
    { title: 'Sedang Aktif', value: sedangAktif, color: 'text-blue-600' },
    { title: 'Selesai', value: selesai, color: 'text-green-600' },
    { title: 'Dibatalkan', value: dibatalkan, color: 'text-red-600' },
  ];

  // Filter data
  const filteredMagang = magangList.filter((magang) => {
    const matchSearch =
      magang.siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      magang.dudi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      magang.pembimbing.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'Semua Status' ||
      (filterStatus === 'Aktif' && magang.status === 'aktif') ||
      (filterStatus === 'Selesai' && magang.status === 'selesai') ||
      (filterStatus === 'Dibatalkan' && magang.status === 'dibatalkan');

    return matchSearch && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.siswa && form.dudi && form.pembimbing && form.tanggalMulai && form.tanggalSelesai) {
      if (editingId) {
        // Update existing magang
        setMagangList(magangList.map(m =>
          m.id === editingId
            ? { ...m, siswa: form.siswa, dudi: form.dudi, pembimbing: form.pembimbing, tanggalMulai: form.tanggalMulai, tanggalSelesai: form.tanggalSelesai, status: form.status }
            : m
        ));
        setEditingId(null);
      } else {
        // Add new magang
        const newMagang: Magang = {
          id: Math.max(...magangList.map(m => m.id), 0) + 1,
          siswa: form.siswa,
          dudi: form.dudi,
          pembimbing: form.pembimbing,
          tanggalMulai: form.tanggalMulai,
          tanggalSelesai: form.tanggalSelesai,
          status: form.status,
        };
        setMagangList([...magangList, newMagang]);
      }

      // Reset form
      setForm({ siswa: '', dudi: '', pembimbing: '', tanggalMulai: '', tanggalSelesai: '', status: 'aktif' });
      setShowDialog(false);
    }
  };

  const handleEdit = (magang: Magang) => {
    setForm({
      siswa: magang.siswa,
      dudi: magang.dudi,
      pembimbing: magang.pembimbing,
      tanggalMulai: magang.tanggalMulai,
      tanggalSelesai: magang.tanggalSelesai,
      status: magang.status,
    });
    setEditingId(magang.id);
    setShowDialog(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data magang ini?')) {
      setMagangList(magangList.filter(m => m.id !== id));
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setEditingId(null);
    setForm({ siswa: '', dudi: '', pembimbing: '', tanggalMulai: '', tanggalSelesai: '', status: 'aktif' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktif':
        return 'bg-blue-100 text-blue-700';
      case 'selesai':
        return 'bg-green-100 text-green-700';
      case 'dibatalkan':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Magang</h1>
        <p className="text-gray-600">Kelola penempatan dan monitoring magang siswa</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
              <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#0891b2]" />
              <h2 className="text-lg font-semibold text-gray-800">Data Magang</h2>
            </div>

            {/* Tambah Magang Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <Button
                onClick={() => setShowDialog(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Magang
              </Button>

              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {editingId ? 'Edit Data Magang' : 'Tambah Data Magang Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    Lengkapi informasi penempatan magang siswa
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  {/* Siswa */}
                  <div className="space-y-2">
                    <Label htmlFor="siswa">
                      Nama Siswa <span className="text-red-500">*</span>
                    </Label>
                    <Select value={form.siswa} onValueChange={(value) => setForm({ ...form, siswa: value })}>
                      <SelectTrigger id="siswa">
                        <SelectValue placeholder="Pilih Siswa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ahmad Rizki Ramadhan">Ahmad Rizki Ramadhan</SelectItem>
                        <SelectItem value="Siti Nurhaliza">Siti Nurhaliza</SelectItem>
                        <SelectItem value="Budi Santoso">Budi Santoso</SelectItem>
                        <SelectItem value="Dewi Lestari">Dewi Lestari</SelectItem>
                        <SelectItem value="Eko Prasetyo">Eko Prasetyo</SelectItem>
                        <SelectItem value="Fajar Pratama">Fajar Pratama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* DUDI */}
                  <div className="space-y-2">
                    <Label htmlFor="dudi">
                      DUDI (Tempat Magang) <span className="text-red-500">*</span>
                    </Label>
                    <Select value={form.dudi} onValueChange={(value) => setForm({ ...form, dudi: value })}>
                      <SelectTrigger id="dudi">
                        <SelectValue placeholder="Pilih DUDI" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PT. Teknologi Nusantara">PT. Teknologi Nusantara</SelectItem>
                        <SelectItem value="CV. Digital Kreatifa">CV. Digital Kreatifa</SelectItem>
                        <SelectItem value="PT. Inovasi Mandiri">PT. Inovasi Mandiri</SelectItem>
                        <SelectItem value="PT. Media Interaktif">PT. Media Interaktif</SelectItem>
                        <SelectItem value="CV. Solusi Digital Indonesia">CV. Solusi Digital Indonesia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pembimbing */}
                  <div className="space-y-2">
                    <Label htmlFor="pembimbing">
                      Guru Pembimbing <span className="text-red-500">*</span>
                    </Label>
                    <Select value={form.pembimbing} onValueChange={(value) => setForm({ ...form, pembimbing: value })}>
                      <SelectTrigger id="pembimbing">
                        <SelectValue placeholder="Pilih Guru Pembimbing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Suryanto, S.Pd">Suryanto, S.Pd</SelectItem>
                        <SelectItem value="Kartika Sari, S.Kom">Kartika Sari, S.Kom</SelectItem>
                        <SelectItem value="Agus Wahyudi, S.T">Agus Wahyudi, S.T</SelectItem>
                        <SelectItem value="Rina Puspitasari, S.Pd">Rina Puspitasari, S.Pd</SelectItem>
                        <SelectItem value="Bambang Priyanto, S.Kom">Bambang Priyanto, S.Kom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Periode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tanggalMulai">
                        Tanggal Mulai <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tanggalMulai"
                        type="date"
                        value={form.tanggalMulai}
                        onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tanggalSelesai">
                        Tanggal Selesai <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tanggalSelesai"
                        type="date"
                        value={form.tanggalSelesai}
                        onChange={(e) => setForm({ ...form, tanggalSelesai: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select value={form.status} onValueChange={(value: 'aktif' | 'selesai' | 'dibatalkan') => setForm({ ...form, status: value })}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="selesai">Selesai</SelectItem>
                        <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Batal
                    </Button>
                    <Button type="submit" className="bg-[#0891b2] hover:bg-[#0e7490] text-white">
                      {editingId ? 'Simpan Perubahan' : 'Tambah Magang'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari siswa, DUDI, atau guru..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Status">Semua Status</SelectItem>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600 whitespace-nowrap">data</span>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Siswa</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">DUDI</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Pembimbing</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Periode</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMagang.map((magang) => (
                  <tr key={magang.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-gray-800">{magang.siswa}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{magang.dudi}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{magang.pembimbing}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar className="w-3 h-3 text-[#ad46ff]" />
                        <span>{formatDate(magang.tanggalMulai)} - {formatDate(magang.tanggalSelesai)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={`${getStatusColor(magang.status)} border-0`}>
                        {magang.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(magang)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(magang.id)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
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
              Halaman 1 dari 1
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled>
                ‹‹
              </Button>
              <Button size="sm" variant="outline" disabled>
                ‹
              </Button>
              <Button size="sm" className="bg-[#ad46ff] hover:bg-[#9b36f0] text-white">
                1
              </Button>
              <Button size="sm" variant="outline" disabled>
                ›
              </Button>
              <Button size="sm" variant="outline" disabled>
                ››
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}