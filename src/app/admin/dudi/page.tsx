// File: src/app/admin/dudi/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Users, Plus, Edit2, Trash2, Phone, MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

// Interface sesuai kolom database
interface DUDIRow {
  id: number;
  nama_perusahaan: string;
  alamat: string | null;
  telepon: string | null;
  penanggung_jawab: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// Interface untuk data siswa (hanya mengambil kolom yang dibutuhkan)
interface SiswaRow {
  dudi_id: number;
}

// Interface untuk State Aplikasi (DUDI + jumlah siswa)
interface DUDIWithCount extends DUDIRow {
  students: number;
}

export default function DUDIPage() {
  const [dudiList, setDudiList] = useState<DUDIWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ 
    nama_perusahaan: '', 
    alamat: '', 
    telepon: '',
    penanggung_jawab: '',
    status: 'aktif'
  });

  useEffect(() => {
    fetchDUDI();
  }, []);

  async function fetchDUDI() {
    try {
      setLoading(true);
      
      // Fetch DUDI data dengan explicit return type
      const { data: dudiData, error: dudiError } = await supabase
        .from('dudi')
        .select('id, nama_perusahaan, alamat, telepon, penanggung_jawab, status, created_at, updated_at')
        .order('created_at', { ascending: false })
        .returns<DUDIRow[]>(); // FIX: Memberi tahu TS bahwa ini mengembalikan array DUDIRow

      if (dudiError) throw dudiError;

      if (!dudiData || dudiData.length === 0) {
        setDudiList([]);
        setLoading(false);
        return;
      }

      // Fetch student counts
      const dudiIds = dudiData.map(d => d.id);
      
      const { data: siswaData } = await supabase
        .from('siswa')
        .select('dudi_id')
        .in('dudi_id', dudiIds)
        .returns<SiswaRow[]>(); // FIX: Memberi tahu TS bahwa ini mengembalikan array SiswaRow

      // Count students per DUDI
      const studentCounts: Record<number, number> = {};
      if (siswaData) {
        siswaData.forEach(siswa => {
          if (siswa.dudi_id) {
            studentCounts[siswa.dudi_id] = (studentCounts[siswa.dudi_id] || 0) + 1;
          }
        });
      }

      // Combine DUDI data with student counts
      const dudiWithStudents: DUDIWithCount[] = dudiData.map(dudi => ({
        ...dudi,
        students: studentCounts[dudi.id] || 0
      }));

      setDudiList(dudiWithStudents);
    } catch (error) {
      console.error('Error fetching DUDI:', error);
      alert('Gagal memuat data DUDI');
      setDudiList([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!form.nama_perusahaan || !form.alamat) {
      alert('Nama perusahaan dan alamat harus diisi');
      return;
    }

    setSubmitting(true);

    try {
      // Data payload object
      const payload = {
        nama_perusahaan: form.nama_perusahaan,
        alamat: form.alamat,
        telepon: form.telepon || null,
        penanggung_jawab: form.penanggung_jawab || null,
        status: form.status,
        ...(editingId ? { updated_at: new Date().toISOString() } : {})
      };

      if (editingId) {
        // Update existing DUDI
        // FIX: Menggunakan (supabase as any) untuk bypass pengecekan schema yang ketat
        const { error } = await (supabase as any)
          .from('dudi')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        alert('DUDI berhasil diupdate');
      } else {
        // Insert new DUDI
        // FIX: Menggunakan (supabase as any) untuk bypass pengecekan schema yang ketat
        const { error } = await (supabase as any)
          .from('dudi')
          .insert(payload);

        if (error) throw error;
        alert('DUDI berhasil ditambahkan');
      }

      // Refresh data
      await fetchDUDI();
      
      // Reset form
      handleCancel();
    } catch (error) {
      console.error('Error saving DUDI:', error);
      alert('Gagal menyimpan data DUDI');
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(dudi: DUDIRow) {
    setForm({ 
      nama_perusahaan: dudi.nama_perusahaan,
      alamat: dudi.alamat || '', 
      telepon: dudi.telepon || '', 
      penanggung_jawab: dudi.penanggung_jawab || '',
      status: dudi.status
    });
    setEditingId(dudi.id);
    setShowDialog(true);
  }

  async function handleDelete(id: number) {
    if (!confirm('Apakah Anda yakin ingin menghapus DUDI ini?')) {
      return;
    }

    try {
      // FIX: Menggunakan (supabase as any)
      const { error } = await (supabase as any)
        .from('dudi')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('DUDI berhasil dihapus');
      await fetchDUDI();
    } catch (error) {
      console.error('Error deleting DUDI:', error);
      alert('Gagal menghapus DUDI. Pastikan tidak ada siswa yang terkait dengan DUDI ini.');
    }
  }

  function handleCancel() {
    setShowDialog(false);
    setEditingId(null);
    setForm({ 
      nama_perusahaan: '', 
      alamat: '', 
      telepon: '', 
      penanggung_jawab: '', 
      status: 'aktif' 
    });
  }

  async function toggleStatus(id: number, currentStatus: string) {
    const newStatus = currentStatus === 'aktif' ? 'tidak aktif' : 'aktif';
    
    try {
      // FIX: Menggunakan (supabase as any)
      const { error } = await (supabase as any)
        .from('dudi')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setDudiList(dudiList.map(d => 
        d.id === id ? { ...d, status: newStatus } : d
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal mengubah status DUDI');
    }
  }

  const activeCount = dudiList.filter(d => d.status === 'aktif').length;
  const inactiveCount = dudiList.filter(d => d.status === 'tidak aktif').length;
  const totalStudents = dudiList.reduce((sum, d) => sum + (d.students || 0), 0);

  const stats = [
    { title: "Total DUDI", value: dudiList.length.toString(), subtitle: "Perusahaan mitra", icon: Building2 },
    { title: "DUDI Aktif", value: activeCount.toString(), subtitle: "Perusahaan aktif", icon: CheckCircle },
    { title: "DUDI Tidak Aktif", value: inactiveCount.toString(), subtitle: "Perusahaan tidak aktif", icon: XCircle },
    { title: "Total Siswa Magang", value: totalStudents.toString(), subtitle: "Siswa magang aktif", icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <span className="ml-2 text-gray-600">Memuat data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen DUDI</h1>
        <p className="text-gray-600">Kelola data Dunia Usaha dan Dunia Industri</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* DUDI Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-purple-500" />
            Daftar DUDI
          </CardTitle>
          <Button 
            onClick={() => setShowDialog(true)} 
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah DUDI
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Perusahaan</th>
                  <th className="text-left py-3 px-4 font-medium">Kontak</th>
                  <th className="text-left py-3 px-4 font-medium">Penanggung Jawab</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Siswa</th>
                  <th className="text-left py-3 px-4 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dudiList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      Belum ada data DUDI
                    </td>
                  </tr>
                ) : (
                  dudiList.map(dudi => (
                    <tr key={dudi.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Avatar className="mr-3">
                            <AvatarFallback className="bg-purple-500 text-white">
                              <Building2 className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800">{dudi.nama_perusahaan}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {dudi.alamat || '-'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600 flex items-center">
                          <Phone className="w-3 h-3 mr-2" />
                          {dudi.telepon || '-'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          {dudi.penanggung_jawab || '-'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          onClick={() => toggleStatus(dudi.id, dudi.status)}
                          className={`cursor-pointer ${dudi.status === 'aktif' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                        >
                          {dudi.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          {dudi.students || 0}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(dudi)} className="text-blue-600 hover:bg-blue-50">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(dudi.id)} className="text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
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

      {/* Dialog Modal */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingId ? 'Edit DUDI' : 'Tambah DUDI Baru'}
            </DialogTitle>
            <DialogDescription>
              Lengkapi semua informasi yang diperlukan
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Nama Perusahaan */}
            <div className="space-y-2">
              <Label htmlFor="nama_perusahaan">
                Nama Perusahaan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_perusahaan"
                value={form.nama_perusahaan}
                onChange={(e) => setForm({...form, nama_perusahaan: e.target.value})}
                placeholder="Masukkan nama perusahaan"
                required
              />
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <Label htmlFor="alamat">
                Alamat <span className="text-red-500">*</span>
              </Label>
              <Input
                id="alamat"
                value={form.alamat}
                onChange={(e) => setForm({...form, alamat: e.target.value})}
                placeholder="Masukkan alamat lengkap"
                required
              />
            </div>

            {/* Telepon */}
            <div className="space-y-2">
              <Label htmlFor="telepon">
                Telepon
              </Label>
              <Input
                id="telepon"
                value={form.telepon}
                onChange={(e) => setForm({...form, telepon: e.target.value})}
                placeholder="Contoh: 021-12345678"
              />
            </div>

            {/* Penanggung Jawab */}
            <div className="space-y-2">
              <Label htmlFor="penanggung_jawab">
                Penanggung Jawab
              </Label>
              <Input
                id="penanggung_jawab"
                value={form.penanggung_jawab}
                onChange={(e) => setForm({...form, penanggung_jawab: e.target.value})}
                placeholder="Nama penanggung jawab"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select value={form.status} onValueChange={(value) => setForm({...form, status: value})}>
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
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-purple-500 hover:bg-purple-600"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}