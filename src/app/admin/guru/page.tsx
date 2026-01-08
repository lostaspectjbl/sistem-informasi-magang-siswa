'use client';

import { useState } from 'react';
import { Users, UserCheck, GraduationCap, TrendingUp, Search, Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

interface Guru {
  id: number;
  nip: string;
  nama: string;
  mataPelajaran: string;
  email: string;
  telepon: string;
  status: 'aktif' | 'tidak aktif';
  siswa: number;
}

export default function ManajemenGuruPage() {
  const [guruList, setGuruList] = useState<Guru[]>([
    { id: 1, nip: '197501012000031001', nama: 'Suryanto, S.Pd', mataPelajaran: 'Pemrograman Web & Mobile', email: 'suryanto@teacher.sch.id', telepon: '081234567800', status: 'aktif', siswa: 4 },
    { id: 2, nip: '198002052005012002', nama: 'Kartika Sari, S.Kom', mataPelajaran: 'Basis Data & Sistem Informasi', email: 'kartika@teacher.sch.id', telepon: '081234567801', status: 'aktif', siswa: 2 },
    { id: 3, nip: '198505152010011003', nama: 'Agus Wahyudi, S.T', mataPelajaran: 'Jaringan Komputer', email: 'agus@teacher.sch.id', telepon: '081234567802', status: 'aktif', siswa: 0 },
    { id: 4, nip: '199003202015012004', nama: 'Rina Puspitasari, S.Pd', mataPelajaran: 'Desain Grafis & Multimedia', email: 'rina@teacher.sch.id', telepon: '081234567803', status: 'aktif', siswa: 0 },
    { id: 5, nip: '198812252012011005', nama: 'Bambang Priyanto, S.Kom', mataPelajaran: 'Pemrograman Desktop & Game', email: 'bambang@teacher.sch.id', telepon: '081234567804', status: 'aktif', siswa: 0 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [entriesPerPage, setEntriesPerPage] = useState('5');
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nip: '',
    nama: '',
    mataPelajaran: '',
    email: '',
    telepon: '',
    status: 'aktif' as 'aktif' | 'tidak aktif',
  });

  // Calculate stats
  const totalGuru = guruList.length;
  const guruAktif = guruList.filter(g => g.status === 'aktif').length;
  const totalSiswaBimbingan = guruList.reduce((sum, g) => sum + g.siswa, 0);
  const rataRataSiswa = totalGuru > 0 ? Math.round(totalSiswaBimbingan / totalGuru) : 0;

  const stats = [
    { title: 'Total Guru', value: totalGuru.toString(), subtitle: 'Guru terdaftar', icon: Users, color: 'text-gray-800' },
    { title: 'Guru Aktif', value: guruAktif.toString(), subtitle: 'Guru aktif mengajar', icon: UserCheck, color: 'text-green-600' },
    { title: 'Total Siswa Bimbingan', value: totalSiswaBimbingan.toString(), subtitle: 'Siswa dibimbing', icon: GraduationCap, color: 'text-blue-600' },
    { title: 'Rata-rata Siswa', value: rataRataSiswa.toString(), subtitle: 'Per guru', icon: TrendingUp, color: 'text-purple-600' },
  ];

  // Filter data
  const filteredGuru = guruList.filter((guru) => {
    const matchSearch =
      guru.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guru.nip.includes(searchTerm) ||
      guru.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'Semua Status' || 
      (filterStatus === 'Aktif' && guru.status === 'aktif') ||
      (filterStatus === 'Tidak Aktif' && guru.status === 'tidak aktif');

    return matchSearch && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.nip && form.nama && form.mataPelajaran && form.email && form.telepon) {
      if (editingId) {
        // Update existing guru
        setGuruList(guruList.map(g =>
          g.id === editingId
            ? { ...g, nip: form.nip, nama: form.nama, mataPelajaran: form.mataPelajaran, email: form.email, telepon: form.telepon, status: form.status }
            : g
        ));
        setEditingId(null);
      } else {
        // Add new guru
        const newGuru: Guru = {
          id: Math.max(...guruList.map(g => g.id), 0) + 1,
          nip: form.nip,
          nama: form.nama,
          mataPelajaran: form.mataPelajaran,
          email: form.email,
          telepon: form.telepon,
          status: form.status,
          siswa: 0,
        };
        setGuruList([...guruList, newGuru]);
      }

      // Reset form
      setForm({ nip: '', nama: '', mataPelajaran: '', email: '', telepon: '', status: 'aktif' });
      setShowDialog(false);
    }
  };

  const handleEdit = (guru: Guru) => {
    setForm({
      nip: guru.nip,
      nama: guru.nama,
      mataPelajaran: guru.mataPelajaran,
      email: guru.email,
      telepon: guru.telepon,
      status: guru.status,
    });
    setEditingId(guru.id);
    setShowDialog(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
      setGuruList(guruList.filter(g => g.id !== id));
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setEditingId(null);
    setForm({ nip: '', nama: '', mataPelajaran: '', email: '', telepon: '', status: 'aktif' });
  };

  const getStatusColor = (status: string) => {
    return status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Guru</h1>
        <p className="text-gray-600">Kelola data guru pembimbing</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#ad46ff]" />
              <h2 className="text-lg font-semibold text-gray-800">Data Guru</h2>
            </div>

            {/* Tambah Guru Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <Button
                onClick={() => setShowDialog(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Guru
              </Button>

              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {editingId ? 'Edit Guru' : 'Tambah Guru Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    Lengkapi semua informasi yang diperlukan
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  {/* NIP */}
                  <div className="space-y-2">
                    <Label htmlFor="nip">
                      NIP <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nip"
                      value={form.nip}
                      onChange={(e) => setForm({ ...form, nip: e.target.value })}
                      placeholder="Masukkan NIP"
                      required
                    />
                  </div>

                  {/* Nama */}
                  <div className="space-y-2">
                    <Label htmlFor="nama">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nama"
                      value={form.nama}
                      onChange={(e) => setForm({ ...form, nama: e.target.value })}
                      placeholder="Masukkan nama lengkap dengan gelar"
                      required
                    />
                  </div>

                  {/* Mata Pelajaran */}
                  <div className="space-y-2">
                    <Label htmlFor="mataPelajaran">
                      Mata Pelajaran / Bidang Keahlian <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mataPelajaran"
                      value={form.mataPelajaran}
                      onChange={(e) => setForm({ ...form, mataPelajaran: e.target.value })}
                      placeholder="Contoh: Pemrograman Web & Mobile"
                      required
                    />
                  </div>

                  {/* Email & Telepon */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@teacher.sch.id"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telepon">
                        Telepon <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="telepon"
                        value={form.telepon}
                        onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select value={form.status} onValueChange={(value: 'aktif' | 'tidak aktif') => setForm({ ...form, status: value })}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Batal
                    </Button>
                    <Button type="submit" className="bg-[#0891b2] hover:bg-[#0e7490] text-white">
                      {editingId ? 'Simpan Perubahan' : 'Tambah Guru'}
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
                placeholder="Cari guru..."
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
                <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
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
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">NIP</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Nama</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Mata Pelajaran</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Kontak</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Siswa</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGuru.map((guru) => (
                  <tr key={guru.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-600">{guru.nip}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-[#0891b2]">
                          <AvatarFallback className="bg-purple-500 text-white text-xs">
                            {guru.nama.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-800">{guru.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{guru.mataPelajaran}</td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail className="w-3 h-3 text-[#ad46ff]" />
                          {guru.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone className="w-3 h-3 text-[#ad46ff]" />
                          {guru.telepon}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className="bg-yellow-100 text-yellow-700 border-0">
                        {guru.siswa} siswa
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={`${getStatusColor(guru.status)} border-0`}>
                        {guru.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(guru)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(guru.id)}
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