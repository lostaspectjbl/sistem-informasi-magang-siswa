// File: src/app/admin/users/page.tsx
'use client';

import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, CheckCircle, Mail, Search } from 'lucide-react';
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
  SelectValue
} from '@/components/ui/select';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  date: string;
}

export default function UsersPage() {
  const [userList, setUserList] = useState<User[]>([
    { id: 1, name: 'Admin Sistem', email: 'admin@email.com', role: 'Admin', verified: true, date: '1 Jan 2024' },
    { id: 2, name: 'Pak Suryanto', email: 'suryanto@teacher.com', role: 'Guru', verified: true, date: '2 Jan 2024' },
    { id: 3, name: 'Bu Kartika', email: 'kartika@teacher.com', role: 'Guru', verified: true, date: '3 Jan 2024' },
    { id: 4, name: 'Ahmad Rizki', email: 'ahmad.rizki@gmail.com', role: 'Siswa', verified: true, date: '4 Jan 2024' },
    { id: 5, name: 'Siti Nurhaliza', email: 'siti.nur@gmail.com', role: 'Siswa', verified: true, date: '5 Jan 2024' }
  ]);
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'Siswa', password: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Semua Role');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.name && form.email) {
      if (editingId) {
        setUserList(userList.map(u => 
          u.id === editingId ? { ...u, name: form.name, email: form.email, role: form.role } : u
        ));
        setEditingId(null);
      } else {
        const newUser = {
          id: Math.max(...userList.map(u => u.id), 0) + 1,
          name: form.name,
          email: form.email,
          role: form.role,
          verified: true,
          date: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        };
        setUserList([...userList, newUser]);
      }
      
      // Reset form
      setForm({ name: '', email: '', role: 'Siswa', password: '' });
      setShowDialog(false);
    }
  };

  const handleEdit = (user: User) => {
    setForm({ name: user.name, email: user.email, role: user.role, password: '' });
    setEditingId(user.id);
    setShowDialog(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUserList(userList.filter(u => u.id !== id));
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setEditingId(null);
    setForm({ name: '', email: '', role: 'Siswa', password: '' });
  };

  const filteredUsers = userList.filter(user => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'Semua Role' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  // 🎨 WARNA BADGE ROLE
  const roleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-200 text-purple-800';
      case 'Guru': return 'bg-blue-200 text-blue-800';
      case 'Siswa': return 'bg-[#f3e3ff] text-[#ad46ff]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen User</h1>
        <p className="text-gray-600">Kelola akun pengguna sistem</p>
      </div>

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

          {/* Search & Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama, email, atau role..."
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
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Guru">Guru</SelectItem>
                <SelectItem value="Siswa">Siswa</SelectItem>
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
                            {user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-[#ad46ff]" />
                        {user.email}
                      </div>
                      {user.verified && (
                        <div className="flex items-center text-xs text-green-600 mt-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <Badge className={roleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {user.date}
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
                Menampilkan 1 sampai {Math.min(5, filteredUsers.length)} dari {filteredUsers.length} entri
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline">1</Button>
                <Button size="sm" variant="ghost">2</Button>
                <Button size="sm" variant="ghost">3</Button>
                <Button size="sm" variant="ghost">»</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Modal */}
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
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            {/* Email */}
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

            {/* Password */}
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

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select value={form.role} onValueChange={(value) => setForm({...form, role: value})}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Siswa">Siswa</SelectItem>
                  <SelectItem value="Guru">Guru</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-[#ad46ff] hover:bg-[#933bdc]"
              >
                {editingId ? 'Update' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 