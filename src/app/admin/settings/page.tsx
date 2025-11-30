// File: src/app/admin/settings/page.tsx
"use client";

import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  ImagePlus,
  Save,
  Download,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PRIMARY = "text-[#ad46ff]";
const PRIMARY_BG = "bg-[#ad46ff]";
const PRIMARY_BG_HOVER = "hover:bg-[#9c28ff]";
const PRIMARY_BORDER = "border-[#ad46ff]";

interface SchoolInfo {
  name: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principal: string;
  motto: string;
}

export default function SettingsPage() {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
    name: "SMK Plus Almaarif Singosari",
    npsn: "20564088",
    address:
      "Jl. Tunggul Ametung No.99, Candirenggo, Kec. Singosari, Kabupaten Malang, Jawa Timur",
    phone: "031-5678901",
    email: "smkplusam_sgs@yahoo.com",
    website: "https://www.smkplusam.sch.id",
    principal: "Toni Kuswinarto S.t",
    motto: "KECE (Kompeten, Energik, Cakap, Elegan)",
  });

  const [certificate, setCertificate] = useState({
    template: "default",
    showLogo: true,
    showSignature: true,
  });

  const [notification, setNotification] = useState({
    emailNotif: true,
    logbookReminder: true,
    weeklyReport: false,
    documentExpiry: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSchoolInfoChange = (field: keyof SchoolInfo, value: string) => {
    setSchoolInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Pengaturan Sekolah
        </h1>
        <p className="text-gray-600">Konfigurasi informasi dan sistem sekolah</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* SCHOOL INFO */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Building2 className={`w-5 h-5 mr-2 ${PRIMARY}`} />
                  Informasi Sekolah
                </CardTitle>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  Nama Sekolah
                </Label>
                <Input
                  id="name"
                  value={schoolInfo.name}
                  onChange={(e) =>
                    handleSchoolInfoChange("name", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Logo Sekolah</Label>

                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:${PRIMARY_BORDER}`}
                  >
                    <ImagePlus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Klik untuk upload logo
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG (Max. 2MB)</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="npsn">NPSN</Label>
                  <Input
                    id="npsn"
                    value={schoolInfo.npsn}
                    onChange={(e) =>
                      handleSchoolInfoChange("npsn", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address" className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Alamat Lengkap
                </Label>
                <Textarea
                  id="address"
                  rows={3}
                  value={schoolInfo.address}
                  onChange={(e) =>
                    handleSchoolInfoChange("address", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Telepon
                  </Label>
                  <Input
                    id="phone"
                    value={schoolInfo.phone}
                    onChange={(e) =>
                      handleSchoolInfoChange("phone", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={schoolInfo.email}
                    onChange={(e) =>
                      handleSchoolInfoChange("email", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={schoolInfo.website}
                  onChange={(e) =>
                    handleSchoolInfoChange("website", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="principal">Kepala Sekolah</Label>
                <Input
                  id="principal"
                  value={schoolInfo.principal}
                  onChange={(e) =>
                    handleSchoolInfoChange("principal", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="motto">Motto Sekolah</Label>
                <Input
                  id="motto"
                  value={schoolInfo.motto}
                  onChange={(e) =>
                    handleSchoolInfoChange("motto", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* CERTIFICATE */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className={`w-5 h-5 mr-2 ${PRIMARY}`} />
                Sertifikat Magang
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>Template Sertifikat</Label>

                <Select
                  value={certificate.template}
                  onValueChange={(value) =>
                    setCertificate({ ...certificate, template: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="default">Template Default</SelectItem>
                    <SelectItem value="formal">Template Formal</SelectItem>
                    <SelectItem value="modern">Template Modern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showLogo">Tampilkan Logo Sekolah</Label>

                  <Switch
                    id="showLogo"
                    checked={certificate.showLogo}
                    onCheckedChange={(checked) =>
                      setCertificate({ ...certificate, showLogo: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showSignature">
                    Tampilkan Tanda Tangan Digital
                  </Label>

                  <Switch
                    id="showSignature"
                    checked={certificate.showSignature}
                    onCheckedChange={(checked) =>
                      setCertificate({ ...certificate, showSignature: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NOTIFICATION */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className={`w-5 h-5 mr-2 ${PRIMARY}`} />
                Notifikasi
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {[
                ["emailNotif", "Notifikasi Email"],
                ["logbookReminder", "Pengingat Logbook Harian"],
                ["weeklyReport", "Laporan Mingguan"],
                ["documentExpiry", "Peringatan Dokumen Kadaluarsa"],
              ].map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <Label>{label}</Label>

                  <Switch
                    checked={(notification as any)[key]}
                    onCheckedChange={(checked) =>
                      setNotification({
                        ...notification,
                        [key]: checked,
                      })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* PREVIEW CARD */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Preview Tampilan</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="bg-gradient-to-br from-[#f3d4ff] to-[#e6b1ff] rounded-lg p-6 text-center border-2 border-[#e4b5ff]">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarFallback className={`${PRIMARY_BG} text-white`}>
                    <Building2 className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>

                <h4 className="font-bold text-gray-800 mb-1">
                  {schoolInfo.name}
                </h4>

                <p className="text-xs text-gray-600 mb-3">
                  {schoolInfo.motto}
                </p>

                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center justify-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>Singosari</span>
                  </div>

                  <div className="flex items-center justify-center">
                    <Phone className="w-3 h-3 mr-1" />
                    <span>{schoolInfo.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HEADER PREVIEW */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Header Rapor/Sertifikat</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="border-2 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar>
                    <AvatarFallback className={`${PRIMARY_BG} text-white`}>
                      <Building2 className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h5 className="font-bold text-sm text-gray-800">
                      {schoolInfo.name}
                    </h5>
                    <p className="text-xs text-gray-600">
                      NPSN: {schoolInfo.npsn}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1 border-t pt-3">
                  <div className="flex items-start">
                    <MapPin className="w-3 h-3 mr-2 mt-0.5" />
                    <span>Jl. Tunggul Ametung No.99, Candirenggo, Kec. Singosari, Kabupaten Malang, Jawa Timur</span>
                  </div>

                  <div>
                    <Phone className="w-3 h-3 inline mr-1" />
                    Telp: {schoolInfo.phone}
                  </div>

                  <div>
                    <Mail className="w-3 h-3 inline mr-1" />
                    {schoolInfo.email}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t text-center">
                  <p className="text-xs font-semibold text-gray-700">
                    SERTIFIKAT MAGANG
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DOCUMENT ACTIONS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Dokumen Cetak</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button className={`w-full bg-green-500 hover:bg-green-600`}>
                <Download className="w-4 h-4 mr-2" />
                Rapor/Sertifikat
              </Button>

              <Button
                className={`w-full ${PRIMARY_BG} ${PRIMARY_BG_HOVER} text-white`}
              >
                <Download className="w-4 h-4 mr-2" />
                Dokumen Cetak
              </Button>
            </CardContent>
          </Card>

          {/* INFO */}
          <Alert className="bg-[#f3d4ff] border-[#e4b5ff]">
            <AlertDescription className="text-xs text-[#7b2fb8]">
              <h4 className="font-semibold mb-2">Informasi Penggunaan:</h4>
              <ul className="space-y-1">
                <li>📘 <strong>Dashboard:</strong> Logo di header</li>
                <li>📋 <strong>Rapor:</strong> Info lengkap sekolah</li>
                <li>🔔 <strong>Dokumen:</strong> Atur tampilan</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="outline">Reset</Button>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={`${PRIMARY_BG} text-white ${PRIMARY_BG_HOVER}`}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      {saveSuccess && (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Pengaturan berhasil disimpan!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
