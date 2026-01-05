'use client';

import { useState } from 'react';
import { Building2, MapPin, Users, Calendar, Search, CheckCircle, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface Perusahaan {
  id: number;
  nama: string;
  bidang: string;
  alamat: string;
  pic: string;
  kuotaMagang: string;
  slotTersisa: string;
  deskripsi: string;
  progress: number;
  kontak: string;
  website: string;
}

interface StatusMagang {
  perusahaan: string;
  bidang: string;
  alamat: string;
  pic: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'Aktif' | 'Selesai' | 'Pending';
  pembimbing: string;
}

export default function MagangPage() {
  const [activeTab, setActiveTab] = useState<'cari' | 'status'>('cari');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDaftarDialog, setShowDaftarDialog] = useState(false);
  const [selectedPerusahaan, setSelectedPerusahaan] = useState<Perusahaan | null>(null);
  const [alasanMagang, setAlasanMagang] = useState('');

  const perusahaanData: Perusahaan[] = [
    {
      id: 1,
      nama: 'PT Kreatif Teknologi',
      bidang: 'Teknologi Informasi',
      alamat: 'Jl. Merdeka No. 123, Jakarta',
      pic: 'Andi Wijaya',
      kuotaMagang: '8/12',
      slotTersisa: '4 slot tersisa',
      deskripsi: 'Perusahaan teknologi yang bergerak dalam pengembangan aplikasi web dan mobile. Memberikan kesempatan magang untuk siswa SMK jurusan IT dengan bimbingan profesional.',
      progress: 66.67,
      kontak: 'info@kreatiftek.com | 021-12345678',
      website: 'www.kreatiftek.com',
    },
    {
      id: 2,
      nama: 'CV Digital Solusi',
      bidang: 'Digital Marketing',
      alamat: 'Jl. Sudirman No. 45, Surabaya',
      pic: 'Sari Dewi',
      kuotaMagang: '5/8',
      slotTersisa: '3 slot tersisa',
      deskripsi: 'Konsultan digital marketing yang membantu UMKM berkembang di era digital. Fokus pada social media management, SEO, dan content marketing.',
      progress: 62.5,
      kontak: 'contact@digitalsolusi.com | 031-87654321',
      website: 'www.digitalsolusi.com',
    },
    {
      id: 3,
      nama: 'PT Inovasi Mandiri',
      bidang: 'Software Development',
      alamat: 'Jl. Diponegoro No. 78, Bandung',
      pic: 'Budi Santoso',
      kuotaMagang: '12/15',
      slotTersisa: '3 slot tersisa',
      deskripsi: 'Perusahaan software house yang mengembangkan sistem informasi untuk berbagai industri. Spesialisasi dalam ERP, CRM, dan aplikasi enterprise.',
      progress: 80,
      kontak: 'hr@inovasimandiri.co.id | 022-5553458',
      website: 'www.inovasimandiri.co.id',
    },
  ];

  // Status magang siswa (dummy data)
  const statusMagang: StatusMagang = {
    perusahaan: 'PT Kreatif Teknologi',
    bidang: 'Teknologi Informasi',
    alamat: 'Jl. Merdeka No. 123, Jakarta',
    pic: 'Andi Wijaya',
    tanggalMulai: '2024-01-15',
    tanggalSelesai: '2024-04-15',
    status: 'Aktif',
    pembimbing: 'Pak Suryanto',
  };

  const filteredPerusahaan = perusahaanData.filter((p) =>
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.bidang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetail = (perusahaan: Perusahaan) => {
    setSelectedPerusahaan(perusahaan);
    setShowDetailDialog(true);
  };

  const handleDaftar = (perusahaan: Perusahaan) => {
    setSelectedPerusahaan(perusahaan);
    setShowDaftarDialog(true);
  };

  const handleSubmitDaftar = () => {
    if (selectedPerusahaan && alasanMagang) {
      alert(`Pendaftaran magang ke ${selectedPerusahaan.nama} berhasil dikirim!\nAlasan: ${alasanMagang}`);
      setShowDaftarDialog(false);
      setAlasanMagang('');
      setSelectedPerusahaan(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-100 text-green-700';
      case 'Selesai':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Sistem Magang Siswa</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('cari')}
          className={`px-6 py-3 rounded-t-lg font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'cari'
              ? 'bg-[#ad46ff] text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Cari Tempat Magang
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`px-6 py-3 rounded-t-lg font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'status'
              ? 'bg-[#ad46ff] text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" />
          Status Magang
        </button>
      </div>

      {/* Tab Content: Cari Tempat Magang */}
      {activeTab === 'cari' && (
        <>
          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari perusahaan, bidang usaha, lokasi..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-gray-600">Tampilkan:</span>
                <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                  <option>6</option>
                  <option>12</option>
                  <option>24</option>
                </select>
                <span className="text-sm text-gray-600">per halaman</span>
              </div>
            </div>
          </div>

          {/* Perusahaan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPerusahaan.map((perusahaan) => (
              <div
                key={perusahaan.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#ad46ff] to-[#8b2ed9] p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-3 rounded-lg">
                      <Building2 className="w-6 h-6 text-[#ad46ff]" />
                    </div>
                    <div className="flex-1 text-white">
                      <h3 className="font-semibold text-lg mb-1">{perusahaan.nama}</h3>
                      <p className="text-sm text-purple-100">{perusahaan.bidang}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-4">
                  {/* Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#ad46ff]" />
                      <span>{perusahaan.alamat}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4 flex-shrink-0 text-[#ad46ff]" />
                      <span>PIC: {perusahaan.pic}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Kuota Magang</span>
                      <span className="text-sm font-semibold text-gray-800">{perusahaan.kuotaMagang}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div
                        className="bg-[#ad46ff] h-2.5 rounded-full transition-all"
                        style={{ width: `${perusahaan.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{perusahaan.slotTersisa}</p>
                  </div>

                  {/* Deskripsi */}
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {perusahaan.deskripsi}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 hover:bg-purple-50 hover:text-[#ad46ff] hover:border-[#ad46ff]"
                      size="sm"
                      onClick={() => handleDetail(perusahaan)}
                    >
                      <Search className="w-4 h-4 mr-1" />
                      Detail
                    </Button>
                    <Button
                      className="flex-1 bg-[#ad46ff] hover:bg-[#9b36f0] text-white"
                      size="sm"
                      onClick={() => handleDaftar(perusahaan)}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Daftar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-lg border border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan 1 sampai {filteredPerusahaan.length} dari {filteredPerusahaan.length} perusahaan
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  ‹‹
                </Button>
                <Button variant="outline" size="sm" disabled>
                  ‹
                </Button>
                <Button size="sm" className="bg-[#ad46ff] hover:bg-[#9b36f0] text-white">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  ›
                </Button>
                <Button variant="outline" size="sm" disabled>
                  ››
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab Content: Status Magang */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="border-2 border-[#ad46ff]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#ad46ff] p-3 rounded-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{statusMagang.perusahaan}</h3>
                    <p className="text-sm text-gray-600">{statusMagang.bidang}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(statusMagang.status)} border-0 text-sm px-3 py-1`}>
                  {statusMagang.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600 text-sm">Alamat Perusahaan</Label>
                    <p className="text-gray-800 flex items-start gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-[#ad46ff] mt-0.5 flex-shrink-0" />
                      {statusMagang.alamat}
                    </p>
                  </div>

                  <div>
                    <Label className="text-gray-600 text-sm">Penanggung Jawab</Label>
                    <p className="text-gray-800 flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-[#ad46ff]" />
                      {statusMagang.pic}
                    </p>
                  </div>

                  <div>
                    <Label className="text-gray-600 text-sm">Guru Pembimbing</Label>
                    <p className="text-gray-800 flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-[#ad46ff]" />
                      {statusMagang.pembimbing}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600 text-sm">Tanggal Mulai</Label>
                    <p className="text-gray-800 flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-[#ad46ff]" />
                      {formatDate(statusMagang.tanggalMulai)}
                    </p>
                  </div>

                  <div>
                    <Label className="text-gray-600 text-sm">Tanggal Selesai</Label>
                    <p className="text-gray-800 flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-[#ad46ff]" />
                      {formatDate(statusMagang.tanggalSelesai)}
                    </p>
                  </div>

                  <div>
                    <Label className="text-gray-600 text-sm">Durasi</Label>
                    <p className="text-gray-800 flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-[#ad46ff]" />
                      90 hari
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Jurnal</p>
                    <p className="text-2xl font-bold text-gray-800">45</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hari Tersisa</p>
                    <p className="text-2xl font-bold text-gray-800">25</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-[#ad46ff]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kehadiran</p>
                    <p className="text-2xl font-bold text-gray-800">95%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Detail Perusahaan
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang perusahaan dan kesempatan magang
            </DialogDescription>
          </DialogHeader>

          {selectedPerusahaan && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-gray-600">Nama Perusahaan</Label>
                <p className="font-semibold text-lg">{selectedPerusahaan.nama}</p>
              </div>

              <div>
                <Label className="text-gray-600">Bidang Usaha</Label>
                <p className="text-gray-800">{selectedPerusahaan.bidang}</p>
              </div>

              <div>
                <Label className="text-gray-600">Alamat</Label>
                <p className="text-gray-800">{selectedPerusahaan.alamat}</p>
              </div>

              <div>
                <Label className="text-gray-600">Penanggung Jawab</Label>
                <p className="text-gray-800">{selectedPerusahaan.pic}</p>
              </div>

              <div>
                <Label className="text-gray-600">Kontak</Label>
                <p className="text-gray-800">{selectedPerusahaan.kontak}</p>
              </div>

              <div>
                <Label className="text-gray-600">Website</Label>
                <p className="text-blue-600">{selectedPerusahaan.website}</p>
              </div>

              <div>
                <Label className="text-gray-600">Kuota Magang</Label>
                <p className="text-gray-800">{selectedPerusahaan.kuotaMagang} - {selectedPerusahaan.slotTersisa}</p>
              </div>

              <div>
                <Label className="text-gray-600">Deskripsi</Label>
                <p className="text-gray-800 text-sm">{selectedPerusahaan.deskripsi}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Tutup
            </Button>
            <Button 
              className="bg-[#ad46ff] hover:bg-[#9b36f0]"
              onClick={() => {
                setShowDetailDialog(false);
                if (selectedPerusahaan) handleDaftar(selectedPerusahaan);
              }}
            >
              Daftar Magang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Daftar Dialog */}
      <Dialog open={showDaftarDialog} onOpenChange={setShowDaftarDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Daftar Magang
            </DialogTitle>
            <DialogDescription>
              Lengkapi formulir pendaftaran magang
            </DialogDescription>
          </DialogHeader>

          {selectedPerusahaan && (
            <div className="space-y-4 py-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Perusahaan:</p>
                <p className="font-semibold text-gray-800">{selectedPerusahaan.nama}</p>
                <p className="text-sm text-gray-600 mt-2">{selectedPerusahaan.bidang}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alasan">
                  Alasan Memilih Perusahaan Ini <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="alasan"
                  value={alasanMagang}
                  onChange={(e) => setAlasanMagang(e.target.value)}
                  placeholder="Jelaskan mengapa Anda tertarik magang di perusahaan ini..."
                  rows={5}
                  required
                />
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Catatan:</strong> Pendaftaran akan diproses oleh admin sekolah. Anda akan mendapat notifikasi setelah pendaftaran disetujui.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDaftarDialog(false);
                setAlasanMagang('');
              }}
            >
              Batal
            </Button>
            <Button 
              className="bg-[#ad46ff] hover:bg-[#9b36f0]"
              onClick={handleSubmitDaftar}
              disabled={!alasanMagang}
            >
              Kirim Pendaftaran
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}