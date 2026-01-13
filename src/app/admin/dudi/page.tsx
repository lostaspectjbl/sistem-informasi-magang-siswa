// File: src/app/admin/dudi/page.tsx
'use client';

import React, { useState } from 'react';
import { Building2, Users, Plus, Edit2, Trash2, Mail, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';
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

interface DUDI {
  id: number;
  name: string;
  address: string;
  contact: string;
  phone: string;
  pic: string;
  status: string;
  students: number;
}

export default function DUDIPage() {
  const [dudiList, setDudiList] = useState<DUDI[]>([
    { id: 1, name: 'PT Kreatif Teknologi', address: 'Jl. Merdeka No. 123, Jakarta', contact: 'info@kreatiftek.com', phone: '021-12345678', pic: 'Andi Wijaya', status: 'Aktif', students: 8 },
    { id: 2, name: 'CV Digital Solusi', address: 'Jl. Sudirman No. 45, Surabaya', contact: 'contact@digitalsolusi.c...', phone: '031-87654321', pic: 'Sari Dewi', status: 'Aktif', students: 5 },
    { id: 3, name: 'PT Inovasi Mandiri', address: 'Jl. Diponegoro No. 78, Surabaya', contact: 'hr@inovasimandiri.co.id', phone: '031-5553458', pic: 'Budi Santoso', status: 'Tidak Aktif', students: 12 },
    { id: 4, name: 'PT Teknologi Maju', address: 'Jl. HR Rasuna Said No. 12, Jakarta', contact: 'info@tekmaju.com', phone: '021-33445566', pic: 'Lisa Permata', status: 'Aktif', students: 6 },
    { id: 5, name: 'CV Solusi Digital Prima', address: 'Jl. Gatot Subroto No. 88, Bandung', contact: 'contact@sdprima.com', phone: '022-7788990', pic: 'Rahmat Hidayat', status: 'Aktif', students: 9 }
  ]);
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ 
    name: '', 
    address: '', 
    phone: '',
    email: '', 
    pic: '',
    status: 'Aktif'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.name && form.address) {
      if (editingId) {
        setDudiList(dudiList.map(d => 
          d.id === editingId 
            ? { ...d, name: form.name, address: form.address, contact: form.email, phone: form.phone, pic: form.pic, status: form.status } 
            : d
        ));
        setEditingId(null);
      } else {
        const newDUDI = {
          id: Math.max(...dudiList.map(d => d.id), 0) + 1,
          name: form.name,
          address: form.address,
          contact: form.email,
          phone: form.phone,
          pic: form.pic,
          status: form.status,
          students: 0
        };
        setDudiList([...dudiList, newDUDI]);
      }
      
      // Reset form
      setForm({ name: '', address: '', phone: '', email: '', pic: '', status: 'Aktif' });
      setShowDialog(false);
    }
  };

  const handleEdit = (dudi: DUDI) => {
    setForm({ 
      name: dudi.name, 
      address: dudi.address, 
      email: dudi.contact, 
      phone: dudi.phone, 
      pic: dudi.pic,
      status: dudi.status
    });
    setEditingId(dudi.id);
    setShowDialog(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus DUDI ini?')) {
      setDudiList(dudiList.filter(d => d.id !== id));
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setEditingId(null);
    setForm({ name: '', address: '', phone: '', email: '', pic: '', status: 'Aktif' });
  };

  const toggleStatus = (id: number) => {
    setDudiList(dudiList.map(d => 
      d.id === id ? { ...d, status: d.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif' } : d
    ));
  };

  const activeCount = dudiList.filter(d => d.status === 'Aktif').length;
  const inactiveCount = dudiList.filter(d => d.status === 'Tidak Aktif').length;
  const totalStudents = dudiList.reduce((sum, d) => sum + d.students, 0);

  const stats = [
    { title: "Total DUDI", value: dudiList.length.toString(), subtitle: "Perusahaan mitra", icon: Building2 },
    { title: "DUDI Aktif", value: activeCount.toString(), subtitle: "Perusahaan aktif", icon: CheckCircle },
    { title: "DUDI Tidak Aktif", value: inactiveCount.toString(), subtitle: "Perusahaan tidak aktif", icon: XCircle },
    { title: "Total Siswa Magang", value: totalStudents.toString(), subtitle: "Siswa magang aktif", icon: Users },
  ];

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
                {dudiList.map(dudi => (
                  <tr key={dudi.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Avatar className="mr-3">
                          <AvatarFallback className="bg-purple-500 text-white">
                            <Building2 className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800">{dudi.name}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {dudi.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600 flex items-center mb-1">
                        <Mail className="w-3 h-3 mr-2" />
                        {dudi.contact}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Phone className="w-3 h-3 mr-2" />
                        {dudi.phone}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {dudi.pic}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        onClick={() => toggleStatus(dudi.id)}
                        className={`cursor-pointer ${dudi.status === 'Aktif' 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                      >
                        {dudi.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {dudi.students}
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
                ))}
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
              <Label htmlFor="name">
                Nama Perusahaan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                placeholder="Masukkan nama perusahaan"
                required
              />
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Alamat <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm({...form, address: e.target.value})}
                placeholder="Masukkan alamat lengkap"
                required
              />
            </div>

            {/* Telepon */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Telepon <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                placeholder="Contoh: 021-12345678"
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
                placeholder="Contoh: info@perusahaan.com"
                required
              />
            </div>

            {/* Penanggung Jawab */}
            <div className="space-y-2">
              <Label htmlFor="pic">
                Penanggung Jawab <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pic"
                value={form.pic}
                onChange={(e) => setForm({...form, pic: e.target.value})}
                placeholder="Nama penanggung jawab"
                required
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
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
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
                className="bg-purple-500 hover:bg-purple-600"
              >
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}