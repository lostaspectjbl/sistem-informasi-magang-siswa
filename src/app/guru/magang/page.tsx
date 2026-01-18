'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Users, GraduationCap, CheckCircle2, Clock,
  Search, Edit2, Building2, ChevronUp, X, AlertCircle
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
import { Alert, AlertDescription } from "@/components/ui/alert";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface untuk tipe data
interface Student {
  id: number;
  siswa_id: number;
  name: string;
  company: string;
  period: string;
  statusBadge: string;
  score: string;
  startDate: string;
  endDate: string;
  catatan?: string;
}

interface Stats {
  totalSiswa: number;
  magangAktif: number;
  pending: number;
  rataRataNilai: number;
  siswaSelesai: number;
}

export default function GuruMagangPage() {
  // State untuk data
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSiswa: 0,
    magangAktif: 0,
    pending: 0,
    rataRataNilai: 0,
    siswaSelesai: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guruId, setGuruId] = useState<number>(2); // Default guru ID, sesuaikan dengan login

  // State untuk filter dan pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  
  // State untuk modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [updateStatus, setUpdateStatus] = useState('selesai');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [showNilaiModal, setShowNilaiModal] = useState(false);
  const [nilaiAkhir, setNilaiAkhir] = useState('');

  // Fetch data siswa magang
  const fetchMagangData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query untuk mendapatkan data magang dengan join
      const { data: magangData, error: magangError } = await supabase
        .from('magang')
        .select(`
          id,
          siswa_id,
          dudi_id,
          status,
          nilai_akhir,
          tanggal_mulai,
          tanggal_selesai,
          catatan,
          siswa (
            id,
            nama,
            nis
          ),
          dudi (
            id,
            nama_perusahaan
          )
        `)
        .eq('guru_id', guruId)
        .order('created_at', { ascending: false });

      if (magangError) throw magangError;

      // Transform data untuk UI
      const transformedData: Student[] = (magangData || []).map((m: any) => ({
        id: m.id,
        siswa_id: m.siswa_id,
        name: m.siswa?.nama || 'N/A',
        company: m.dudi?.nama_perusahaan || 'N/A',
        period: formatPeriod(m.tanggal_mulai, m.tanggal_selesai),
        statusBadge: capitalizeStatus(m.status),
        score: m.nilai_akhir?.toString() || '-',
        startDate: m.tanggal_mulai ? formatDateForInput(m.tanggal_mulai) : '',
        endDate: m.tanggal_selesai ? formatDateForInput(m.tanggal_selesai) : '',
        catatan: m.catatan
      }));

      setStudents(transformedData);
      calculateStats(transformedData);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (data: Student[]) => {
    const total = data.length;
    const aktif = data.filter(s => s.statusBadge === 'Aktif').length;
    const pending = data.filter(s => s.statusBadge === 'Pending').length;
    const selesai = data.filter(s => s.statusBadge === 'Selesai');
    const scores = selesai.filter(s => s.score !== '-').map(s => parseFloat(s.score));
    const avgScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;

    setStats({
      totalSiswa: total,
      magangAktif: aktif,
      pending: pending,
      rataRataNilai: avgScore,
      siswaSelesai: selesai.length
    });
  };

  // Format helpers
  const formatPeriod = (start: string | null, end: string | null) => {
    if (!start || !end) return 'N/A';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const formatDate = (d: Date) => 
      `${d.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][d.getMonth()]} ${d.getFullYear()}`;
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const formatDateForInput = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  const capitalizeStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Handle update status magang
  const handleSaveUpdate = async () => {
    if (!selectedStudent) return;

    try {
      setLoading(true);
      
      const { error: updateError } = await supabase
        .from('magang')
        .update({
          status: updateStatus,
          tanggal_mulai: startDate,
          tanggal_selesai: endDate,
          catatan: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedStudent.id);

      if (updateError) throw updateError;

      // Log activity
      await supabase.from('activity_log').insert({
        user_id: guruId,
        action: 'UPDATE',
        entity: 'magang',
        description: `Mengubah status magang siswa ${selectedStudent.name} menjadi ${updateStatus}`
      });

      setShowUpdateModal(false);
      fetchMagangData(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan perubahan');
      console.error('Error updating:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input nilai
  const handleSaveNilai = async () => {
    if (!selectedStudent || !nilaiAkhir) return;

    const nilai = parseInt(nilaiAkhir);
    if (nilai < 0 || nilai > 100) {
      setError('Nilai harus antara 0-100');
      return;
    }

    try {
      setLoading(true);

      const { error: updateError } = await supabase
        .from('magang')
        .update({
          nilai_akhir: nilai,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedStudent.id);

      if (updateError) throw updateError;

      // Log activity
      await supabase.from('activity_log').insert({
        user_id: guruId,
        action: 'UPDATE',
        entity: 'magang',
        description: `Memberikan nilai ${nilai} untuk siswa ${selectedStudent.name}`
      });

      setShowNilaiModal(false);
      fetchMagangData(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan nilai');
      console.error('Error saving score:', err);
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleSelesaiClick = (student: Student) => {
    setSelectedStudent(student);
    setStartDate(student.startDate);
    setEndDate(student.endDate);
    setUpdateStatus('selesai');
    setNotes(student.catatan || '');
    setShowUpdateModal(true);
  };

  const handleNilaiClick = (student: Student) => {
    setSelectedStudent(student);
    setNilaiAkhir(student.score !== '-' ? student.score : '');
    setShowNilaiModal(true);
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchSearch = !searchQuery || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = !filterStatus || filterStatus === 'all' || 
      student.statusBadge.toLowerCase() === filterStatus.toLowerCase();

    // Add more filter logic for year, month, date range if needed

    return matchSearch && matchStatus;
  });

  // Initial data fetch
  useEffect(() => {
    fetchMagangData();
  }, [guruId]);

  const statsDisplay = [
    { label: "Total Siswa", value: stats.totalSiswa.toString(), sublabel: "Siswa bimbingan", icon: Users },
    { label: "Magang Aktif", value: stats.magangAktif.toString(), sublabel: "Sedang berlangsung", icon: GraduationCap },
    { label: "Pending", value: stats.pending.toString(), sublabel: "Menunggu approval", icon: Clock },
    { label: "Rata-rata Nilai", value: stats.rataRataNilai.toString(), sublabel: `${stats.siswaSelesai} siswa selesai`, icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-6">
      {/* ERROR ALERT */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manajemen Siswa Magang
        </h1>
        <p className="text-gray-600">Kelola magang, tinjau pendaftaran, dan beri nilai siswa bimbingan</p>
      </div>
      
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statsDisplay.map((s, idx) => (
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
                        {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((month, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <span className="font-medium">{filteredStudents.length}</span> data ditemukan
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
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
                  {filteredStudents.map((s) => (
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
                              : s.statusBadge === 'Selesai'
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                          }
                        >
                          {s.statusBadge}
                        </Badge>
                      </td>

                      <td className="px-4 py-4">
                        {s.score === "-" ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <span className="text-gray-900 font-medium">{s.score}</span>
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
          )}
          
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

      {/* MODAL UPDATE STATUS */}
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
            <div>
              <label className="text-sm font-medium mb-2 block">Keputusan / Status</label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tanggal Mulai</label>
                <Input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tanggal Selesai</label>
                <Input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Catatan Tambahan</label>
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
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL INPUT NILAI */}
      <Dialog open={showNilaiModal} onOpenChange={setShowNilaiModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl font-bold">Input Nilai Akhir</DialogTitle>
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
            <div>
              <label className="text-sm font-medium mb-2 block">Nilai Akhir (0-100)</label>
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
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan Nilai'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}