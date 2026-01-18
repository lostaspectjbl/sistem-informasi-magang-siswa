'use client';

import { useState, useEffect } from 'react';
import { Clock, FileText, Plus, Edit, Trash2, Filter, Search, User, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { supabase } from '@/lib/supabase';

interface ActivityLog {
  id: number;
  user_id: number | null;
  action: string | null;
  entity: string | null;
  description: string | null;
  created_at: string;
  users?: {
    nama: string;
    role: string;
  };
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All Actions');
  const [filterEntity, setFilterEntity] = useState('All Entities');
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Fetch activity logs dari Supabase
  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await (supabase as any)
        .from('activity_log')
        .select(`
          *,
          users (
            nama,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLogs(data || []);
    } catch (error: any) {
      setError(error.message || 'Gagal memuat activity logs');
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      const { error } = await (supabase as any)
        .from('activity_log')
        .delete()
        .neq('id', 0); // Delete all records

      if (error) throw error;

      alert('Semua log berhasil dihapus!');
      setLogs([]);
      setShowClearDialog(false);
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Gagal menghapus logs'));
      console.error('Error clearing logs:', error);
    }
  };

  // Calculate stats
  const totalLogs = logs.length;
  const createdLogs = logs.filter(log => log.action?.toLowerCase().includes('create')).length;
  const updatedLogs = logs.filter(log => log.action?.toLowerCase().includes('update')).length;
  const deletedLogs = logs.filter(log => log.action?.toLowerCase().includes('delete')).length;

  const stats = [
    { title: 'Total Logs', value: totalLogs, color: 'text-gray-800' },
    { title: 'Created', value: createdLogs, color: 'text-green-600' },
    { title: 'Updated', value: updatedLogs, color: 'text-blue-600' },
    { title: 'Deleted', value: deletedLogs, color: 'text-red-600' },
  ];

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchSearch = log.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchAction = filterAction === 'All Actions' || 
      (filterAction === 'Created' && log.action?.toLowerCase().includes('create')) ||
      (filterAction === 'Updated' && log.action?.toLowerCase().includes('update')) ||
      (filterAction === 'Deleted' && log.action?.toLowerCase().includes('delete'));

    const matchEntity = filterEntity === 'All Entities' || 
      log.entity?.toLowerCase() === filterEntity.toLowerCase();

    return matchSearch && matchAction && matchEntity;
  });

  const getActionIcon = (action: string | null) => {
    if (!action) return <FileText className="w-5 h-5 text-gray-600" />;
    
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) {
      return <Plus className="w-5 h-5 text-green-600" />;
    } else if (actionLower.includes('update')) {
      return <Edit className="w-5 h-5 text-blue-600" />;
    } else if (actionLower.includes('delete')) {
      return <Trash2 className="w-5 h-5 text-red-600" />;
    }
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const getActionColor = (action: string | null) => {
    if (!action) return 'bg-gray-50 border-gray-200';
    
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) {
      return 'bg-green-50 border-green-200';
    } else if (actionLower.includes('update')) {
      return 'bg-blue-50 border-blue-200';
    } else if (actionLower.includes('delete')) {
      return 'bg-red-50 border-red-200';
    }
    return 'bg-gray-50 border-gray-200';
  };

  const getActionBadgeColor = (action: string | null) => {
    if (!action) return 'bg-gray-100 text-gray-700';
    
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) {
      return 'bg-green-100 text-green-700';
    } else if (actionLower.includes('update')) {
      return 'bg-blue-100 text-blue-700';
    } else if (actionLower.includes('delete')) {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-gray-100 text-gray-700';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

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
            disabled={logs.length === 0}
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
                <SelectItem value="logbook">Logbook</SelectItem>
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
                      {log.description || 'No description'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      {/* Entity Badge */}
                      {log.entity && (
                        <Badge className="bg-purple-100 text-purple-700 border-0 capitalize">
                          {log.entity}
                        </Badge>
                      )}

                      {/* User */}
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{log.users?.nama || 'Unknown User'}</span>
                      </div>

                      {/* Role */}
                      {log.users?.role && (
                        <Badge className="bg-blue-100 text-blue-700 border-0 capitalize text-xs">
                          {log.users.role}
                        </Badge>
                      )}

                      {/* Timestamp */}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatTimestamp(log.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Badge */}
                  <div className="flex-shrink-0">
                    <Badge className={`${getActionBadgeColor(log.action)} border-0 capitalize`}>
                      {log.action || 'Unknown'}
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