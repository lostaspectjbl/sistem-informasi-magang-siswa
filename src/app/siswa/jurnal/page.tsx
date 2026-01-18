'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, FileText, CheckCircle, Clock, XCircle, Eye, Edit, Trash2, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types';

// Tipe dari database
type LogbookRow = Database['public']['Tables']['logbook']['Row'];
type LogbookInsert = Database['public']['Tables']['logbook']['Insert'];
type LogbookUpdate = Database['public']['Tables']['logbook']['Update'];

export default function JurnalPage() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [jurnalList, setJurnalList] = useState<LogbookRow[]>([]);
  const [magangId, setMagangId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [showDialog, setShowDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingJurnal, setViewingJurnal] = useState<LogbookRow | null>(null);
  
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kegiatan: '',
    kendala: '',
  });

  const currentSiswaEmail = "siti.siswa@sekolah.id";

  // --- 1. Fetch Data ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Ambil data siswa & magang aktif
      const { data: siswaData, error: sErr } = await supabase
        .from('siswa')
        .select('id, magang(id)')
        .eq('email', currentSiswaEmail)
        .single();

      if (sErr) throw sErr;
      if (!siswaData) throw new Error("Data siswa tidak ditemukan");

      // Type assertion untuk menghindari error 'never'
      const siswaWithMagang = siswaData as any;
      const activeMagang = siswaWithMagang?.magang?.[0];
      
      if (!activeMagang) {
        setError("Anda belum terdaftar di program magang aktif.");
        setLoading(false);
        return;
      }

      setMagangId(activeMagang.id);

      // Ambil Logbook
      const { data: logbookData, error: lErr } = await supabase
        .from('logbook')
        .select('*')
        .eq('magang_id', activeMagang.id)
        .order('tanggal', { ascending: false });

      if (lErr) throw lErr;
      setJurnalList((logbookData as any) || []);

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- 2. CRUD Operations ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magangId) return;

    try {
      setActionLoading(true);
      
      if (editingId) {
        // UPDATE
        const updatePayload: any = {
          tanggal: form.tanggal,
          kegiatan: form.kegiatan,
          kendala: form.kendala || null,
          updated_at: new Date().toISOString()
        };

        const { error: upErr } = await supabase
          .from('logbook')
          .update(updatePayload as never)
          .eq('id', editingId);
        
        if (upErr) throw upErr;
      } else {
        // INSERT
        const insertPayload: any = {
          magang_id: magangId,
          tanggal: form.tanggal,
          kegiatan: form.kegiatan,
          kendala: form.kendala || null,
          status_verifikasi: 'pending'
        };

        const { error: inErr } = await supabase
          .from('logbook')
          .insert(insertPayload as any);
        
        if (inErr) throw inErr;
      }

      setShowDialog(false);
      setForm({ tanggal: new Date().toISOString().split('T')[0], kegiatan: '', kendala: '' });
      setEditingId(null);
      await fetchData(); 

    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus jurnal ini?')) return;
    try {
      const { error: delErr } = await supabase
        .from('logbook')
        .delete()
        .eq('id', id);
        
      if (delErr) throw delErr;
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- UI Helpers ---
  const filteredJurnal = jurnalList.filter(j => 
    j.kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.kendala?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusInfo = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'disetujui': return { color: 'bg-green-100 text-green-700', label: 'Disetujui' };
      case 'pending': return { color: 'bg-yellow-100 text-yellow-700', label: 'Menunggu' };
      case 'ditolak': return { color: 'bg-red-100 text-red-700', label: 'Ditolak' };
      default: return { color: 'bg-gray-100 text-gray-700', label: 'Pending' };
    }
  };

  const stats = {
    total: jurnalList.length,
    disetujui: jurnalList.filter(j => j.status_verifikasi === 'disetujui').length,
    pending: jurnalList.filter(j => j.status_verifikasi === 'pending').length,
    ditolak: jurnalList.filter(j => j.status_verifikasi === 'ditolak').length,
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 className="animate-spin text-purple-600 h-10 w-10" />
      <p className="text-gray-500 animate-pulse">Memuat data jurnal...</p>
    </div>
  );

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Jurnal Harian Magang</h1>
        <Button 
          onClick={() => {
            setEditingId(null);
            setForm({ tanggal: new Date().toISOString().split('T')[0], kegiatan: '', kendala: '' });
            setShowDialog(true);
          }}
          className="bg-[#ad46ff] hover:bg-[#9b36f0] text-white w-full sm:w-auto"
          disabled={!magangId}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Jurnal
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Jurnal', val: stats.total, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
          { title: 'Disetujui', val: stats.disetujui, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Menunggu', val: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { title: 'Ditolak', val: stats.ditolak, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={`${s.bg} p-2 rounded-lg`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
              <span className="text-xs font-semibold text-gray-500 uppercase">{s.title}</span>
            </div>
            <p className="text-2xl font-black text-gray-800">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Cari jurnal..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Tanggal</th>
                <th className="px-6 py-4 text-left">Kegiatan & Kendala</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredJurnal.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">Data tidak ditemukan</td>
                </tr>
              ) : (
                filteredJurnal.map((log) => {
                  const statusInfo = getStatusInfo(log.status_verifikasi);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-600">
                        {new Date(log.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <p className="font-bold text-gray-800 line-clamp-1">{log.kegiatan}</p>
                        <p className="text-gray-500 text-xs line-clamp-1 italic mt-1">Kendala: {log.kendala || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${statusInfo.color} border-none font-bold shadow-none`}>
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => { setViewingJurnal(log); setShowDetailDialog(true); }} className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            disabled={log.status_verifikasi === 'disetujui'}
                            onClick={() => {
                              setEditingId(log.id);
                              setForm({ tanggal: log.tanggal, kegiatan: log.kegiatan, kendala: log.kendala || '' });
                              setShowDialog(true);
                            }} 
                            className="h-8 w-8 text-amber-600 hover:bg-amber-50 disabled:opacity-30"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(log.id)} className="h-8 w-8 text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Tambah/Edit */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Jurnal' : 'Tambah Jurnal Baru'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Tanggal</Label>
                <Input type="date" value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Kegiatan</Label>
                <Textarea placeholder="Apa yang Anda kerjakan hari ini?" value={form.kegiatan} onChange={e => setForm({...form, kegiatan: e.target.value})} rows={4} required />
              </div>
              <div className="space-y-2">
                <Label>Kendala</Label>
                <Textarea placeholder="Kendala yang dihadapi (jika ada)" value={form.kendala} onChange={e => setForm({...form, kendala: e.target.value})} rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Batal</Button>
              <Button type="submit" disabled={actionLoading} className="bg-purple-600 text-white hover:bg-purple-700">
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? 'Simpan Perubahan' : 'Kirim Jurnal'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Detail */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detail Jurnal</DialogTitle></DialogHeader>
          {viewingJurnal && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4">
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px]">Tanggal</p>
                  <p className="font-semibold">{new Date(viewingJurnal.tanggal).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px]">Status</p>
                  <Badge className={getStatusInfo(viewingJurnal.status_verifikasi).color}>
                    {getStatusInfo(viewingJurnal.status_verifikasi).label}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">Kegiatan</p>
                <p className="text-gray-700">{viewingJurnal.kegiatan}</p>
              </div>
              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">Kendala</p>
                <p className="text-gray-700">{viewingJurnal.kendala || '-'}</p>
              </div>
              {viewingJurnal.catatan_guru && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-blue-800 font-bold text-xs uppercase mb-1">Feedback Guru</p>
                  <p className="text-blue-700 italic text-sm">"{viewingJurnal.catatan_guru}"</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}