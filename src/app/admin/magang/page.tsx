'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { GraduationCap, Search, Plus, Edit, Trash2, Calendar, Loader2 } from 'lucide-react';
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

// Tipe data untuk tampilan frontend
interface MagangDisplay {
  id: number;
  siswa_id: number;
  dudi_id: number;
  guru_id: number;
  siswa_nama: string;
  dudi_nama: string;
  guru_nama: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'aktif' | 'selesai' | 'dibatalkan' | 'pending';
}

// Tipe data untuk opsi dropdown
interface OptionItem {
  id: number;
  nama: string;
}

export default function ManajemenMagangPage() {
  const [magangList, setMagangList] = useState<MagangDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk opsi dropdown
  const [siswaOptions, setSiswaOptions] = useState<OptionItem[]>([]);
  const [dudiOptions, setDudiOptions] = useState<OptionItem[]>([]);
  const [guruOptions, setGuruOptions] = useState<OptionItem[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [form, setForm] = useState({
    siswa_id: '',
    dudi_id: '',
    guru_id: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    status: 'aktif' as string,
  });

  // 1. Fetch Data Utama & Opsi Dropdown saat load
  useEffect(() => {
    fetchRefData();
    fetchMagangData();
  }, []);

  // --- PERBAIKAN 1: Menambahkan 'as any' pada pemetaan data DUDI ---
  const fetchRefData = async () => {
    const { data: siswa } = await supabase.from('siswa').select('id, nama').eq('status', 'aktif');
    const { data: dudi } = await supabase.from('dudi').select('id, nama_perusahaan'); 
    const { data: guru } = await supabase.from('guru').select('id, nama').eq('status', 'aktif');

    if (siswa) setSiswaOptions(siswa as any[]); // Opsional: cast ke any[] agar aman
    
    // Di sini error pertama & kedua terjadi sebelumnya. Kita paksa tipe dudi menjadi any[]
    if (dudi) {
      setDudiOptions((dudi as any[]).map(d => ({ 
        id: d.id, 
        nama: d.nama_perusahaan 
      })));
    }
    
    if (guru) setGuruOptions(guru as any[]);
  };

  const fetchMagangData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('magang')
        .select(`
          id,
          status,
          tanggal_mulai,
          tanggal_selesai,
          siswa_id, dudi_id, guru_id,
          siswa (nama),
          dudi (nama_perusahaan),
          guru (nama)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: MagangDisplay[] = (data || []).map((item: any) => ({
        id: item.id,
        siswa_id: item.siswa_id,
        dudi_id: item.dudi_id,
        guru_id: item.guru_id,
        siswa_nama: item.siswa?.nama || 'Siswa Dihapus',
        dudi_nama: item.dudi?.nama_perusahaan || 'DUDI Dihapus',
        guru_nama: item.guru?.nama || 'Guru Dihapus',
        tanggalMulai: item.tanggal_mulai,
        tanggalSelesai: item.tanggal_selesai,
        status: item.status,
      }));

      setMagangList(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert('Gagal mengambil data magang');
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
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

  // Client-side filtering
  const filteredMagang = magangList.filter((magang) => {
    const matchSearch =
      magang.siswa_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      magang.dudi_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      magang.guru_nama.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'Semua Status' ||
      (filterStatus === 'Aktif' && magang.status === 'aktif') ||
      (filterStatus === 'Selesai' && magang.status === 'selesai') ||
      (filterStatus === 'Dibatalkan' && magang.status === 'dibatalkan');

    return matchSearch && matchStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      siswa_id: parseInt(form.siswa_id),
      dudi_id: parseInt(form.dudi_id),
      guru_id: parseInt(form.guru_id),
      tanggal_mulai: form.tanggalMulai,
      tanggal_selesai: form.tanggalSelesai,
      status: form.status
    };

    try {
      if (editingId) {
        // --- PERBAIKAN 2: Menambahkan 'as any' pada payload update ---
        const { error } = await supabase
          .from('magang')
          .update(payload as never) // <-- Error "not assignable to never" diperbaiki di sini
          .eq('id', editingId);
        
        if (error) throw error;
      } else {
        // --- PERBAIKAN 3: Menambahkan 'as any' pada payload insert ---
        const { error } = await supabase
          .from('magang')
          .insert([payload] as any); // <-- Error "not assignable to never" diperbaiki di sini

        if (error) throw error;
      }

      await fetchMagangData(); // Refresh table
      handleCancel();
    } catch (error) {
      console.error("Error saving:", error);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (magang: MagangDisplay) => {
    setForm({
      siswa_id: magang.siswa_id?.toString() || '',
      dudi_id: magang.dudi_id?.toString() || '',
      guru_id: magang.guru_id?.toString() || '',
      tanggalMulai: magang.tanggalMulai,
      tanggalSelesai: magang.tanggalSelesai,
      status: magang.status,
    });
    setEditingId(magang.id);
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data magang ini?')) {
      try {
        const { error } = await supabase.from('magang').delete().eq('id', id);
        if (error) throw error;
        setMagangList(magangList.filter(m => m.id !== id));
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Gagal menghapus data");
      }
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setEditingId(null);
    setForm({ siswa_id: '', dudi_id: '', guru_id: '', tanggalMulai: '', tanggalSelesai: '', status: 'aktif' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktif': return 'bg-blue-100 text-blue-700';
      case 'selesai': return 'bg-green-100 text-green-700';
      case 'dibatalkan': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
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
                  {/* Siswa Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="siswa">Nama Siswa <span className="text-red-500">*</span></Label>
                    <Select 
                      value={form.siswa_id} 
                      onValueChange={(value) => setForm({ ...form, siswa_id: value })}
                    >
                      <SelectTrigger id="siswa">
                        <SelectValue placeholder="Pilih Siswa" />
                      </SelectTrigger>
                      <SelectContent>
                        {siswaOptions.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>{s.nama}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* DUDI Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="dudi">DUDI (Tempat Magang) <span className="text-red-500">*</span></Label>
                    <Select 
                      value={form.dudi_id} 
                      onValueChange={(value) => setForm({ ...form, dudi_id: value })}
                    >
                      <SelectTrigger id="dudi">
                        <SelectValue placeholder="Pilih DUDI" />
                      </SelectTrigger>
                      <SelectContent>
                        {dudiOptions.map((d) => (
                          <SelectItem key={d.id} value={d.id.toString()}>{d.nama}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pembimbing Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="pembimbing">Guru Pembimbing <span className="text-red-500">*</span></Label>
                    <Select 
                      value={form.guru_id} 
                      onValueChange={(value) => setForm({ ...form, guru_id: value })}
                    >
                      <SelectTrigger id="pembimbing">
                        <SelectValue placeholder="Pilih Guru Pembimbing" />
                      </SelectTrigger>
                      <SelectContent>
                        {guruOptions.map((g) => (
                          <SelectItem key={g.id} value={g.id.toString()}>{g.nama}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Periode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tanggalMulai">Tanggal Mulai <span className="text-red-500">*</span></Label>
                      <Input
                        id="tanggalMulai"
                        type="date"
                        value={form.tanggalMulai}
                        onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tanggalSelesai">Tanggal Selesai <span className="text-red-500">*</span></Label>
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
                    <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                    <Select 
                      value={form.status} 
                      onValueChange={(value) => setForm({ ...form, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="selesai">Selesai</SelectItem>
                        <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={handleCancel}>Batal</Button>
                    <Button type="submit" disabled={loading} className="bg-[#0891b2] hover:bg-[#0e7490] text-white">
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
          </div>
        </div>

        <CardContent className="p-0">
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredMagang.length === 0 ? (
                   <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">Tidak ada data ditemukan.</td>
                   </tr>
                ) : (
                  filteredMagang.map((magang) => (
                    <tr key={magang.id} className="hover:bg-purple-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-gray-800">{magang.siswa_nama}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{magang.dudi_nama}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{magang.guru_nama}</td>
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
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(magang)} className="hover:bg-blue-50">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(magang.id)} className="hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}