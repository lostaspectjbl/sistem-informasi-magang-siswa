'use client';

import { useState, useEffect } from 'react';
import { Users, GraduationCap, CheckCircle, UserX, Search, Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types';

type Siswa = Database['public']['Tables']['siswa']['Row'];
type Guru = Database['public']['Tables']['guru']['Row'];
type Dudi = Database['public']['Tables']['dudi']['Row'];

interface SiswaWithRelations extends Siswa {
  guru?: { nama: string } | null;
  dudi?: { nama_perusahaan: string } | null;
  magang?: Array<{ status: string }>;
}

interface FormData {
  nama: string;
  nis: string;
  email: string;
  kelas: string;
  jurusan: string;
  telepon: string;
  alamat: string;
  status: string;
  guru_id: number | null;
  dudi_id: number | null;
}

export default function ManajemenSiswaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [filterKelas, setFilterKelas] = useState('Semua Kelas');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSiswaId, setEditingSiswaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [siswaData, setSiswaData] = useState<SiswaWithRelations[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [dudiList, setDudiList] = useState<Dudi[]>([]);
  
  const [stats, setStats] = useState({
    totalSiswa: 0,
    sedangMagang: 0,
    selesaiMagang: 0,
    belumAdaPembimbing: 0,
  });

  const [formData, setFormData] = useState<FormData>({
    nama: '',
    nis: '',
    email: '',
    kelas: '',
    jurusan: '',
    telepon: '',
    alamat: '',
    status: 'aktif',
    guru_id: null,
    dudi_id: null,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      setLoading(true);
      await Promise.all([
        fetchSiswa(),
        fetchGuru(),
        fetchDudi(),
        fetchStats(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSiswa() {
    try {
      const { data, error } = await supabase
        .from('siswa')
        .select(`
          *,
          guru:guru_id (nama),
          dudi:dudi_id (nama_perusahaan),
          magang (status)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSiswaData(data || []);
    } catch (error) {
      console.error('Error fetching siswa:', error);
    }
  }

  async function fetchGuru() {
    try {
      const { data, error } = await supabase
        .from('guru')
        .select('*')
        .order('nama');

      if (error) throw error;
      setGuruList(data || []);
    } catch (error) {
      console.error('Error fetching guru:', error);
    }
  }

  async function fetchDudi() {
    try {
      const { data, error } = await supabase
        .from('dudi')
        .select('*')
        .eq('status', 'aktif')
        .order('nama_perusahaan');

      if (error) throw error;
      setDudiList(data || []);
    } catch (error) {
      console.error('Error fetching dudi:', error);
    }
  }

  async function fetchStats() {
    try {
      // Total Siswa
      const { count: totalSiswa } = await supabase
        .from('siswa')
        .select('*', { count: 'exact', head: true });

      // Sedang Magang (status aktif di tabel magang)
      const { count: sedangMagang } = await supabase
        .from('magang')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aktif');

      // Selesai Magang
      const { count: selesaiMagang } = await supabase
        .from('magang')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'selesai');

      // Belum Ada Pembimbing
      const { count: belumAdaPembimbing } = await supabase
        .from('siswa')
        .select('*', { count: 'exact', head: true })
        .is('guru_id', null);

      setStats({
        totalSiswa: totalSiswa || 0,
        sedangMagang: sedangMagang || 0,
        selesaiMagang: selesaiMagang || 0,
        belumAdaPembimbing: belumAdaPembimbing || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      if (isEditMode && editingSiswaId) {
        // Update
        const { error } = await (supabase as any)
          .from('siswa')
          .update({
            nama: formData.nama,
            nis: formData.nis,
            email: formData.email,
            kelas: formData.kelas,
            jurusan: formData.jurusan,
            telepon: formData.telepon,
            alamat: formData.alamat,
            status: formData.status,
            guru_id: formData.guru_id,
            dudi_id: formData.dudi_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSiswaId);

        if (error) throw error;
        alert('Siswa berhasil diupdate!');
      } else {
        // Insert
        const { error } = await (supabase as any)
          .from('siswa')
          .insert([{
            nama: formData.nama,
            nis: formData.nis,
            email: formData.email,
            kelas: formData.kelas,
            jurusan: formData.jurusan,
            telepon: formData.telepon,
            alamat: formData.alamat,
            status: formData.status,
            guru_id: formData.guru_id,
            dudi_id: formData.dudi_id,
          }]);

        if (error) throw error;
        alert('Siswa berhasil ditambahkan!');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchAllData();
    } catch (error: any) {
      console.error('Error saving siswa:', error);
      alert(`Error: ${error.message}`);
    }
  }

  async function handleDelete(id: number, nama: string) {
    if (!confirm(`Apakah Anda yakin ingin menghapus siswa ${nama}?`)) return;

    try {
      const { error } = await supabase
        .from('siswa')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      alert('Siswa berhasil dihapus!');
      fetchAllData();
    } catch (error: any) {
      console.error('Error deleting siswa:', error);
      alert(`Error: ${error.message}`);
    }
  }

  function handleEdit(siswa: SiswaWithRelations) {
    setIsEditMode(true);
    setEditingSiswaId(siswa.id);
    setFormData({
      nama: siswa.nama,
      nis: siswa.nis,
      email: siswa.email,
      kelas: siswa.kelas || '',
      jurusan: siswa.jurusan || '',
      telepon: siswa.telepon || '',
      alamat: siswa.alamat || '',
      status: siswa.status,
      guru_id: siswa.guru_id,
      dudi_id: siswa.dudi_id,
    });
    setIsDialogOpen(true);
  }

  function resetForm() {
    setFormData({
      nama: '',
      nis: '',
      email: '',
      kelas: '',
      jurusan: '',
      telepon: '',
      alamat: '',
      status: 'aktif',
      guru_id: null,
      dudi_id: null,
    });
    setIsEditMode(false);
    setEditingSiswaId(null);
  }

  function getStatusInfo(siswa: SiswaWithRelations) {
    const magangAktif = siswa.magang?.find(m => m.status === 'aktif');
    const magangSelesai = siswa.magang?.find(m => m.status === 'selesai');

    if (magangAktif) {
      return { label: 'Magang', color: 'bg-blue-100 text-blue-700' };
    } else if (magangSelesai) {
      return { label: 'Selesai', color: 'bg-green-100 text-green-700' };
    } else if (siswa.status === 'aktif') {
      return { label: 'Aktif', color: 'bg-green-100 text-green-700' };
    }
    return { label: siswa.status, color: 'bg-gray-100 text-gray-700' };
  }

  // Filter data
  const filteredSiswa = siswaData.filter((siswa) => {
    const statusInfo = getStatusInfo(siswa);
    const kelasValue = siswa.kelas?.split(' ')[0] || '';
    
    const matchSearch = 
      siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      siswa.nis.includes(searchTerm) ||
      (siswa.kelas && siswa.kelas.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchStatus = filterStatus === 'Semua Status' || statusInfo.label === filterStatus;
    const matchKelas = filterKelas === 'Semua Kelas' || kelasValue.includes(filterKelas);

    return matchSearch && matchStatus && matchKelas;
  });

  const statsCards = [
    { title: 'Total Siswa', value: stats.totalSiswa.toString(), subtitle: 'Siswa terdaftar', icon: Users, color: 'text-gray-800' },
    { title: 'Sedang Magang', value: stats.sedangMagang.toString(), subtitle: 'Aktif magang', icon: GraduationCap, color: 'text-blue-600' },
    { title: 'Selesai Magang', value: stats.selesaiMagang.toString(), subtitle: 'Telah selesai', icon: CheckCircle, color: 'text-green-600' },
    { title: 'Belum Ada Pembimbing', value: stats.belumAdaPembimbing.toString(), subtitle: 'Perlu penugasan', icon: UserX, color: 'text-red-600' },
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Siswa</h1>
        <p className="text-gray-600">Kelola data siswa dan penugasan magang</p>
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
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#ad46ff]" />
              Data Siswa
            </CardTitle>

            {/* Tambah Siswa Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-[#ad46ff] hover:bg-[#9b36f0] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Siswa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#ad46ff]" />
                    {isEditMode ? 'Edit Siswa' : 'Tambah Siswa'}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  {/* NIS & Nama */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nis">NIS *</Label>
                      <Input 
                        id="nis" 
                        placeholder="Masukkan NIS" 
                        value={formData.nis}
                        onChange={(e) => setFormData({...formData, nis: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Lengkap *</Label>
                      <Input 
                        id="nama" 
                        placeholder="Masukkan nama lengkap" 
                        value={formData.nama}
                        onChange={(e) => setFormData({...formData, nama: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Kelas & Jurusan */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kelas">Kelas</Label>
                      <Select value={formData.kelas} onValueChange={(value) => setFormData({...formData, kelas: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kelas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="X">X</SelectItem>
                          <SelectItem value="XI">XI</SelectItem>
                          <SelectItem value="XII">XII</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jurusan">Jurusan</Label>
                      <Select value={formData.jurusan} onValueChange={(value) => setFormData({...formData, jurusan: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jurusan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RPL">RPL</SelectItem>
                          <SelectItem value="TKJ">TKJ</SelectItem>
                          <SelectItem value="MM">Multimedia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Email & Telepon */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="email@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telepon">Telepon</Label>
                      <Input 
                        id="telepon" 
                        placeholder="08xxxxxxxxxx" 
                        value={formData.telepon}
                        onChange={(e) => setFormData({...formData, telepon: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Status & Guru Pembimbing */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aktif">Aktif</SelectItem>
                          <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guru">Guru Pembimbing (opsional)</Label>
                      <Select 
                        value={formData.guru_id?.toString() || 'none'} 
                        onValueChange={(value) => setFormData({...formData, guru_id: value === 'none' ? null : parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Guru" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Tidak ada</SelectItem>
                          {guruList.map((guru) => (
                            <SelectItem key={guru.id} value={guru.id.toString()}>
                              {guru.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* DUDI */}
                  <div className="space-y-2">
                    <Label htmlFor="dudi">DUDI (opsional)</Label>
                    <Select 
                      value={formData.dudi_id?.toString() || 'none'} 
                      onValueChange={(value) => setFormData({...formData, dudi_id: value === 'none' ? null : parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Belum ada" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tidak ada</SelectItem>
                        {dudiList.map((dudi) => (
                          <SelectItem key={dudi.id} value={dudi.id.toString()}>
                            {dudi.nama_perusahaan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Alamat */}
                  <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat</Label>
                    <Textarea 
                      id="alamat" 
                      placeholder="Masukkan alamat lengkap" 
                      rows={3} 
                      value={formData.alamat}
                      onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" className="bg-[#ad46ff] hover:bg-[#9b36f0] text-white">
                      {isEditMode ? 'Update Siswa' : 'Tambah Siswa'}
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
                placeholder="Cari siswa..."
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
                <SelectItem value="Magang">Magang</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterKelas} onValueChange={setFilterKelas}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Semua Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Kelas">Semua Kelas</SelectItem>
                <SelectItem value="XII">XII</SelectItem>
                <SelectItem value="XI">XI</SelectItem>
                <SelectItem value="X">X</SelectItem>
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
        </CardHeader>

        <CardContent>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">NIS</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Nama</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Kelas/Jurusan</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Kontak</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Pembimbing</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSiswa.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Tidak ada data siswa
                    </td>
                  </tr>
                ) : (
                  filteredSiswa.map((siswa) => {
                    const statusInfo = getStatusInfo(siswa);
                    return (
                      <tr key={siswa.id} className="hover:bg-purple-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-600">{siswa.nis}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 bg-[#ad46ff]">
                              <AvatarFallback className="bg-[#ad46ff] text-white text-xs">
                                {siswa.nama.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-800">{siswa.nama}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {siswa.kelas && siswa.jurusan ? `${siswa.kelas} - ${siswa.jurusan}` : siswa.kelas || '-'}
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Mail className="w-3 h-3 text-[#ad46ff]" />
                              {siswa.email}
                            </div>
                            {siswa.telepon && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Phone className="w-3 h-3 text-[#ad46ff]" />
                                {siswa.telepon}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={`${statusInfo.color} border-0`}>
                            {statusInfo.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <p className="text-gray-800">
                              {siswa.guru?.nama || 'Belum ada'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {siswa.dudi?.nama_perusahaan || '-'}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="hover:bg-purple-50"
                              onClick={() => handleEdit(siswa)}
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="hover:bg-red-50"
                              onClick={() => handleDelete(siswa.id, siswa.nama)}
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
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredSiswa.length} dari {siswaData.length} siswa
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