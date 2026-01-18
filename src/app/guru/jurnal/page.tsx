'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, Check, X, Filter, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types';

type LogbookRow = Database['public']['Tables']['logbook']['Row'];
type LogbookUpdate = Database['public']['Tables']['logbook']['Update'];

interface LogbookWithSiswa extends LogbookRow {
  siswa: {
    nama: string;
    nis: string;
  };
}

export default function ApprovalJurnalPage() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [jurnalList, setJurnalList] = useState<LogbookWithSiswa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedJurnal, setSelectedJurnal] = useState<LogbookWithSiswa | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [catatan, setCatatan] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const currentGuruEmail = "suryanto.guru@sekolah.id"; // Email guru yang login

  // Fetch logbook data
  const fetchLogbooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Ambil data guru
      const { data: guru, error: guruError } = await supabase
        .from('guru')
        .select('id')
        .eq('email', currentGuruEmail)
        .single();

      if (guruError) throw guruError;
      if (!guru) throw new Error('Data guru tidak ditemukan');

      // 2. Ambil semua siswa yang dibimbing
      const { data: siswaList, error: siswaError } = await supabase
        .from('siswa')
        .select('id')
        .eq('guru_id', (guru as any).id);

      if (siswaError) throw siswaError;

      const siswaIds = (siswaList as any)?.map((s: any) => s.id) || [];

      if (siswaIds.length === 0) {
        setJurnalList([]);
        setLoading(false);
        return;
      }

      // 3. Ambil semua magang dari siswa yang dibimbing
      const { data: magangList, error: magangError } = await supabase
        .from('magang')
        .select('id')
        .in('siswa_id', siswaIds);

      if (magangError) throw magangError;

      const magangIds = (magangList as any)?.map((m: any) => m.id) || [];

      if (magangIds.length === 0) {
        setJurnalList([]);
        setLoading(false);
        return;
      }

      // 4. Ambil semua logbook dengan join siswa
      const { data: logbooks, error: logbookError } = await supabase
        .from('logbook')
        .select(`
          *,
          magang:magang_id (
            siswa:siswa_id (
              nama,
              nis
            )
          )
        `)
        .in('magang_id', magangIds)
        .order('created_at', { ascending: false });

      if (logbookError) throw logbookError;

      // Transform data
      const transformedData = (logbooks as any)?.map((log: any) => ({
        ...log,
        siswa: log.magang?.siswa || { nama: 'N/A', nis: 'N/A' }
      })) || [];

      setJurnalList(transformedData);

    } catch (err: any) {
      console.error('Error fetching logbooks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogbooks();
  }, [fetchLogbooks]);

  // Calculate stats
  const totalLogbook = jurnalList.length;
  const belumDiverifikasi = jurnalList.filter(j => j.status_verifikasi === 'pending').length;
  const disetujui = jurnalList.filter(j => j.status_verifikasi === 'disetujui').length;
  const ditolak = jurnalList.filter(j => j.status_verifikasi === 'ditolak').length;

  const stats = [
    { title: 'Total Logbook', value: totalLogbook, subtitle: 'Laporan terdaftar', icon: FileText },
    { title: 'Belum Diverifikasi', value: belumDiverifikasi, subtitle: 'Menunggu verifikasi', icon: Clock },
    { title: 'Disetujui', value: disetujui, subtitle: 'Sudah diverifikasi', icon: CheckCircle },
    { title: 'Ditolak', value: ditolak, subtitle: 'Perlu diperbaiki', icon: XCircle },
  ];

  // Filter jurnal
  const filteredJurnal = jurnalList.filter((jurnal) => {
    const matchSearch = 
      jurnal.siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jurnal.kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jurnal.kendala?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'all' || jurnal.status_verifikasi === filterStatus;

    return matchSearch && matchStatus;
  });

  const handleDetail = (jurnal: LogbookWithSiswa) => {
    setSelectedJurnal(jurnal);
    setShowDetailDialog(true);
  };

  const handleApproval = (jurnal: LogbookWithSiswa, action: 'approve' | 'reject') => {
    setSelectedJurnal(jurnal);
    setApprovalAction(action);
    setCatatan(jurnal.catatan_guru || '');
    setShowApprovalDialog(true);
  };

  const handleSubmitApproval = async () => {
    if (!selectedJurnal) return;

    try {
      setActionLoading(true);

      const updateData: any = {
        status_verifikasi: approvalAction === 'approve' ? 'disetujui' : 'ditolak',
        catatan_guru: catatan || null,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('logbook')
        .update(updateData as never)
        .eq('id', selectedJurnal.id);

      if (updateError) throw updateError;

      // Refresh data
      await fetchLogbooks();

      setShowApprovalDialog(false);
      setCatatan('');
      setSelectedJurnal(null);

    } catch (err: any) {
      console.error('Error updating logbook:', err);
      alert('Gagal memperbarui status: ' + err.message);
    } finally {
      setActionLoading(false);
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
      case 'disetujui':
        return 'bg-green-100 text-green-700';
      case 'ditolak':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disetujui':
        return 'Disetujui';
      case 'ditolak':
        return 'Ditolak';
      case 'pending':
        return 'Belum Diverifikasi';
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="animate-spin text-purple-600 h-10 w-10" />
        <p className="text-gray-500 animate-pulse">Memuat data jurnal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Gagal memuat data: {error}
        </AlertDescription>
      </Alert>
    );
  }

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

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Belum Diverifikasi</SelectItem>
                <SelectItem value="disetujui">Disetujui</SelectItem>
                <SelectItem value="ditolak">Ditolak</SelectItem>
              </SelectContent>
            </Select>

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
                {filteredJurnal.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Tidak ada jurnal yang ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredJurnal.slice(0, parseInt(entriesPerPage)).map((jurnal) => (
                    <tr key={jurnal.id} className="hover:bg-purple-50 transition-colors">
                      <td className="px-4 py-4">
                        <Checkbox
                          checked={selectedIds.includes(jurnal.id)}
                          onCheckedChange={() => handleCheckboxChange(jurnal.id)}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-800 mb-1">{jurnal.siswa.nama}</p>
                          <p className="text-xs text-gray-500">NIS: {jurnal.siswa.nis}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(jurnal.tanggal)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2 max-w-md">
                          <div>
                            <p className="text-xs font-semibold text-gray-700">Kegiatan:</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{jurnal.kegiatan}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700">Kendala:</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{jurnal.kendala || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={`${getStatusColor(jurnal.status_verifikasi)} border-0 whitespace-nowrap`}>
                          {getStatusLabel(jurnal.status_verifikasi)}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600 max-w-xs line-clamp-2">
                          {jurnal.catatan_guru || 'Belum ada catatan'}
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
                            disabled={jurnal.status_verifikasi === 'disetujui'}
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleApproval(jurnal, 'reject')}
                            className="hover:bg-red-50"
                            disabled={jurnal.status_verifikasi === 'ditolak'}
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {Math.min(filteredJurnal.length, parseInt(entriesPerPage))} dari {filteredJurnal.length} entri
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
                  <p className="font-medium text-gray-800">{selectedJurnal.siswa.nama}</p>
                </div>
                <div>
                  <Label className="text-gray-600">NIS</Label>
                  <p className="font-medium text-gray-800">{selectedJurnal.siswa.nis}</p>
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
                <p className="text-sm text-gray-800 mt-1">{selectedJurnal.kendala || '-'}</p>
              </div>

              <div>
                <Label className="text-gray-600">Status</Label>
                <div className="mt-1">
                  <Badge className={`${getStatusColor(selectedJurnal.status_verifikasi)} border-0`}>
                    {getStatusLabel(selectedJurnal.status_verifikasi)}
                  </Badge>
                </div>
              </div>

              {selectedJurnal.catatan_guru && (
                <div>
                  <Label className="text-gray-600">Catatan Guru</Label>
                  <p className="text-sm text-gray-800 mt-1">{selectedJurnal.catatan_guru}</p>
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
                <p className="font-semibold text-gray-800">{selectedJurnal.siswa.nama}</p>
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
              disabled={actionLoading}
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
              disabled={actionLoading || (approvalAction === 'reject' && !catatan)}
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {approvalAction === 'approve' ? 'Setujui' : 'Tolak'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}