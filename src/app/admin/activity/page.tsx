'use client';

import { useState } from 'react';
import { Clock, FileText, Plus, Edit, Trash2, Filter, Search, User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ActivityLog {
  id: number;
  action: 'created' | 'updated' | 'deleted';
  entity: string;
  description: string;
  user: string;
  admin: string;
  timestamp: string;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: 1,
      action: 'created',
      entity: 'siswa',
      description: 'Siswa baru "lukman santoso" (12345678987654) ditambahkan',
      user: 'user',
      admin: 'Unknown Admin',
      timestamp: '2026-01-05T13:10:00',
    },
    {
      id: 2,
      action: 'deleted',
      entity: 'siswa',
      description: 'Siswa "lukman santoso" dihapus dari sistem',
      user: 'user',
      admin: 'Unknown Admin',
      timestamp: '2026-01-05T13:10:00',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All Actions');
  const [filterEntity, setFilterEntity] = useState('All Entities');
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Calculate stats
  const totalLogs = logs.length;
  const createdLogs = logs.filter(log => log.action === 'created').length;
  const updatedLogs = logs.filter(log => log.action === 'updated').length;
  const deletedLogs = logs.filter(log => log.action === 'deleted').length;

  const stats = [
    { title: 'Total Logs', value: totalLogs, color: 'text-gray-800' },
    { title: 'Created', value: createdLogs, color: 'text-green-600' },
    { title: 'Updated', value: updatedLogs, color: 'text-blue-600' },
    { title: 'Deleted', value: deletedLogs, color: 'text-red-600' },
  ];

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchAction = filterAction === 'All Actions' || 
      (filterAction === 'Created' && log.action === 'created') ||
      (filterAction === 'Updated' && log.action === 'updated') ||
      (filterAction === 'Deleted' && log.action === 'deleted');

    const matchEntity = filterEntity === 'All Entities' || 
      log.entity.toLowerCase() === filterEntity.toLowerCase();

    return matchSearch && matchAction && matchEntity;
  });

  const handleClearLogs = () => {
    setLogs([]);
    setShowClearDialog(false);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <Plus className="w-5 h-5 text-green-600" />;
      case 'updated':
        return <Edit className="w-5 h-5 text-blue-600" />;
      case 'deleted':
        return <Trash2 className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-50 border-green-200';
      case 'updated':
        return 'bg-blue-50 border-blue-200';
      case 'deleted':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-700';
      case 'updated':
        return 'bg-blue-100 text-blue-700';
      case 'deleted':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Activity Logs</h1>
          <p className="text-gray-600">Riwayat aktivitas admin di sistem</p>
        </div>
        
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <Button
            onClick={() => setShowClearDialog(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Logs
          </Button>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Semua Log?</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus semua activity logs? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowClearDialog(false)}>
                Batal
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleClearLogs}
              >
                Ya, Hapus Semua
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
              <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Actions */}
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Actions">All Actions</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Updated">Updated</SelectItem>
                <SelectItem value="Deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Entities */}
            <Select value={filterEntity} onValueChange={setFilterEntity}>
              <SelectTrigger>
                <SelectValue placeholder="All Entities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Entities">All Entities</SelectItem>
                <SelectItem value="siswa">Siswa</SelectItem>
                <SelectItem value="guru">Guru</SelectItem>
                <SelectItem value="dudi">DUDI</SelectItem>
                <SelectItem value="magang">Magang</SelectItem>
                <SelectItem value="jurnal">Jurnal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-800">Activity Timeline</h2>
            <Badge className="bg-green-100 text-green-700 border-0">
              {filteredLogs.length} logs
            </Badge>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-2">Tidak ada log aktivitas</p>
              <p className="text-gray-400 text-sm">
                {logs.length === 0 
                  ? 'Belum ada aktivitas yang tercatat di sistem'
                  : 'Tidak ada log yang sesuai dengan filter'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${getActionColor(log.action)} transition-all hover:shadow-md`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(log.action)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium mb-2">
                      {log.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      {/* User Badge */}
                      <Badge className="bg-purple-100 text-purple-700 border-0">
                        {log.user}
                      </Badge>

                      {/* Admin */}
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{log.admin}</span>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Badge */}
                  <div className="flex-shrink-0">
                    <Badge className={`${getActionBadgeColor(log.action)} border-0 capitalize`}>
                      {log.action}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}