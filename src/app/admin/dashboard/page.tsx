// File: src/app/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Users, Building2, BookOpen, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';

// Types
interface Stats {
  totalSiswa: number;
  totalDudi: number;
  siswaAktifMagang: number;
  logbookHariIni: number;
}

interface Internship {
  id: number;
  student: string;
  company: string;
  date: string;
  status: string;
}

interface ActiveDudi {
  id: number;
  name: string;
  address: string;
  phone: string;
  students: number;
}

interface Logbook {
  id: number;
  title: string;
  date: string;
  status: string;
  detail: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalSiswa: 0,
    totalDudi: 0,
    siswaAktifMagang: 0,
    logbookHariIni: 0,
  });
  const [internships, setInternships] = useState<Internship[]>([]);
  const [activeDUDI, setActiveDUDI] = useState<ActiveDudi[]>([]);
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      // Fetch stats
      await fetchStats();
      
      // Fetch latest internships
      await fetchLatestInternships();
      
      // Fetch active DUDI
      await fetchActiveDUDI();
      
      // Fetch latest logbooks
      await fetchLatestLogbooks();
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      // Total Siswa
      const { count: totalSiswa } = await supabase
        .from('siswa')
        .select('*', { count: 'exact', head: true });

      // Total DUDI
      const { count: totalDudi } = await supabase
        .from('dudi')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aktif');

      // Siswa Aktif Magang
      const { count: siswaAktifMagang } = await supabase
        .from('magang')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aktif');

      // Logbook Hari Ini
      const today = new Date().toISOString().split('T')[0];
      const { count: logbookHariIni } = await supabase
        .from('logbook')
        .select('*', { count: 'exact', head: true })
        .eq('tanggal', today);

      setStats({
        totalSiswa: totalSiswa || 0,
        totalDudi: totalDudi || 0,
        siswaAktifMagang: siswaAktifMagang || 0,
        logbookHariIni: logbookHariIni || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  async function fetchLatestInternships() {
    try {
      const { data, error } = await supabase
        .from('magang')
        .select(`
          id,
          status,
          tanggal_mulai,
          tanggal_selesai,
          siswa:siswa_id (nama),
          dudi:dudi_id (nama_perusahaan)
        `)
        .eq('status', 'aktif')
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) throw error;

      const formattedData: Internship[] = (data || []).map((item: any) => ({
        id: item.id,
        student: item.siswa?.nama || 'N/A',
        company: item.dudi?.nama_perusahaan || 'N/A',
        date: `${formatDate(item.tanggal_mulai)} - ${formatDate(item.tanggal_selesai)}`,
        status: item.status === 'aktif' ? 'Aktif' : item.status,
      }));

      setInternships(formattedData);
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  }

  async function fetchActiveDUDI() {
    try {
      const { data, error } = await supabase
        .from('dudi')
        .select(`
          id,
          nama_perusahaan,
          alamat,
          telepon,
          magang (count)
        `)
        .eq('status', 'aktif')
        .limit(3);

      if (error) throw error;

      const formattedData: ActiveDudi[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.nama_perusahaan,
        address: item.alamat || 'Alamat tidak tersedia',
        phone: item.telepon || 'Telepon tidak tersedia',
        students: item.magang?.[0]?.count || 0,
      }));

      setActiveDUDI(formattedData);
    } catch (error) {
      console.error('Error fetching DUDI:', error);
    }
  }

  async function fetchLatestLogbooks() {
    try {
      const { data, error } = await supabase
        .from('logbook')
        .select(`
          id,
          tanggal,
          kegiatan,
          kendala,
          status_verifikasi
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      const formattedData: Logbook[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.kegiatan,
        date: formatDate(item.tanggal),
        status: getStatusLabel(item.status_verifikasi),
        detail: item.kendala ? `Kendala: ${item.kendala}` : 'Kendala: tidak ada kendala berarti',
      }));

      setLogbooks(formattedData);
    } catch (error) {
      console.error('Error fetching logbooks:', error);
    }
  }

  function formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  }

  function getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'disetujui': 'Disetujui',
      'pending': 'Pending',
      'ditolak': 'Ditolak',
    };
    return statusMap[status] || status;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ad46ff] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    { title: "Total Siswa", value: stats.totalSiswa.toString(), subtitle: "Seluruh siswa terdaftar", icon: Users },
    { title: "DUDI Partner", value: stats.totalDudi.toString(), subtitle: "Perusahaan mitra", icon: Building2 },
    { title: "Siswa Magang", value: stats.siswaAktifMagang.toString(), subtitle: "Sedang aktif magang", icon: Users },
    { title: "Logbook Hari Ini", value: stats.logbookHariIni.toString(), subtitle: "Laporan masuk hari ini", icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Selamat datang di sistem pelaporan magang siswa SMK Negeri 1 Surabaya
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Magang Terbaru */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#ad46ff]" />
              Magang Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {internships.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Tidak ada data magang</p>
            ) : (
              internships.map((internship) => (
                <div key={internship.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#ad46ff] text-white">
                        {internship.student[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{internship.student}</p>
                      <p className="text-sm text-gray-600">{internship.company}</p>
                      <p className="text-xs text-gray-500">{internship.date}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {internship.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* DUDI Aktif */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-[#ad46ff]" />
              DUDI Aktif
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDUDI.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Tidak ada data DUDI</p>
            ) : (
              activeDUDI.map((dudi) => (
                <div key={dudi.id} className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="font-medium text-gray-800 text-sm mb-1">{dudi.name}</p>
                  <div className="text-xs text-gray-600 mb-2 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-[#ad46ff]" />
                    {dudi.address}
                  </div>
                  <div className="text-xs text-gray-600 mb-2 flex items-center">
                    <Phone className="w-3 h-3 mr-1 text-[#ad46ff]" />
                    {dudi.phone}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">Siswa Magang</span>
                    <Badge variant="secondary" className="bg-[#f2e6ff] text-[#ad46ff]">
                      {dudi.students}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

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
            <p className="text-gray-500 text-center py-4">Tidak ada data logbook</p>
          ) : (
            logbooks.map((logbook) => {
              const statusVariant =
                logbook.status === 'Disetujui' ? 'default' :
                logbook.status === 'Pending' ? 'secondary' :
                'destructive';

              return (
                <div key={logbook.id} className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1">
                      <Avatar className="bg-[#ad46ff]">
                        <AvatarFallback className="bg-[#ad46ff] text-white">
                          <BookOpen className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{logbook.title}</p>
                        <p className="text-xs text-gray-500">{logbook.date}</p>
                      </div>
                    </div>
                    <Badge
                      variant={statusVariant}
                      className={
                        logbook.status === 'Disetujui' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                        logbook.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                        'bg-red-100 text-red-700 hover:bg-red-100'
                      }
                    >
                      {logbook.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-purple-600 ml-13">{logbook.detail}</p>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}