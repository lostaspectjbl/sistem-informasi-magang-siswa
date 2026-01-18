// File: src/app/admin/users/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, CheckCircle, Mail, Search, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  SelectValue
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nama: '', email: '', role: 'siswa', password: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Semua Role');
  const [error, setError] = useState<string | null>(null);

  // Fetch users dari Supabase
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await (supabase as any)
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUserList(data || []);
    } catch (error: any) {
      setError(error.message || 'Gagal memuat data user');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.nama || !form.email) {
      alert('Nama dan email harus diisi');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (editingId) {
        // Update user
        const updateData: any = {
          nama: form.nama,
          email: form.email,
          role: form.role,
          updated_at: new Date().toISOString(),
        };

        // Hanya update password jika diisi
        if (form.password) {
          updateData.password = form.password;
        }

        const { error } = await (supabase as any)
          .from('users')
          .update(updateData)
          .eq('id', editingId);

        if (error) throw error;

        alert('Data user berhasil diperbarui!');
      } else {
        // Insert user baru
        if (!form.password) {
          alert('Password harus diisi untuk user baru');
          return;
        }

        const { error } = await (supabase as any)
          .from('users')
          .insert([{
            nama: form.nama,
            email: form.email,
            role: form.role,
            password: form.password,
          }]);

        if (error) throw error;

        alert('User baru berhasil ditambahkan!');
      }

      // Reset form dan refresh data
      setForm({ nama: '', email: '', role: 'siswa', password: '' });
      setShowDialog(false);
      setEditingId(null);
      fetchUsers();
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Gagal menyimpan data'));
      console.error('Error saving user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setForm({ 
      nama: user.nama, 
      email: user.email, 
      role: user.role, 
      password: '' 
    });
    setEditingId(user.id);
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

    try {
      const { error } = await (supabase as any)
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('User berhasil dihapus!');
      fetchUsers();
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Gagal menghapus user'));
      console.error('Error deleting user:', error);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setEditingId(null);
    setForm({ nama: '', email: '', role: 'siswa', password: '' });
  };

  const filteredUsers = userList.filter(user => {
    const matchSearch =
      user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'Semua Role' || user.role.toLowerCase() === filterRole.toLowerCase();
    return matchSearch && matchRole;
  });

  const roleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-purple-200 text-purple-800';
      case 'guru': return 'bg-blue-200 text-blue-800';
      case 'siswa': return 'bg-[#f3e3ff] text-[#ad46ff]';
      case 'dudi': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#ad46ff]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen User</h1>
        <p className="text-gray-600">Kelola akun pengguna sistem</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#ad46ff]" />
              Daftar User
            </CardTitle>

            <Button 
              className="bg-[#ad46ff] hover:bg-[#933bdc]" 
              onClick={() => setShowDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah User
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Role">Semua Role</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="guru">Guru</SelectItem>
                <SelectItem value="siswa">Siswa</SelectItem>
                <SelectItem value="dudi">DUDI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Terdaftar</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-[#f7efff]">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Avatar className="mr-3">
                          <AvatarFallback className="bg-[#ad46ff] text-white">
                            {user.nama[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800">{user.nama}</p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-[#ad46ff]" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <Badge className={roleColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(user.created_at)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-[#ad46ff] hover:bg-[#f3e3ff]"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Tidak ada user ditemukan</p>
              <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          )}

          {filteredUsers.length > 0 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Menampilkan {filteredUsers.length} dari {userList.length} user
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingId ? 'Edit User' : 'Tambah User Baru'}
            </DialogTitle>
            <DialogDescription>
              Lengkapi semua informasi yang diperlukan
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nama">
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                value={form.nama}
                onChange={(e) => setForm({...form, nama: e.target.value})}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="Contoh: user@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password {!editingId && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                placeholder={editingId ? "Kosongkan jika tidak ingin mengubah" : "Masukkan password"}
                required={!editingId}
              />
              {editingId && (
                <p className="text-xs text-gray-500">
                  Kosongkan jika tidak ingin mengubah password
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select value={form.role} onValueChange={(value) => setForm({...form, role: value})}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="siswa">Siswa</SelectItem>
                  <SelectItem value="guru">Guru</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="dudi">DUDI</SelectItem>
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
                className="bg-[#ad46ff] hover:bg-[#933bdc]"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  editingId ? 'Update' : 'Simpan'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}