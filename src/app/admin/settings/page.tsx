'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, Mail, Phone, Globe, User, Fingerprint, 
  MapPin, Edit3, Loader2, Info, Layout, FileText, Printer, Save, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: number;
  nama: string;
  email: string;
  role: string;
  foto_profile: string | null;
  telepon: string | null;
  created_at: string;
}

export default function SettingsPage() {
  // --- STATE DARI KODE AWAL ---
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [form, setForm] = useState({
    nama: '',
    email: '',
    telepon: '',
    alamat: 'Jl. SMEA No.4, Sawahan, Kec. Sawahan, Kota Surabaya, Jawa Timur 60252', // Mock default
    website: 'www.smkn1surabaya.sch.id',
    kepalaSekolah: 'Drs. H. Sutrisno, M.Pd.',
    npsn: '20567890',
  });

  const currentUserId = 1; // Hardcoded sesuai kode awal Anda

  // --- LOGIKA FETCH & HANDLERS DARI KODE AWAL ---
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await (supabase as any)
        .from('users')
        .select('*')
        .eq('id', currentUserId)
        .single();

      if (error) throw error;

      setProfile(data);
      setForm((prev) => ({
        ...prev,
        nama: data.nama || '',
        email: data.email || '',
        telepon: data.telepon || '',
      }));
      setPreviewImage(data.foto_profile);
    } catch (error: any) {
      setError(error.message || 'Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUserId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const { error: updateError } = await (supabase as any)
        .from('users')
        .update({ foto_profile: urlData.publicUrl })
        .eq('id', currentUserId);

      if (updateError) throw updateError;
      alert('Logo berhasil diupdate!');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { error } = await (supabase as any)
        .from('users')
        .update({
          nama: form.nama,
          email: form.email,
          telepon: form.telepon,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUserId);

      if (error) throw error;
      alert('Perubahan berhasil disimpan!');
    } catch (error: any) {
      alert('Gagal menyimpan: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen italic text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat Pengaturan...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto bg-slate-50/50 min-h-screen">
      <h1 className="text-2xl font-bold text-[#1e293b] mb-8">Pengaturan Sekolah</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: FORM EDIT */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-white py-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-500" />
                <CardTitle className="text-md font-semibold text-slate-700">Informasi Sekolah</CardTitle>
              </div>
              <Button 
                type="submit" 
                disabled={saving}
                size="sm" 
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Simpan
              </Button>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Logo Upload */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Printer className="w-3 h-3" /> Logo Sekolah
                </Label>
                <div className="relative w-16 h-16 border rounded-lg overflow-hidden bg-slate-50 group cursor-pointer">
                  {uploading ? (
                    <div className="flex items-center justify-center w-full h-full"><Loader2 className="animate-spin" /></div>
                  ) : (
                    <img src={previewImage || "/api/placeholder/64/64"} alt="logo" className="w-full h-full object-cover" />
                  )}
                  <label htmlFor="logo-upload" className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Edit3 className="w-4 h-4 text-white" />
                  </label>
                  <input id="logo-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label className="text-slate-600 flex items-center gap-2">Nama Sekolah</Label>
                  <Input 
                    value={form.nama} 
                    onChange={(e) => setForm({...form, nama: e.target.value})} 
                    className="bg-slate-50/50 border-slate-200" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-600 flex items-center gap-2">Alamat Lengkap</Label>
                  <Textarea 
                    value={form.alamat} 
                    onChange={(e) => setForm({...form, alamat: e.target.value})}
                    className="bg-slate-50/50 border-slate-200 min-h-[80px]" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-600 flex items-center gap-2">Telepon</Label>
                    <Input 
                      value={form.telepon} 
                      onChange={(e) => setForm({...form, telepon: e.target.value})}
                      className="bg-slate-50/50 border-slate-200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 flex items-center gap-2">Email</Label>
                    <Input 
                      value={form.email} 
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      className="bg-slate-50/50 border-slate-200" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-600 flex items-center gap-2">Website</Label>
                  <Input 
                    value={form.website} 
                    onChange={(e) => setForm({...form, website: e.target.value})}
                    className="bg-slate-50/50 border-slate-200" 
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-400 mt-4 italic">
                Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: PREVIEW (Dinamis dari state Form) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 text-slate-700 px-1">
            <Layout className="w-4 h-4 text-indigo-500" />
            <div className="flex flex-col">
              <span className="font-bold text-sm">Preview Tampilan</span>
              <span className="text-[11px] text-slate-500">Pratinjau otomatis saat data diubah</span>
            </div>
          </div>

          {/* Dashboard Header Preview */}
          <Card className="border-none shadow-sm">
            <CardHeader className="py-3 bg-white border-b rounded-t-lg">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-2">
                <Layout className="w-3 h-3" /> Dashboard Header
              </span>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 p-3 bg-purple-50/40 border border-purple-100 rounded-xl">
                <div className="w-10 h-10 rounded bg-white border p-1 overflow-hidden">
                  <img src={previewImage || "/api/placeholder/40/40"} alt="logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 leading-tight">{form.nama || 'Nama Sekolah'}</h4>
                  <p className="text-[11px] text-slate-500">Sistem Informasi Magang</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Header Preview */}
          <Card className="border-none shadow-sm">
            <CardHeader className="py-3 bg-white border-b rounded-t-lg">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-2">
                <FileText className="w-3 h-3 text-green-500" /> Header Rapor / Sertifikat
              </span>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border border-slate-100 rounded-lg p-4 bg-white text-center space-y-2">
                 <div className="flex justify-center mb-1">
                   <img src={previewImage || "/api/placeholder/50/50"} alt="smk" className="w-10 h-10 object-contain grayscale opacity-70" />
                 </div>
                 <h3 className="text-sm font-extrabold uppercase">{form.nama || 'NAMA SEKOLAH'}</h3>
                 <p className="text-[9px] text-slate-500 max-w-[280px] mx-auto uppercase">{form.alamat}</p>
                 <div className="text-[8px] text-slate-400 flex justify-center gap-4">
                    <span>Telp: {form.telepon}</span>
                    <span>Email: {form.email}</span>
                 </div>
                 <div className="border-b-2 border-slate-900 pt-2 mb-2 w-full"></div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-800 pt-2 block">SERTIFIKAT MAGANG</span>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 space-y-3">
             <h5 className="text-xs font-bold text-indigo-900">Informasi Penggunaan:</h5>
             <p className="text-[11px] text-indigo-800">Perubahan pada form kiri akan langsung merubah tampilan dokumen cetak dan dashboard secara otomatis.</p>
          </div>
        </div>
      </form>
    </div>
  );
}