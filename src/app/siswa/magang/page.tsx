'use client';

import { useState, useEffect, useCallback } from 'react';
import { Building2, MapPin, Users, Calendar, Phone, User, Search, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types';

type SiswaRow = Database['public']['Tables']['siswa']['Row'];
type MagangRow = Database['public']['Tables']['magang']['Row'];
type DudiRow = Database['public']['Tables']['dudi']['Row'];
type GuruRow = Database['public']['Tables']['guru']['Row'];
type PendaftaranRow = Database['public']['Tables']['pendaftaran_magang']['Row'];

interface StatusMagang {
  siswa: SiswaRow;
  magang: MagangRow | null;
  dudi: DudiRow | null;
  guru: GuruRow | null;
  riwayatPendaftaran: (PendaftaranRow & { dudi: DudiRow })[];
  pendaftaranPending: number;
}

export default function MagangPage() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'cari'>('status');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [statusMagang, setStatusMagang] = useState<StatusMagang | null>(null);
  const [perusahaanList, setPerusahaanList] = useState<DudiRow[]>([]);
  const [selectedPerusahaan, setSelectedPerusahaan] = useState<DudiRow | null>(null);
  const [showDaftarDialog, setShowDaftarDialog] = useState(false);

  const currentSiswaEmail = "jabal.siswa@sekolah.id"; // Email siswa yang login

  // Fetch data status magang siswa
  const fetchStatusMagang = useCallback(async () => {
    try {
      setLoading(true);

      // Ambil data siswa
      const { data: siswaData, error: siswaError } = await supabase
        .from('siswa')
        .select('*')
        .eq('email', currentSiswaEmail)
        .single();

      if (siswaError) throw siswaError;
      if (!siswaData) throw new Error('Data siswa tidak ditemukan');

      // Ambil magang aktif
      const { data: rawMagangData, error: magangError } = await supabase
        .from('magang')
        .select('*')
        .eq('siswa_id', (siswaData as any).id)
        .eq('status', 'aktif')
        .single();

      const magangData = rawMagangData as any;

      // Ambil data dudi jika ada magang aktif
      let dudiData: DudiRow | null = null;
      if (magangData && magangData.dudi_id) {
        const { data: dudi, error: dudiError } = await supabase
          .from('dudi')
          .select('*')
          .eq('id', magangData.dudi_id)
          .single();
        
        if (!dudiError) dudiData = dudi as any;
      }

      // Ambil data guru pembimbing
      let guruData: GuruRow | null = null;
      if (magangData && magangData.guru_id) {
        const { data: guru, error: guruError } = await supabase
          .from('guru')
          .select('*')
          .eq('id', magangData.guru_id)
          .single();
        
        if (!guruError) guruData = guru as any;
      }

      // Ambil riwayat pendaftaran
      const { data: rawPendaftaranData, error: pendaftaranError } = await supabase
        .from('pendaftaran_magang')
        .select(`
          *,
          dudi:dudi_id (*)
        `)
        .eq('siswa_id', (siswaData as any).id)
        .order('tanggal_daftar', { ascending: false });

      const pendaftaranData = rawPendaftaranData as any;

      const riwayat = (pendaftaranData || []).map((p: any) => ({
        ...p,
        dudi: p.dudi
      }));

      const pendingCount = riwayat.filter((p: any) => p.status === 'pending').length;

      setStatusMagang({
        siswa: siswaData as any,
        magang: magangData || null,
        dudi: dudiData,
        guru: guruData,
        riwayatPendaftaran: riwayat,
        pendaftaranPending: pendingCount
      });

    } catch (error: any) {
      console.error('Error fetching status magang:', error);
      alert('Gagal memuat data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch daftar perusahaan
  const fetchPerusahaan = useCallback(async () => {
    try {
      const { data: rawData, error } = await supabase
        .from('dudi')
        .select('*')
        .eq('status', 'aktif')
        .order('nama_perusahaan');

      if (error) throw error;
      setPerusahaanList((rawData as any) || []);
    } catch (error: any) {
      console.error('Error fetching perusahaan:', error);
    }
  }, []);

  useEffect(() => {
    fetchStatusMagang();
    fetchPerusahaan();
  }, [fetchStatusMagang, fetchPerusahaan]);

  // Handle pendaftaran magang
  const handleDaftar = async () => {
    if (!selectedPerusahaan || !statusMagang) return;

    try {
      setActionLoading(true);

      const insertData: any = {
        dudi_id: selectedPerusahaan.id,
        siswa_id: statusMagang.siswa.id,
        guru_id: statusMagang.siswa.guru_id,
        status: 'pending',
        tanggal_daftar: new Date().toISOString().split('T')[0]
      };

      const { error } = await supabase
        .from('pendaftaran_magang')
        .insert(insertData);

      if (error) throw error;

      alert('Pendaftaran berhasil dikirim!');
      setShowDaftarDialog(false);
      setSelectedPerusahaan(null);
      await fetchStatusMagang();

    } catch (error: any) {
      console.error('Error mendaftar:', error);
      alert('Gagal mendaftar: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPerusahaan = perusahaanList.filter(p =>
    p.nama_perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.alamat?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isMagangAktif = statusMagang?.magang?.status === 'aktif';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="animate-spin text-purple-600 h-10 w-10" />
        <p className="text-gray-500 animate-pulse">Memuat data magang...</p>
      </div>
    );
  }

  if (!statusMagang) {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Data siswa tidak ditemukan. Silakan hubungi administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Magang Siswa</h1>
        <p className="text-purple-50">Cari tempat magang dan pantau status pendaftaran Anda</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200 w-fit">
        <button
          onClick={() => setActiveTab('status')}
          className={`px-6 py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'status'
              ? 'bg-purple-500 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" />
          Status Magang Saya
        </button>
        <button
          onClick={() => setActiveTab('cari')}
          className={`px-6 py-2.5 rounded-md font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'cari'
              ? 'bg-purple-500 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Cari Tempat Magang
        </button>
      </div>

      {/* Tab Content: Status Magang */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          {/* Info Siswa & Pendaftaran */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {statusMagang.siswa.nama} • {statusMagang.siswa.nis}
                  </h2>
                  <p className="text-gray-600">
                    {statusMagang.siswa.kelas} • {statusMagang.siswa.jurusan}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-500">
                    {statusMagang.pendaftaranPending}/{statusMagang.riwayatPendaftaran.length}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Pendaftaran Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detail Magang Aktif */}
          {isMagangAktif && statusMagang.magang && statusMagang.dudi && (
            <Card className="border-2 bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 p-1.5 rounded-full">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Detail Magang Aktif</h3>
                  </div>
                  <Badge className="bg-green-500 text-white hover:bg-green-500 px-4 py-1">
                    Berlangsung
                  </Badge>
                </div>

                {/* Data Siswa */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-gray-600" />
                    <h4 className="font-semibold text-gray-800">Data Siswa</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div>
                      <p className="text-sm text-gray-600">Nama Lengkap</p>
                      <p className="font-medium text-gray-800">{statusMagang.siswa.nama}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">NIS</p>
                      <p className="font-medium text-gray-800">{statusMagang.siswa.nis}</p>
                    </div>
                  </div>
                </div>

                {/* Tempat Magang */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <h4 className="font-semibold text-gray-800">Tempat Magang</h4>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{statusMagang.dudi.nama_perusahaan}</p>
                        <div className="flex items-start gap-2 text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{statusMagang.dudi.alamat}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Phone className="w-4 h-4" />
                          <span>{statusMagang.dudi.telepon}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guru Pembimbing */}
                {statusMagang.guru && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-800">Guru Pembimbing</h4>
                    </div>
                    <div className="pl-6 flex items-start gap-3">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{statusMagang.guru.nama}</p>
                        <p className="text-sm text-gray-600">NIP: {statusMagang.guru.nip}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tanggal */}
                <div className="grid grid-cols-2 gap-6 pl-6">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium text-gray-700">Tanggal Mulai</p>
                    </div>
                    <p className="text-lg font-bold text-gray-800">
                      {statusMagang.magang.tanggal_mulai ? 
                        new Date(statusMagang.magang.tanggal_mulai).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium text-gray-700">Tanggal Selesai</p>
                    </div>
                    <p className="text-lg font-bold text-gray-800">
                      {statusMagang.magang.tanggal_selesai ? 
                        new Date(statusMagang.magang.tanggal_selesai).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tidak Ada Magang Aktif */}
          {!isMagangAktif && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Anda belum memiliki magang aktif. Silakan cari tempat magang di tab "Cari Tempat Magang".
              </AlertDescription>
            </Alert>
          )}

          {/* Riwayat Pendaftaran */}
          {statusMagang.riwayatPendaftaran.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Riwayat Pendaftaran</h3>
              <div className="space-y-3">
                {statusMagang.riwayatPendaftaran.map((item) => {
                  const statusColors = {
                    pending: 'bg-yellow-100 text-yellow-700',
                    diterima: 'bg-green-100 text-green-700',
                    ditolak: 'bg-red-100 text-red-700'
                  };
                  
                  return (
                    <Card key={item.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="bg-gray-100 p-2 rounded-lg">
                              <Building2 className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{item.dudi.nama_perusahaan}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(item.tanggal_daftar).toLocaleDateString('id-ID', { 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })}
                              </p>
                              {item.status === 'ditolak' && item.alasan_penolakan && (
                                <p className="text-xs text-red-600 mt-1 italic">{item.alasan_penolakan}</p>
                              )}
                            </div>
                          </div>
                          <Badge className={`${statusColors[item.status as keyof typeof statusColors]} border-0`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Cari Tempat Magang */}
      {activeTab === 'cari' && (
        <div className="space-y-6">
          {/* Alert jika sudah magang */}
          {isMagangAktif && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Anda Sedang Magang!</strong>
                <br />
                Pendaftaran baru dinonaktifkan karena Anda sedang dalam program magang aktif.
              </AlertDescription>
            </Alert>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Cari perusahaan atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Perusahaan Cards */}
          <div className="space-y-4">
            {filteredPerusahaan.map((perusahaan) => (
              <Card key={perusahaan.id} className="border hover:border-purple-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">
                        {perusahaan.nama_perusahaan}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                          <span>{perusahaan.alamat || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                          <span>{perusahaan.telepon || '-'}</span>
                        </div>
                        {perusahaan.penanggung_jawab && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4 flex-shrink-0 text-gray-400" />
                            <span>{perusahaan.penanggung_jawab}</span>
                          </div>
                        )}
                      </div>

                      <Button 
                        className={`w-full ${
                          isMagangAktif 
                            ? 'bg-gray-200 text-gray-500 hover:bg-gray-200 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                        }`}
                        disabled={isMagangAktif}
                        onClick={() => {
                          setSelectedPerusahaan(perusahaan);
                          setShowDaftarDialog(true);
                        }}
                      >
                        {isMagangAktif ? 'Sedang Magang' : 'Daftar Sekarang'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPerusahaan.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada perusahaan yang ditemukan</p>
            </div>
          )}
        </div>
      )}

      {/* Dialog Konfirmasi Pendaftaran */}
      <Dialog open={showDaftarDialog} onOpenChange={setShowDaftarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Pendaftaran</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mendaftar magang di perusahaan ini?
            </DialogDescription>
          </DialogHeader>
          
          {selectedPerusahaan && (
            <div className="py-4 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nama Perusahaan</p>
                <p className="font-semibold text-gray-800">{selectedPerusahaan.nama_perusahaan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Alamat</p>
                <p className="text-gray-800">{selectedPerusahaan.alamat}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telepon</p>
                <p className="text-gray-800">{selectedPerusahaan.telepon}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDaftarDialog(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleDaftar} 
              disabled={actionLoading}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Daftar Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}