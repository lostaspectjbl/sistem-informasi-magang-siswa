"use client";

import { useState } from "react";
import {
  BookOpen,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Eye,
} from "lucide-react";

// ⬇ Tambahkan import shadcn UI dialog
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const JurnalHarianMagang = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const journals = [
    {
      id: 1,
      student: "Ahmad Rizki",
      nis: "2024001",
      class: "XII RPL 1",
      date: "1 Mar 2024",
      activity:
        "Membuat desain UI aplikasi kasir menggunakan Figma. Melakukan analisis user experience dan wireframing...",
      obstacle:
        "Kesulitan menentukan skema warna yang tepat dan konsisten untuk seluruh aplikasi",
      status: "Disetujui",
      statusColor: "bg-emerald-100 text-emerald-700",
      teacher: "Bagus, lanjutkan dengan implementasi",
    },
    {
      id: 2,
      student: "Ahmad Rizki",
      nis: "2024001",
      class: "XII RPL 1",
      date: "2 Mar 2024",
      activity:
        "Belajar backend Laravel untuk membangun REST API sistem kasir. Mempelajari konsep MVC dan routing.",
      obstacle:
        "Error saat menjalankan migration database dan kesulitan memahami relationship antar tabel",
      status: "Belum Diverifikasi",
      statusColor: "bg-amber-100 text-amber-700",
      teacher: "Belum ada catatan",
    },
  ];

  const stats = [
    {
      label: "Total Logbook",
      value: "5",
      sublabel: "Laporan harian terdaftar",
      icon: BookOpen,
      iconColor: "text-[#ad46ff]",
      bgColor: "bg-white",
    },
    {
      label: "Belum Diverifikasi",
      value: "2",
      sublabel: "Menunggu verifikasi",
      icon: Clock,
      iconColor: "text-[#ad46ff]",
      bgColor: "bg-white",
    },
    {
      label: "Disetujui",
      value: "2",
      sublabel: "Sudah diverifikasi",
      icon: ThumbsUp,
      iconColor: "text-[#ad46ff]",
      bgColor: "bg-white",
    },
    {
      label: "Ditolak",
      value: "1",
      sublabel: "Perlu perbaikan",
      icon: ThumbsDown,
      iconColor: "text-[#ad46ff]",
      bgColor: "bg-white",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                SMK Negeri 1 Surabaya
              </h1>
              <p className="text-gray-500 text-xs mt-0.5">
                Sistem Manajemen Magang Siswa
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Manajemen Jurnal Harian Magang
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-2.5 rounded-lg`}>
                  <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-xs text-gray-500">{stat.sublabel}</p>
            </div>
          ))}
        </div>

        {/* Journal List Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Table Header */}
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-700">
              <div className="col-span-1"></div>
              <div className="col-span-2">Siswa & Tanggal</div>
              <div className="col-span-5">Kegiatan & Kendala</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Catatan Guru</div>
              <div className="col-span-1 text-center">Aksi</div>
            </div>
          </div>

          {/* Journal Entries */}
          <div className="divide-y divide-gray-200">
            {journals.map((journal) => (
              <div
                key={journal.id}
                className="px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-1"></div>

                  {/* Student */}
                  <div className="col-span-2">
                    <div className="text-sm font-semibold text-gray-900 mb-0.5">
                      {journal.student}
                    </div>
                    <div className="text-xs text-gray-500">NIS: {journal.nis}</div>
                    <div className="text-xs text-gray-500">{journal.class}</div>
                    <div className="text-xs text-gray-500 mt-1.5">
                      {journal.date}
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="col-span-5">
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-gray-900 mb-1">
                        Kegiatan:
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {journal.activity}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-900 mb-1">
                        Kendala:
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {journal.obstacle}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${journal.statusColor}`}
                    >
                      {journal.status}
                    </span>
                  </div>

                  {/* Teacher Notes */}
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">{journal.teacher}</p>
                  </div>

                  {/* Aksi + Dialog */}
                  <div className="col-span-1 flex items-center justify-center">

                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-[#ad46ff]" />
                        </button>
                      </DialogTrigger>

                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">
                            Detail Jurnal Harian
                          </DialogTitle>
                          <DialogDescription>
                            Informasi lengkap jurnal harian siswa.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 space-y-3">
                          <p>
                            <strong>Siswa:</strong> {journal.student}
                          </p>
                          <p>
                            <strong>Tanggal:</strong> {journal.date}
                          </p>
                          <p>
                            <strong>Kegiatan:</strong> <br />
                            {journal.activity}
                          </p>
                          <p>
                            <strong>Kendala:</strong> <br />
                            {journal.obstacle}
                          </p>
                          <p>
                            <strong>Status:</strong> {journal.status}
                          </p>
                          <p>
                            <strong>Catatan Guru:</strong> <br />
                            {journal.teacher}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>

                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default JurnalHarianMagang;
