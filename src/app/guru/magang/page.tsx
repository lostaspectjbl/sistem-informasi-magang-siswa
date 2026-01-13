'use client';

import { useState } from 'react';
import {
  Users, GraduationCap, CheckCircle2, Clock,
  Search, Edit2, Building2, ChevronUp, X
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectValue, SelectContent, SelectItem, SelectTrigger
} from "@/components/ui/select";

// Interface untuk tipe data Student
interface Student {
  id: number;
  name: string;
  company: string;
  period: string;
  statusBadge: string;
  score: string;
  startDate: string;
  endDate: string;
}

export default function GuruMagangPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  
  // State untuk modal update status
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [updateStatus, setUpdateStatus] = useState('selesai');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  // State untuk modal input nilai
  const [showNilaiModal, setShowNilaiModal] = useState(false);
  const [nilaiAkhir, setNilaiAkhir] = useState('');

  const students: Student[] = [
    { id: 1, name: "Ahmad Rizki Ramadhan", company: "PT. Teknologi Nusantara", period: "1 Jul 2024 - 30 Sep 2024", statusBadge: "Aktif", score: "-", startDate: "01/07/2024", endDate: "30/09/2024" },
    { id: 2, name: "Siti Nurhaliza", company: "CV. Digital Kreativa", period: "1 Jul 2024 - 30 Sep 2024", statusBadge: "Aktif", score: "-", startDate: "01/07/2024", endDate: "30/09/2024" },
    { id: 3, name: "Dewi Lestari", company: "PT. Media Interaktif", period: "15 Jun 2024 - 15 Sep 2024", statusBadge: "Selesai", score: "0", startDate: "15/06/2024", endDate: "15/09/2024" },
  ];

  const stats = [
    { label: "Total Siswa", value: "3", sublabel: "Siswa bimbingan", icon: Users },
    { label: "Magang Aktif", value: "2", sublabel: "Sedang berlangsung", icon: GraduationCap },
    { label: "Pending", value: "0", sublabel: "Menunggu approval", icon: Clock },
    { label: "Rata-rata Nilai", value: "0", sublabel: "0 siswa selesai", icon: CheckCircle2 }
  ];

  const handleSelesaiClick = (student: Student) => {
    setSelectedStudent(student);
    setStartDate(student.startDate);
    setEndDate(student.endDate);
    setUpdateStatus('selesai');
    setNotes('');
    setShowUpdateModal(true);
  };

  const handleNilaiClick = (student: Student) => {
    setSelectedStudent(student);
    setNilaiAkhir(student.score !== '-' ? student.score : '');
    setShowNilaiModal(true);
  };

  const handleSaveUpdate = () => {
    // Logic untuk menyimpan perubahan status
    console.log('Simpan update:', {
      student: selectedStudent,
      status: updateStatus,
      startDate,
      endDate,
      notes
    });
    setShowUpdateModal(false);
  };

  const handleSaveNilai = () => {
    // Logic untuk menyimpan nilai
    console.log('Simpan nilai:', {
      student: selectedStudent,
      nilai: nilaiAkhir
    });
    setShowNilaiModal(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manajemen Siswa Magang
        </h1>
        <p className="text-gray-600">Kelola magang, tinjau pendaftaran, dan beri nilai siswa bimbingan</p>
      </div>
      
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
          <div className="mb-4">
            <CardTitle className="flex gap-2 items-center mb-4">
              Daftar Magang Siswa Bimbingan
            </CardTitle>

            {/* SEARCH + FILTER BUTTON */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari siswa atau DUDI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button 
                variant="outline" 
                className="border-[#00d9d9] text-[#00d9d9] hover:bg-[#00d9d9] hover:text-white"
                onClick={() => setShowFilter(!showFilter)}
              >
                Tampilkan Filter
                <ChevronUp className={`w-4 h-4 ml-2 transition-transform ${showFilter ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* FILTER SECTION */}
            {showFilter && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-4">Filter Data Magang</h3>
                
                {/* Row 1: Status, Tahun, Bulan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status Magang</label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="selesai">Selesai</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tahun Magang</label>
                    <Select value={filterYear} onValueChange={setFilterYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Tahun" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Tahun</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Bulan Magang</label>
                    <Select value={filterMonth} onValueChange={setFilterMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Bulan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Bulan</SelectItem>
                        <SelectItem value="1">Januari</SelectItem>
                        <SelectItem value="2">Februari</SelectItem>
                        <SelectItem value="3">Maret</SelectItem>
                        <SelectItem value="4">April</SelectItem>
                        <SelectItem value="5">Mei</SelectItem>
                        <SelectItem value="6">Juni</SelectItem>
                        <SelectItem value="7">Juli</SelectItem>
                        <SelectItem value="8">Agustus</SelectItem>
                        <SelectItem value="9">September</SelectItem>
                        <SelectItem value="10">Oktober</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">Desember</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Rentang Tanggal */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Rentang Tanggal Magang</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Dari Tanggal</label>
                      <Input 
                        type="date" 
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Sampai Tanggal</label>
                      <Input 
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Result Count */}
                <div className="mt-4 text-sm text-gray-600">
                  <span className="font-medium">{students.length}</span> data ditemukan
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        {/* TABLE */}
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 text-sm font-semibold">Siswa</th>
                  <th className="px-4 py-3 text-left text-gray-700 text-sm font-semibold">DUDI</th>
                  <th className="px-4 py-3 text-left text-gray-700 text-sm font-semibold">Periode</th>
                  <th className="px-4 py-3 text-left text-gray-700 text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-gray-700 text-sm font-semibold">Nilai</th>
                  <th className="px-4 py-3 text-left text-gray-700 text-sm font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">

                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{s.name}</p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2 items-center">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900">{s.company}</p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-gray-600">{s.period}</p>
                    </td>

                    <td className="px-4 py-4">
                      <Badge
                        className={
                          s.statusBadge === 'Aktif'
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                        }
                      >
                        {s.statusBadge}
                      </Badge>
                    </td>

                    <td className="px-4 py-4">
                      {s.score === "-" ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className="text-gray-900 font-medium">
                          {s.score}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {s.statusBadge === 'Aktif' ? (
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleSelesaiClick(s)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Selesai
                          </Button>
                        ) : (
                          <Button 
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => handleNilaiClick(s)}
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Nilai
                          </Button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* PAGINATION */}
          <div className="flex justify-end items-center mt-4 gap-2">
            <span className="text-sm text-gray-600">Tampilkan:</span>
            <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* MODAL UPDATE STATUS MAGANG */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl font-bold">
                  Update Status Magang
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Atur status dan periode magang untuk siswa <span className="font-semibold">{selectedStudent?.name}</span>
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowUpdateModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Keputusan / Status */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Keputusan / Status
              </label>
              <Select value={updateStatus} onValueChange={setUpdateStatus}>
                <SelectTrigger className="border-[#00d9d9] focus:ring-[#00d9d9]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selesai">Selesai</SelectItem>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tanggal Mulai dan Selesai */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tanggal Mulai
                </label>
                <Input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tanggal Selesai
                </label>
                <Input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Catatan Tambahan */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Catatan Tambahan
              </label>
              <Textarea 
                placeholder="Opsional: Catatan untuk siswa..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button 
              variant="outline"
              onClick={() => setShowUpdateModal(false)}
            >
              Batal
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSaveUpdate}
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL INPUT NILAI AKHIR */}
      <Dialog open={showNilaiModal} onOpenChange={setShowNilaiModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl font-bold">
                  Input Nilai Akhir
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Berikan nilai akhir untuk <span className="font-semibold">{selectedStudent?.name}</span>
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowNilaiModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Input Nilai */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Nilai Akhir (0-100)
              </label>
              <Input 
                type="number"
                min="0"
                max="100"
                placeholder="Masukkan nilai..."
                value={nilaiAkhir}
                onChange={(e) => setNilaiAkhir(e.target.value)}
                className="border-[#00d9d9] focus:ring-[#00d9d9]"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button 
              variant="outline"
              onClick={() => setShowNilaiModal(false)}
            >
              Batal
            </Button>
            <Button 
              className="bg-[#00d9d9] hover:bg-[#00c0c0] text-white"
              onClick={handleSaveNilai}
            >
              Simpan Nilai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}