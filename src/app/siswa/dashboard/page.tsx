// File: src/app/siswa/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, CheckCircle, Clock, XCircle, 
  Loader2, AlertCircle, Building2, User, Calendar, BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types';

// Tipe dasar dari Supabase
type SiswaTable = Database['public']['Tables']['siswa']['Row'];
type MagangTable = Database['public']['Tables']['magang']['Row'];
type LogbookTable = Database['public']['Tables']['logbook']['Row'];

// Interface untuk hasil join (relasi)
interface SiswaJoined extends SiswaTable {
  guru: { nama: string; telepon: string | null } | null;
  dudi: { nama_perusahaan: string; alamat: string | null; penanggung_jawab: string | null } | null;
}

export default function SiswaDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [siswa, setSiswa] = useState<SiswaJoined | null>(null);
  const [magang, setMagang] = useState<MagangTable | null>(null);
  const [recentLogs, setRecentLogs] = useState<LogbookTable[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    disetujui: 0,
    pending: 0,
    ditolak: 0
  });

  const currentSiswaEmail = "siti.siswa@sekolah.id";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch siswa + relasi
      const { data: rawSiswa, error: siswaError } = await supabase
        .from('siswa')
        .select(`
          *,
          guru:guru_id (nama, telepon),
          dudi:dudi_id (nama_perusahaan, alamat, penanggung_jawab)
        `)
        .eq('email', currentSiswaEmail)
        .single();

      if (siswaError) throw siswaError;
      if (!rawSiswa) throw new Error('Data siswa tidak ditemukan');

      // Casting ke unknown dulu baru ke SiswaJoined untuk menghindari 'never'
      const siswaData = (rawSiswa as unknown) as SiswaJoined;
      setSiswa(siswaData);

      // Ambil ID ke variabel lokal dengan tipe pasti
      const targetSiswaId: number = siswaData.id;

      // 2. Fetch magang terbaru
      const { data: rawMagang, error: magangError } = await supabase
        .from('magang')
        .select('*')
        .eq('siswa_id', targetSiswaId) // Baris 68 - Sekarang AMAN
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (magangError) throw magangError;

      if (!rawMagang) {
        setMagang(null);
        setRecentLogs([]);
        setStats({ total: 0, disetujui: 0, pending: 0, ditolak: 0 });
      } else {
        // Casting ke unknown dulu baru ke MagangTable
        const magangData = (rawMagang as unknown) as MagangTable;
        setMagang(magangData);

        const targetMagangId: number = magangData.id;

        // 3. Fetch logbook
        const { data: rawLogs, error: logsError } = await supabase
          .from('logbook')
          .select('*')
          .eq('magang_id', targetMagangId) // Baris 96 - Sekarang AMAN
          .order('tanggal', { ascending: false });

        if (logsError) throw logsError;

        const logs = (rawLogs as unknown as LogbookTable[]) || [];

        setStats({
          total: logs.length,
          disetujui: logs.filter(l => l.status_verifikasi === 'disetujui').length,
          pending: logs.filter(l => l.status_verifikasi === 'pending').length,
          ditolak: logs.filter(l => l.status_verifikasi === 'ditolak').length,
        });

        setRecentLogs(logs.slice(0, 3));
      }

    } catch (err: any) {
      console.error('[Dashboard Error]', err);
      setError(err.message || 'Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return "bg-gray-100 text-gray-700";
    const colors: Record<string, string> = {
      disetujui: "bg-green-100 text-green-700 border-none",
      pending: "bg-yellow-100 text-yellow-700 border-none",
      ditolak: "bg-red-100 text-red-700 border-none",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin text-purple-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Halo, {siswa?.nama || 'Siswa'}! 👋</h1>
        <p className="opacity-80">
          {siswa?.nis || '-'} • {siswa?.kelas || '-'} • {siswa?.jurusan || '-'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", val: stats.total, icon: FileText, bg: "bg-blue-50", text: "text-blue-600" },
          { label: "Setuju", val: stats.disetujui, icon: CheckCircle, bg: "bg-green-50", text: "text-green-600" },
          { label: "Pending", val: stats.pending, icon: Clock, bg: "bg-yellow-50", text: "text-yellow-600" },
          { label: "Tolak", val: stats.ditolak, icon: XCircle, bg: "bg-red-50", text: "text-red-600" },
        ].map((item, idx) => (
          <Card key={idx} className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2 rounded-lg ${item.bg} ${item.text}`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">{item.label}</p>
                <p className="text-2xl font-black">{item.val}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Magang */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Info Magang
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!magang ? (
              <p className="text-gray-400 italic">Belum terdaftar magang aktif.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Perusahaan</p>
                  <p className="font-bold text-gray-800">{siswa?.dudi?.nama_perusahaan || '-'}</p>
                  <p className="text-sm text-gray-600">{siswa?.dudi?.alamat || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Pembimbing Guru</p>
                  <p className="font-bold text-gray-800">{siswa?.guru?.nama || '-'}</p>
                  <p className="text-sm text-gray-600">{siswa?.guru?.telepon || '-'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aksi Cepat */}
        <Card className="border-none shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 font-bold h-11" 
              onClick={() => router.push('/siswa/jurnal')}
            >
              Tambah Jurnal
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-11 border-slate-200" 
              onClick={() => router.push('/siswa/jurnal')}
            >
              Lihat Riwayat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jurnal */}
      <Card className="border-none shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" /> Jurnal Terbaru
          </CardTitle>
          <Button variant="link" size="sm" className="text-purple-600 font-bold" onClick={() => router.push('/siswa/jurnal')}>
            Lihat semua
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {recentLogs.length === 0 ? (
            <p className="text-center text-gray-400 py-8 italic">Belum ada jurnal yang tercatat</p>
          ) : (
            <div className="space-y-4">
              {recentLogs.map(log => (
                <div key={log.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500">
                      {new Date(log.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <Badge className={`${getStatusBadge(log.status_verifikasi)} capitalize font-bold`}>
                      {log.status_verifikasi || 'pending'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{log.kegiatan}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}