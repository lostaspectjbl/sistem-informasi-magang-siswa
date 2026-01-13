'use client';

import { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, Check, X, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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

interface Jurnal {
  id: number;
  siswa: string;
  nis: string;
  tanggal: string;
  kegiatan: string;
  kendala: string;
  status: 'Belum Diverifikasi' | 'Disetujui' | 'Ditolak';
  catatan: string;
}

export default function ApprovalJurnalPage() {
  const [jurnalList, setJurnalList] = useState<Jurnal[]>([
    {
      id: 1,
      siswa: 'Siti Nurhaliza',
      nis: '2024001',
      tanggal: '2024-07-19',
      kegiatan: 'Implementasi form validation dan data management menggunakan React Hook Form',
      kendala: 'Belum memahami konsep controlled vs uncontrolled components',
      status: 'Belum Diverifikasi',
      catatan: '',
    },
    {
      id: 2,
      siswa: 'Ahmad Rizki Ramadhan',
      nis: '2024001',
      tanggal: '2024-07-18',
      kegiatan: 'Belajar backend Laravel untuk membangun REST API sistem kasir. Mempelajari konsep MVC dan routing.',
      kendala: 'Error saat menjalankan migration database dan kesulitan memahami relationship antar tabel',
      status: 'Belum Diverifikasi',
      catatan: '',
    },
    {
      id: 3,
      siswa: 'Ahmad Rizki Ramadhan',
      nis: '2024001',
      tanggal: '2024-07-17',
      kegiatan: 'Membuat desain UI aplikasi kasir menggunakan Figma. Melakukan analisis user experience dan wireframing untuk...',
      kendala: 'Kesulitan menentukan skema warna yang tepat dan konsisten untuk seluruh aplikasi',
      status: 'Disetujui',
      catatan: 'Bagus, lanjutkan dengan implementasi',
    },
    {
      id: 4,
      siswa: 'Siti Nurhaliza',
      nis: '2024001',
      tanggal: '2024-07-16',
      kegiatan: 'Membuat landing page untuk website company profile menggunakan React dan Tailwind CSS',
      kendala: 'Kesulitan dengan design yang belum sempurna di berbagai ukuran layar',
      status: 'Disetujui',
      catatan: 'Perhatikan layout responsive-ness',
    },
    {
      id: 5,
      siswa: 'Dewi Lestari',
      nis: '2024001',
      tanggal: '2024-07-12',
      kegiatan: 'Debugging dan testing aplikasi mobile untuk menemukan semua bug sebelum rilis akhir nrojectapa push',
      kendala: 'Menemukan beberapa bug pada fitur notification push',
      status: 'Disetujui',
      catatan: 'Kalau bagus, dokumentasikan langkah bugfixing',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedJurnal, setSelectedJurnal] = useState<Jurnal | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [catatan, setCatatan] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Calculate stats
  const totalLogbook = jurnalList.length;
  const belumDiverifikasi = jurnalList.filter(j => j.status === 'Belum Diverifikasi').length;
  const disetujui = jurnalList.filter(j => j.status === 'Disetujui').length;
  const ditolak = jurnalList.filter(j => j.status === 'Ditolak').length;

  const stats = [
    { title: 'Total Logbook', value: totalLogbook, subtitle: 'Laporan terdaftar', icon: FileText },
    { title: 'Belum Diverifikasi', value: belumDiverifikasi, subtitle: 'Menunggu verifikasi', icon: Clock },
    { title: 'Disetujui', value: disetujui, subtitle: 'Sudah diverifikasi', icon: CheckCircle },
    { title: 'Ditolak', value: ditolak, subtitle: 'Perlu diperbaiki', icon: XCircle },
  ];

  // Filter jurnal
  const filteredJurnal = jurnalList.filter((jurnal) => {
    const matchSearch = 
      jurnal.siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jurnal.kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jurnal.kendala.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = !filterStatus || jurnal.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const handleDetail = (jurnal: Jurnal) => {
    setSelectedJurnal(jurnal);
    setShowDetailDialog(true);
  };

  const handleApproval = (jurnal: Jurnal, action: 'approve' | 'reject') => {
    setSelectedJurnal(jurnal);
    setApprovalAction(action);
    setCatatan(jurnal.catatan);
    setShowApprovalDialog(true);
  };

  const handleSubmitApproval = () => {
    if (selectedJurnal) {
      setJurnalList(jurnalList.map(j =>
        j.id === selectedJurnal.id
          ? { ...j, status: approvalAction === 'approve' ? 'Disetujui' : 'Ditolak', catatan }
          : j
      ));
      setShowApprovalDialog(false);
      setCatatan('');
      setSelectedJurnal(null);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredJurnal.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredJurnal.map(j => j.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return 'bg-green-100 text-green-700';
      case 'Ditolak':
        return 'bg-red-100 text-red-700';
      case 'Belum Diverifikasi':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Approval Jurnal Harian</h1>
        <p className="text-gray-600">Review dan setujui jurnal harian siswa bimbingan</p>
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
                    <Icon className="w-5 h-5 text-[#ad46ff]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <Input
              placeholder="Cari siswa, kegiatan, atau kendala..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Tampilkan Filter</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tampilkan:</span>
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
              <span className="text-sm text-gray-600">per halaman</span>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">
                    <Checkbox
                      checked={selectedIds.length === filteredJurnal.length && filteredJurnal.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Siswa & Tanggal</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Kegiatan & Kendala</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Catatan Guru</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredJurnal.map((jurnal) => (
                  <tr key={jurnal.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedIds.includes(jurnal.id)}
                        onCheckedChange={() => handleCheckboxChange(jurnal.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-800 mb-1">{jurnal.siswa}</p>
                        <p className="text-xs text-gray-500">NIS: {jurnal.nis}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(jurnal.tanggal)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-semibold text-gray-700">Kegiatan:</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{jurnal.kegiatan}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700">Kendala:</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{jurnal.kendala}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={`${getStatusColor(jurnal.status)} border-0 whitespace-nowrap`}>
                        {jurnal.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600">
                        {jurnal.catatan || 'Belum ada catatan'}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDetail(jurnal)}
                          className="hover:bg-purple-50"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleApproval(jurnal, 'approve')}
                          className="hover:bg-green-50"
                          disabled={jurnal.status === 'Disetujui'}
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleApproval(jurnal, 'reject')}
                          className="hover:bg-red-50"
                          disabled={jurnal.status === 'Ditolak'}
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan 1 sampai 5 dari 5 entri
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

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Jurnal Harian</DialogTitle>
            <DialogDescription>Informasi lengkap jurnal harian siswa</DialogDescription>
          </DialogHeader>

          {selectedJurnal && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Nama Siswa</Label>
                  <p className="font-medium text-gray-800">{selectedJurnal.siswa}</p>
                </div>
                <div>
                  <Label className="text-gray-600">NIS</Label>
                  <p className="font-medium text-gray-800">{selectedJurnal.nis}</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-600">Tanggal</Label>
                <p className="font-medium text-gray-800">{formatDate(selectedJurnal.tanggal)}</p>
              </div>

              <div>
                <Label className="text-gray-600">Kegiatan</Label>
                <p className="text-sm text-gray-800 mt-1">{selectedJurnal.kegiatan}</p>
              </div>

              <div>
                <Label className="text-gray-600">Kendala</Label>
                <p className="text-sm text-gray-800 mt-1">{selectedJurnal.kendala}</p>
              </div>

              <div>
                <Label className="text-gray-600">Status</Label>
                <div className="mt-1">
                  <Badge className={`${getStatusColor(selectedJurnal.status)} border-0`}>
                    {selectedJurnal.status}
                  </Badge>
                </div>
              </div>

              {selectedJurnal.catatan && (
                <div>
                  <Label className="text-gray-600">Catatan Guru</Label>
                  <p className="text-sm text-gray-800 mt-1">{selectedJurnal.catatan}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Setujui Jurnal' : 'Tolak Jurnal'}
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'approve'
                ? 'Berikan catatan untuk siswa (opsional)'
                : 'Berikan alasan penolakan'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedJurnal && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Siswa:</p>
                <p className="font-semibold text-gray-800">{selectedJurnal.siswa}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(selectedJurnal.tanggal)}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="catatan">
                Catatan {approvalAction === 'reject' && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="catatan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder={
                  approvalAction === 'approve'
                    ? 'Berikan feedback atau saran (opsional)...'
                    : 'Jelaskan alasan penolakan dan apa yang perlu diperbaiki...'
                }
                rows={4}
                required={approvalAction === 'reject'}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowApprovalDialog(false);
                setCatatan('');
              }}
            >
              Batal
            </Button>
            <Button
              className={
                approvalAction === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
              onClick={handleSubmitApproval}
              disabled={approvalAction === 'reject' && !catatan}
            >
              {approvalAction === 'approve' ? 'Setujui' : 'Tolak'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}