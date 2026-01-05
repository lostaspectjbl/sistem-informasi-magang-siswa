'use client';

import { useState } from 'react';
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

export default function ManajemenSiswaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [filterKelas, setFilterKelas] = useState('Semua Kelas');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Stats data
  const stats = [
    { title: 'Total Siswa', value: '6', subtitle: 'Siswa terdaftar', icon: Users, color: 'text-gray-800' },
    { title: 'Sedang Magang', value: '3', subtitle: 'Aktif magang', icon: GraduationCap, color: 'text-blue-600' },
    { title: 'Selesai Magang', value: '1', subtitle: 'Telah selesai', icon: CheckCircle, color: 'text-green-600' },
    { title: 'Belum Ada Pembimbing', value: '0', subtitle: 'Perlu penugasan', icon: UserX, color: 'text-red-600' },
  ];

  // Siswa data
  const siswaData = [
    {
      nis: '2021001',
      nama: 'Ahmad Rizki Ramadhan',
      kelas: 'XII - RPL',
      email: 'ahmad@student.sch.id',
      telepon: '081234567890',
      status: 'magang',
      statusLabel: 'Magang',
      statusColor: 'bg-blue-100 text-blue-700',
      guruPembimbing: 'Guru #2',
      dudi: 'DUDI #1',
    },
    {
      nis: '2021002',
      nama: 'Siti Nurhaliza',
      kelas: 'XII - RPL',
      email: 'siti@student.sch.id',
      telepon: '081234567891',
      status: 'magang',
      statusLabel: 'Magang',
      statusColor: 'bg-blue-100 text-blue-700',
      guruPembimbing: 'Guru #2',
      dudi: 'DUDI #2',
    },
    {
      nis: '2021003',
      nama: 'Budi Santoso',
      kelas: 'XII - TKJ',
      email: 'budi@student.sch.id',
      telepon: '081234567892',
      status: 'magang',
      statusLabel: 'Magang',
      statusColor: 'bg-blue-100 text-blue-700',
      guruPembimbing: 'Guru #3',
      dudi: 'DUDI #3',
    },
    {
      nis: '2021004',
      nama: 'Dewi Lestari',
      kelas: 'XI - RPL',
      email: 'dewi@student.sch.id',
      telepon: '081234567893',
      status: 'selesai',
      statusLabel: 'Selesai',
      statusColor: 'bg-green-100 text-green-700',
      guruPembimbing: 'Guru #2',
      dudi: 'DUDI #4',
    },
    {
      nis: '2021005',
      nama: 'Eko Prasetyo',
      kelas: 'XI - TKJ',
      email: 'eko@student.sch.id',
      telepon: '081234567894',
      status: 'aktif',
      statusLabel: 'Aktif',
      statusColor: 'bg-green-100 text-green-700',
      guruPembimbing: 'Guru #3',
      dudi: 'DUDI #5',
    },
    {
      nis: '2021006',
      nama: 'Fajar Pratama',
      kelas: 'XI - RPL',
      email: 'fajar@student.sch.id',
      telepon: '081234567895',
      status: 'aktif',
      statusLabel: 'Aktif',
      statusColor: 'bg-green-100 text-green-700',
      guruPembimbing: 'Guru #2',
      dudi: '-',
    },
  ];

  // Filter data
  const filteredSiswa = siswaData.filter((siswa) => {
    const matchSearch = 
      siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      siswa.nis.includes(searchTerm) ||
      siswa.kelas.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'Semua Status' || siswa.statusLabel === filterStatus;
    const matchKelas = filterKelas === 'Semua Kelas' || siswa.kelas.includes(filterKelas);

    return matchSearch && matchStatus && matchKelas;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Siswa</h1>
        <p className="text-gray-600">Kelola data siswa dan penugasan magang</p>
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
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#ad46ff]" />
              Data Siswa
            </CardTitle>

            {/* Tambah Siswa Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    Tambah Siswa
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* NIS & Nama */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nis">NIS</Label>
                      <Input id="nis" placeholder="Masukkan NIS" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Lengkap</Label>
                      <Input id="nama" placeholder="Masukkan nama lengkap" />
                    </div>
                  </div>

                  {/* Kelas & Jurusan */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kelas">Kelas</Label>
                      <Select>
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
                      <Select>
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
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telepon">Telepon</Label>
                      <Input id="telepon" placeholder="08xxxxxxxxxx" />
                    </div>
                  </div>

                  {/* Status & Guru Pembimbing */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aktif">Aktif</SelectItem>
                          <SelectItem value="magang">Magang</SelectItem>
                          <SelectItem value="selesai">Selesai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guru">Guru Pembimbing (opsional)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Guru" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="guru1">Pak Suryanto</SelectItem>
                          <SelectItem value="guru2">Ibu Kartika</SelectItem>
                          <SelectItem value="guru3">Pak Hendro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* DUDI (opsional) */}
                  <div className="space-y-2">
                    <Label htmlFor="dudi">DUDI (opsional)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Belum ada" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dudi1">PT Kreatif Teknologi</SelectItem>
                        <SelectItem value="dudi2">CV Digital Solusi</SelectItem>
                        <SelectItem value="dudi3">PT Inovasi Mandiri</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Alamat */}
                  <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat</Label>
                    <Textarea id="alamat" placeholder="Masukkan alamat lengkap" rows={3} />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button className="bg-[#ad46ff] hover:bg-[#9b36f0] text-white">
                    Tambah Siswa
                  </Button>
                </DialogFooter>
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
                {filteredSiswa.map((siswa) => (
                  <tr key={siswa.nis} className="hover:bg-purple-50 transition-colors">
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
                    <td className="px-4 py-4 text-sm text-gray-600">{siswa.kelas}</td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail className="w-3 h-3 text-[#ad46ff]" />
                          {siswa.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone className="w-3 h-3 text-[#ad46ff]" />
                          {siswa.telepon}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={`${siswa.statusColor} border-0`}>
                        {siswa.statusLabel}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p className="text-gray-800">{siswa.guruPembimbing}</p>
                        <p className="text-xs text-gray-500">{siswa.dudi}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="hover:bg-purple-50">
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button size="icon" variant="ghost" className="hover:bg-red-50">
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
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
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