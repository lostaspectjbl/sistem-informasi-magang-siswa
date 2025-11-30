'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

import { useState } from 'react';
import {
  Users, GraduationCap, CheckCircle2, Clock,
  Search, Plus, Edit2, Trash2, Building2
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectValue, SelectContent, SelectItem, SelectTrigger
} from "@/components/ui/select";

export default function GuruMagangPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState('10');

  const students = [
    { id: 1, name: "Ahmad Rizki", nis: "2024001", class: "XII RPL 1", status: "RPL", supervisor: "Pak Suryanto", supervisorNip: "198502012010011001", company: "PT Kreatif Teknologi", location: "Jakarta", companyContact: "Andi Wijaya", period: "1 Feb 2024", startDate: "s.d 1 Mei 2024", duration: "90 hari", statusBadge: "Aktif", score: "-" },
    { id: 2, name: "Siti Nurhaliza", nis: "2024002", class: "XII RPL 1", status: "RPL", supervisor: "Ibu Kartika", supervisorNip: "198501022010012002", company: "CV Digital Solusi", location: "Surabaya", companyContact: "Sari Dewi", period: "15 Jan 2024", startDate: "s.d 15 Apr 2024", duration: "91 hari", statusBadge: "Selesai", score: "87" },
    { id: 3, name: "Budi Santoso", nis: "2024003", class: "XII RPL 2", status: "RPL", supervisor: "Pak Hendro", supervisorNip: "198503022010013003", company: "PT Inovasi Mandiri", location: "Surabaya", companyContact: "Budi Santoso", period: "1 Mar 2024", startDate: "s.d 1 Jun 2024", duration: "92 hari", statusBadge: "Pending", score: "-" },
    { id: 4, name: "Dewi Lestari", nis: "2024004", class: "XII RPL 2", status: "RPL", supervisor: "Ibu Ratna", supervisorNip: "198504042010014004", company: "PT Kreatif Teknologi", location: "Jakarta", companyContact: "Andi Wijaya", period: "15 Feb 2024", startDate: "s.d 15 Mei 2024", duration: "90 hari", statusBadge: "Aktif", score: "-" },
    { id: 5, name: "Randi Pratama", nis: "2024005", class: "XII TKJ 1", status: "TKJ", supervisor: "Pak Agus", supervisorNip: "198505052010015005", company: "PT Teknologi Maju", location: "Jakarta", companyContact: "Randi Pratama", period: "1 Jan 2024", startDate: "s.d 1 Apr 2024", duration: "91 hari", statusBadge: "Selesai", score: "92" },
  ];

  const stats = [
    { label: "Total Siswa", value: "6", sublabel: "Siswa terdaftar", icon: Users },
    { label: "Aktif", value: "3", sublabel: "Sedang magang", icon: GraduationCap },
    { label: "Selesai", value: "2", sublabel: "Magang selesai", icon: CheckCircle2 },
    { label: "Pending", value: "1", sublabel: "Menunggu penempatan", icon: Clock }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Manajemen Siswa Magang</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((s, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row justify-between pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-[#ad46ff]" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.sublabel}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="flex gap-2 items-center">
              <Users className="w-5 h-5 text-[#ad46ff]" />
              Daftar Siswa Magang
            </CardTitle>

            {/* ✅ DIALOG TERPASANG DI TOMBOL TAMBAH */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#ad46ff] hover:bg-[#9024f8] text-white">
                  <Plus className="w-4 h-4 mr-1" /> Tambah
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Tambah Data Siswa Magang
                  </DialogTitle>
                  <p className="text-sm text-gray-500">
                    Masukkan informasi data magang siswa baru
                  </p>
                </DialogHeader>

                <div className="grid gap-6 mt-4">

                  {/* Siswa & Pembimbing */}
                  <div>
                    <h3 className="text-md font-semibold mb-2">Siswa & Pembimbing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* PILIH SISWA */}
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Siswa" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((s) => (
                            <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* PILIH GURU PEMBIMBING */}
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Guru Pembimbing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="suryanto">Pak Suryanto</SelectItem>
                          <SelectItem value="kartika">Ibu Kartika</SelectItem>
                          <SelectItem value="hendro">Pak Hendro</SelectItem>
                          <SelectItem value="ratna">Ibu Ratna</SelectItem>
                          <SelectItem value="agus">Pak Agus</SelectItem>
                        </SelectContent>
                      </Select>

                    </div>
                  </div>

                  {/* DUDI */}
                  <div>
                    <h3 className="text-md font-semibold mb-2">Tempat Magang</h3>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih DUDI" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ptkt">PT Kreatif Teknologi</SelectItem>
                        <SelectItem value="cvds">CV Digital Solusi</SelectItem>
                        <SelectItem value="ptim">PT Inovasi Mandiri</SelectItem>
                        <SelectItem value="pttm">PT Teknologi Maju</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Periode & Status */}
                  <div>
                    <h3 className="text-md font-semibold mb-2">Periode & Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      <Input type="date" />

                      <Input type="date" />

                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="aktif">Aktif</SelectItem>
                          <SelectItem value="selesai">Selesai</SelectItem>
                        </SelectContent>
                      </Select>

                    </div>
                  </div>

                </div>

                <DialogFooter className="mt-6">
                  <Button variant="outline">Batal</Button>
                  <Button className="bg-[#ad46ff] hover:bg-[#9024f8] text-white">
                    Simpan
                  </Button>
                </DialogFooter>

              </DialogContent>
            </Dialog>
          </div>

          {/* SEARCH + FILTER */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari siswa, guru, atau DUDI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {/* TABLE */}
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-gray-700 Dtext-xs font-bold">Siswa</th>
                  <th className="px-4 py-3 text-gray-700 text-xs font-bold">Guru</th>
                  <th className="px-4 py-3 text-gray-700 text-xs font-bold">DUDI</th>
                  <th className="px-4 py-3 text-gray-700 text-xs font-bold">Periode</th>
                  <th className="px-4 py-3 text-gray-700 text-xs font-bold">Status</th>
                  <th className="px-4 py-3 text-gray-700 text-xs font-bold">Nilai</th>
                  <th className="px-4 py-3 text-gray-700 text-xs font-bold">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-[#f7ecff]">

                    <td className="px-4 py-4">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-gray-500">NIS: {s.nis}</p>
                      <p className="text-xs text-gray-500">{s.class}</p>
                    </td>

                    <td className="px-4 py-4">
                      <p>{s.supervisor}</p>
                      <p className="text-xs text-gray-500">NIP: {s.supervisorNip}</p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <div className="bg-[#f3e3ff] p-2 rounded-md">
                          <Building2 className="w-4 h-4 text-[#ad46ff]" />
                        </div>
                        <div>
                          <p className="font-medium">{s.company}</p>
                          <p className="text-xs text-gray-500">{s.location}</p>
                          <p className="text-xs text-gray-500">{s.companyContact}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p>{s.period}</p>
                      <p className="text-xs text-gray-500">{s.startDate}</p>
                    </td>

                    <td className="px-4 py-4">
                      <Badge
                        className={
                          s.statusBadge === 'Aktif'
                            ? "bg-green-100 text-green-700"
                            : s.statusBadge === 'Selesai'
                            ? "bg-[#f3e3ff] text-[#ad46ff]"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {s.statusBadge}
                      </Badge>
                    </td>

                    <td className="px-4 py-4">
                      {s.score === "-" ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className="bg-[#f3e3ff] text-[#ad46ff] px-3 py-1 rounded-full font-bold">
                          {s.score}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost">
                          <Edit2 className="w-4 h-4 text-[#ad46ff]" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="w-4 h-4 text-[#ad46ff]" />
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
    </div>
  );
}
