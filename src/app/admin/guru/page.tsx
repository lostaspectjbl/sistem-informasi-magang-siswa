'use client';

import { useState, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase';
import { Database } from '@/types';

type Guru = Database['public']['Tables']['guru']['Row'];

interface GuruWithCount extends Guru {
  siswa_count?: number;
}

interface FormData {
  nip: string;
  nama: string;
  email: string;
  telepon: string;
  alamat: string;
}

export default function ManajemenGuruPage() {
  const [guruList, setGuruList] = useState<GuruWithCount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalGuru: 0,
    guruAktif: 0,
    totalSiswaBimbingan: 0,
    rataRataSiswa: 0,
  });

  const [form, setForm] = useState<FormData>({
    nip: '',
    nama: '',
    email: '',
    telepon: '',
    alamat: '',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      setLoading(true);
      await Promise.all([
        fetchGuru(),
        fetchStats(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchGuru() {
    try {
      // Fetch guru with siswa count
      const { data, error } = await (supabase as any)
        .from('guru')
        .select(`
          *,
          siswa (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include siswa count
      const guruWithCount: GuruWithCount[] = (data || []).map((guru: any) => ({
        ...guru,
        siswa_count: guru.siswa?.[0]?.count || 0,
      }));

      setGuruList(guruWithCount);
    } catch (error) {
      console.error('Error fetching guru:', error);
    }
  }

  async function fetchStats() {
    try {
      // Total Guru
      const { count: totalGuru } = await (supabase as any)
        .from('guru')
        .select('*', { count: 'exact', head: true });

      // Total Siswa dengan Pembimbing
      const { count: totalSiswaBimbingan } = await (supabase as any)
        .from('siswa')
        .select('*', { count: 'exact', head: true })
        .not('guru_id', 'is', null);

      // Guru Aktif (yang punya siswa)
      const { data: guruWithSiswa } = await (supabase as any)
        .from('guru')
        .select('id, siswa (count)')
        .gt('siswa.count', 0);

      const guruAktif = guruWithSiswa?.length || 0;
      const rataRataSiswa = totalGuru && totalGuru > 0 
        ? Math.round((totalSiswaBimbingan || 0) / totalGuru) 
        : 0;

      setStats({
        totalGuru: totalGuru || 0,
        guruAktif,
        totalSiswaBimbingan: totalSiswaBimbingan || 0,
        rataRataSiswa,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingId) {
        // Update
        const { error } = await (supabase as any)
          .from('guru')
          .update({
            nip: form.nip,
            nama: form.nama,
            email: form.email,
            telepon: form.telepon,
            alamat: form.alamat,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        alert('Guru berhasil diupdate!');
      } else {
        // Insert
        const { error } = await (supabase as any)
          .from('guru')
          .insert([{
            nip: form.nip,
            nama: form.nama,
            email: form.email,
            telepon: form.telepon,
            alamat: form.alamat,
          }]);

        if (error) throw error;
        alert('Guru berhasil ditambahkan!');
      }

      setShowDialog(false);
      resetForm();
      fetchAllData();
    } catch (error: any) {
      console.error('Error saving guru:', error);
      alert(`Error: ${error.message}`);
    }
  }

  async function handleDelete(id: number, nama: string) {
    if (!confirm(`Apakah Anda yakin ingin menghapus data guru ${nama}?`)) return;

    try {
      const { error } = await (supabase as any)
        .from('guru')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      alert('Guru berhasil dihapus!');
      fetchAllData();
    } catch (error: any) {
      console.error('Error deleting guru:', error);
      alert(`Error: ${error.message}`);
    }
  }

  function handleEdit(guru: GuruWithCount) {
    setForm({
      nip: guru.nip || '',
      nama: guru.nama,
      email: guru.email,
      telepon: guru.telepon || '',
      alamat: guru.alamat || '',
    });
    setEditingId(guru.id);
    setShowDialog(true);
  }

  function resetForm() {
    setForm({
      nip: '',
      nama: '',
      email: '',
      telepon: '',
      alamat: '',
    });
    setEditingId(null);
  }

  function handleCancel() {
    setShowDialog(false);
    resetForm();
  }

  // Filter data
  const filteredGuru = guruList.filter((guru) => {
    const hasStudents = (guru.siswa_count || 0) > 0;
    
    const matchSearch =
      guru.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guru.nip && guru.nip.includes(searchTerm)) ||
      guru.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = 
      filterStatus === 'Semua Status' || 
      (filterStatus === 'Aktif' && hasStudents) ||
      (filterStatus === 'Tidak Aktif' && !hasStudents);

    return matchSearch && matchStatus;
  });

  const statsCards = [
    { title: 'Total Guru', value: stats.totalGuru.toString(), subtitle: 'Guru terdaftar', icon: Users, color: 'text-gray-800' },
    { title: 'Guru Aktif', value: stats.guruAktif.toString(), subtitle: 'Guru aktif membimbing', icon: UserCheck, color: 'text-green-600' },
    { title: 'Total Siswa Bimbingan', value: stats.totalSiswaBimbingan.toString(), subtitle: 'Siswa dibimbing', icon: GraduationCap, color: 'text-blue-600' },
    { title: 'Rata-rata Siswa', value: stats.rataRataSiswa.toString(), subtitle: 'Per guru', icon: TrendingUp, color: 'text-purple-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ad46ff] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Guru</h1>
        <p className="text-gray-600">Kelola data guru pembimbing</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
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
            <Dialog open={showDialog} onOpenChange={(open) => {
              setShowDialog(open);
              if (!open) resetForm();
            }}>
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
                    <Label htmlFor="nip">NIP</Label>
                    <Input
                      id="nip"
                      value={form.nip}
                      onChange={(e) => setForm({ ...form, nip: e.target.value })}
                      placeholder="Masukkan NIP (opsional)"
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
                      <Label htmlFor="telepon">Telepon</Label>
                      <Input
                        id="telepon"
                        value={form.telepon}
                        onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                  </div>

                  {/* Alamat */}
                  <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat</Label>
                    <Input
                      id="alamat"
                      value={form.alamat}
                      onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                      placeholder="Masukkan alamat lengkap"
                    />
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
                <SelectItem value="Aktif">Aktif (Ada Siswa)</SelectItem>
                <SelectItem value="Tidak Aktif">Tidak Aktif (Belum Ada Siswa)</SelectItem>
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
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Kontak</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Alamat</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Siswa</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGuru.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Tidak ada data guru
                    </td>
                  </tr>
                ) : (
                  filteredGuru.map((guru) => {
                    const siswaCount = guru.siswa_count || 0;
                    const isActive = siswaCount > 0;
                    
                    return (
                      <tr key={guru.id} className="hover:bg-purple-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-600">{guru.nip || '-'}</td>
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
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Mail className="w-3 h-3 text-[#ad46ff]" />
                              {guru.email}
                            </div>
                            {guru.telepon && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Phone className="w-3 h-3 text-[#ad46ff]" />
                                {guru.telepon}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {guru.alamat || '-'}
                        </td>
                        <td className="px-4 py-4">
                          <Badge className="bg-yellow-100 text-yellow-700 border-0">
                            {siswaCount} siswa
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={`${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} border-0`}>
                            {isActive ? 'Aktif' : 'Tidak Aktif'}
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
                              onClick={() => handleDelete(guru.id, guru.nama)}
                              className="hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredGuru.length} dari {guruList.length} guru
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