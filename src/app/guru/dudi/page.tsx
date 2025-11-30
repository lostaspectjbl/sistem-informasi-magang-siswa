// File: src/app/guru/dudi/page.tsx
'use client';

import { useState } from 'react';
import { Building2, Users, MapPin, Phone, Mail, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select';

export default function GuruDUDIPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');

  const [dudiList] = useState([
    { id: 1, name: 'PT Kreatif Teknologi', address: 'Jl. Merdeka No. 123, Jakarta', contact: 'info@kreatiftek.com', phone: '021-12345678', pic: 'Andi Wijaya', students: 8 },
    { id: 2, name: 'CV Digital Solusi', address: 'Jl. Sudirman No. 45, Surabaya', contact: 'contact@digitalsolusi.com', phone: '031-87654321', pic: 'Sari Dewi', students: 5 },
    { id: 3, name: 'PT Inovasi Mandiri', address: 'Jl. Diponegoro No. 78, Surabaya', contact: 'hr@inovasimandiri.co.id', phone: '031-5553458', pic: 'Budi Santoso', students: 12 },
    { id: 4, name: 'PT Teknologi Maju', address: 'Jl. HR Rasuna Said No. 12, Jakarta', contact: 'info@tekmaju.com', phone: '021-33445566', pic: 'Lisa Permata', students: 6 },
    { id: 5, name: 'CV Solusi Digital Prima', address: 'Jl. Gatot Subroto No. 88, Bandung', contact: 'contact@sdprima.com', phone: '022-7788990', pic: 'Rahmat Hidayat', students: 9 }
  ]);

  const filteredDUDI = dudiList.filter(dudi =>
    dudi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dudi.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dudi.pic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDUDI = dudiList.length;
  const totalStudents = dudiList.reduce((sum, dudi) => sum + dudi.students, 0);
  const avgStudents = Math.round(totalStudents / totalDUDI);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen DUDI</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total DUDI</CardTitle>
            <Building2 className="h-4 w-4 text-[#ad46ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDUDI}</div>
            <p className="text-xs text-muted-foreground">Perusahaan mitra aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa Magang</CardTitle>
            <Users className="h-4 w-4 text-[#ad46ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Siswa magang aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Siswa</CardTitle>
            <Users className="h-4 w-4 text-[#ad46ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgStudents}</div>
            <p className="text-xs text-muted-foreground">Per perusahaan</p>
          </CardContent>
        </Card>
      </div>

      {/* DUDI List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-[#ad46ff]" />
              Daftar DUDI
            </CardTitle>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari perusahaan, alamat, penanggung jawab..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tampilkan:</span>
              <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                <SelectTrigger className="w-20"></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">per halaman</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-4 py-3 font-medium text-gray-700">Perusahaan</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Kontak</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Penanggung Jawab</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Siswa Magang</th>
                </tr>
              </thead>

              <tbody>
                {filteredDUDI.map(dudi => (
                  <tr key={dudi.id} className="border-b hover:bg-[#f7e9ff] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="bg-[#ad46ff]">
                          <AvatarFallback className="bg-[#ad46ff] text-white">
                            <Building2 className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-medium text-gray-800">{dudi.name}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin className="w-3 h-3 mr-1 text-[#ad46ff]" />
                            {dudi.address}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-2 text-[#ad46ff]" />
                          {dudi.contact}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-2 text-[#ad46ff]" />
                          {dudi.phone}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <Users className="w-4 h-4 mr-2 text-[#ad46ff]" />
                        {dudi.pic}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <Badge className="bg-[#f7e9ff] text-[#7a2ac7] hover:bg-[#f1d9ff]">
                        {dudi.students}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Menampilkan 1 sampai 5 dari {filteredDUDI.length} entri
            </div>

            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" disabled>
                «
              </Button>

              <Button
                size="sm"
                className="bg-[#ad46ff] hover:bg-[#9b36f0] text-white"
              >
                1
              </Button>

              <Button size="sm" variant="outline">2</Button>
              <Button size="sm" variant="outline">3</Button>
              <Button size="sm" variant="outline">»</Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
