'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types';

type GuruRow = Database['public']['Tables']['guru']['Row'];
type SiswaRow = Database['public']['Tables']['siswa']['Row'];
type MagangRow = Database['public']['Tables']['magang']['Row'];
type LogbookRow = Database['public']['Tables']['logbook']['Row'];
type DudiRow = Database['public']['Tables']['dudi']['Row'];

interface MagangWithDetails extends MagangRow {
  siswa: SiswaRow;
  dudi: DudiRow;
}

interface LogbookWithDetails extends LogbookRow {
  magang: {
    siswa: SiswaRow;
  };
}

interface DashboardStats {
  totalSiswa: number;
  siswaMagang: number;
  logbookHariIni: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [guruData, setGuruData] = useState<GuruRow | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalSiswa: 0,
    siswaMagang: 0,
    logbookHariIni: 0
  });
  const [internships, setInternships] = useState<MagangWithDetails[]>([]);
  const [logbooks, setLogbooks] = useState<LogbookWithDetails[]>([]);

  const currentGuruEmail = "suryanto.guru@sekolah.id"; // Email guru yang login

  // Fetch semua data dashboard
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Ambil data guru
      const { data: guru, error: guruError } = await supabase
        .from('guru')
        .select('*')
        .eq('email', currentGuruEmail)
        .single();

      if (guruError) throw guruError;
      if (!guru) throw new Error('Data guru tidak ditemukan');

      setGuruData(guru as any);

      // 2. Ambil semua siswa yang dibimbing guru ini
      const { data: siswaList, error: siswaError } = await supabase
        .from('siswa')
        .select('*')
        .eq('guru_id', (guru as any).id);

      if (siswaError) throw siswaError;

      const totalSiswa = (siswaList as any)?.length || 0;
      const siswaIds = (siswaList as any)?.map((s: any) => s.id) || [];

      // 3. Ambil magang aktif dari siswa yang dibimbing
      let magangList: any[] = [];
      if (siswaIds.length > 0) {
        const { data: magang, error: magangError } = await supabase
          .from('magang')
          .select(`
            *,
            siswa:siswa_id (*),
            dudi:dudi_id (*)
          `)
          .in('siswa_id', siswaIds)
          .eq('status', 'aktif')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!magangError && magang) {
          magangList = magang.map((m: any) => ({
            ...m,
            siswa: m.siswa,
            dudi: m.dudi
          }));
        }
      }

      const siswaMagang = magangList.length;

      // 4. Ambil logbook hari ini
      const today = new Date().toISOString().split('T')[0];
      let logbookHariIni = 0;
      let logbookList: any[] = [];

      if (siswaIds.length > 0) {
        // Ambil semua magang_id dari siswa yang dibimbing
        const { data: allMagang, error: allMagangError } = await supabase
          .from('magang')
          .select('id')
          .in('siswa_id', siswaIds);

        const magangIds = (allMagang as any)?.map((m: any) => m.id) || [];

        if (magangIds.length > 0) {
          // Ambil logbook hari ini
          const { data: logbookToday, error: logbookTodayError } = await supabase
            .from('logbook')
            .select('id')
            .in('magang_id', magangIds)
            .eq('tanggal', today);

          logbookHariIni = (logbookToday as any)?.length || 0;

          // Ambil logbook terbaru (5 terakhir)
          const { data: recentLogbooks, error: logbookError } = await supabase
            .from('logbook')
            .select(`
              *,
              magang:magang_id (
                siswa:siswa_id (*)
              )
            `)
            .in('magang_id', magangIds)
            .order('created_at', { ascending: false })
            .limit(5);

          if (!logbookError && recentLogbooks) {
            logbookList = recentLogbooks.map((l: any) => ({
              ...l,
              magang: {
                siswa: l.magang?.siswa
              }
            }));
          }
        }
      }

      // Update state
      setStats({
        totalSiswa,
        siswaMagang,
        logbookHariIni
      });
      setInternships(magangList);
      setLogbooks(logbookList);

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="animate-spin text-purple-600 h-10 w-10" />
        <p className="text-gray-500 animate-pulse">Memuat dashboard...</p>
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

  const statsData = [
    { 
      title: "Total Siswa", 
      value: stats.totalSiswa.toString(), 
      subtitle: "Seluruh siswa bimbingan", 
      icon: Users 
    },
    { 
      title: "Siswa Magang", 
      value: stats.siswaMagang.toString(), 
      subtitle: "Sedang aktif magang", 
      icon: Users 
    },
    { 
      title: "Logbook Hari Ini", 
      value: stats.logbookHariIni.toString(), 
      subtitle: "Laporan masuk hari ini", 
      icon: BookOpen 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Guru</h1>
        <p className="text-gray-600">
          Pantau dan kelola siswa bimbingan Anda
          {guruData && <span className="font-semibold"> - {guruData.nama}</span>}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-[#ad46ff]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Magang Terbaru */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#ad46ff]" />
            Magang Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {internships.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada siswa yang magang
            </div>
          ) : (
            internships.map((internship, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-[#ad46ff] text-white">
                      {internship.siswa?.nama?.[0] || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-800">{internship.siswa?.nama || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{internship.dudi?.nama_perusahaan || 'N/A'}</p>
                    <p className="text-xs text-gray-500">
                      {internship.tanggal_mulai && internship.tanggal_selesai ? (
                        `${new Date(internship.tanggal_mulai).toLocaleDateString('id-ID')} - ${new Date(internship.tanggal_selesai).toLocaleDateString('id-ID')}`
                      ) : 'Tanggal belum ditentukan'}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  Aktif
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Logbook Terbaru */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-[#ad46ff]" />
            Logbook Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {logbooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada logbook yang masuk
            </div>
          ) : (
            logbooks.map((logbook, index) => {
              const statusColors = {
                disetujui: 'bg-green-100 text-green-700 hover:bg-green-100',
                pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
                ditolak: 'bg-red-100 text-red-700 hover:bg-red-100'
              };

              const statusLabel = {
                disetujui: 'Disetujui',
                pending: 'Pending',
                ditolak: 'Ditolak'
              };

              const statusColor = statusColors[logbook.status_verifikasi as keyof typeof statusColors] || statusColors.pending;
              const label = statusLabel[logbook.status_verifikasi as keyof typeof statusLabel] || 'Pending';

              return (
                <div key={index} className="p-4 bg-white rounded-lg shadow-sm border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1">
                      <Avatar>
                        <AvatarFallback className="bg-[#ad46ff] text-white">
                          <BookOpen className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 line-clamp-2">{logbook.kegiatan}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {new Date(logbook.tanggal).toLocaleDateString('id-ID')}
                          </p>
                          {logbook.magang?.siswa && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <p className="text-xs text-gray-500">
                                {logbook.magang.siswa.nama}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge className={statusColor}>
                      {label}
                    </Badge>
                  </div>
                  {logbook.kendala && (
                    <p className="text-sm text-purple-600 ml-12 line-clamp-1">
                      Kendala: {logbook.kendala}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}