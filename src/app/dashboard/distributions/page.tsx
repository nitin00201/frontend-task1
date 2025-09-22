'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { 
  BarChart3, 
  Search, 
  Eye, 
  Trash2, 
  Download, 
  FileText, 
  Users, 
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useDistributions } from '@/hooks/useDistributions';
import { Distribution, DistributionQueryParams } from '@/types';

export default function DistributionsPage() {
  const { distributions, loading, error, pagination, fetchDistributions, getDistributionById, deleteDistribution } = useDistributions();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedDistribution, setSelectedDistribution] = useState<Distribution | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const params: DistributionQueryParams = { page };
    // Note: Backend doesn't support search for distributions yet
    fetchDistributions(params);
  }, [fetchDistributions, page]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Filter locally since backend doesn't support search yet
  };

  const handleViewDetails = async (distribution: Distribution) => {
    setDetailsLoading(true);
    try {
      const fullDistribution = await getDistributionById(distribution.id);
      setSelectedDistribution(fullDistribution);
      setShowDetailsDialog(true);
    } catch (error) {
      alert('Failed to load distribution details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDeleteDistribution = async (distribution: Distribution) => {
    if (window.confirm(`Are you sure you want to delete the distribution "${distribution.fileName}" for ${distribution.agentName}?`)) {
      try {
        await deleteDistribution(distribution.id);
      } catch (err: any) {
        alert('Failed to delete distribution: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const exportDistributionData = (distribution: Distribution) => {
    if (!distribution.items || distribution.items.length === 0) {
      alert('No data to export');
      return;
    }

    const csvContent = [
      'FirstName,Phone,Notes',
      ...distribution.items.map(item => 
        `"${item.firstName}","${item.phone}","${item.notes || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${distribution.agentName}_${distribution.fileName}_distribution.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const totalRecords = distributions.reduce((sum, dist) => sum + dist.totalItems, 0);
  const uniqueFiles = new Set(distributions.map(d => d.fileName)).size;
  const uniqueAgents = new Set(distributions.map(d => d.agentId)).size;

  // Filter distributions locally based on search term
  const filteredDistributions = distributions.filter(dist => 
    dist.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dist.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dist.agentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Distributions</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage data distributions across agents
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Distributions</p>
                <p className="text-2xl font-bold">{distributions.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-green-600">{totalRecords}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Files Processed</p>
                <p className="text-2xl font-bold text-purple-600">{uniqueFiles}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agents Involved</p>
                <p className="text-2xl font-bold text-orange-600">{uniqueAgents}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distributions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution History</CardTitle>
          <CardDescription>
            All file distributions across agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by file name or agent..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File & Agent</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDistributions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <BarChart3 className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-500">
                            {searchTerm ? 'No distributions match your search' : 'No distributions found'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {searchTerm ? 'Try a different search term' : 'Upload a file to create distributions'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDistributions.map((distribution) => (
                      <TableRow key={distribution.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{distribution.fileName}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {distribution.agentName}
                            </p>
                            <p className="text-xs text-gray-400">{distribution.agentEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold">{distribution.totalItems}</p>
                            <p className="text-xs text-gray-500">records</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            {new Date(distribution.uploadDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Distributed</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(distribution)}
                              disabled={detailsLoading}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => exportDistributionData(distribution)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDistribution(distribution)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalDistributions || 0)} of {pagination.totalDistributions} distributions
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Distribution Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Distribution Details</DialogTitle>
            <DialogDescription>
              Detailed view of distributed data
            </DialogDescription>
          </DialogHeader>
          {selectedDistribution && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">File Name</p>
                  <p className="font-semibold">{selectedDistribution.fileName}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Agent</p>
                  <p className="font-semibold">{selectedDistribution.agentName}</p>
                  <p className="text-sm text-gray-500">{selectedDistribution.agentEmail}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Records</p>
                  <p className="font-semibold">{selectedDistribution.totalItems}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded: {new Date(selectedDistribution.uploadDate).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Data Table */}
              {selectedDistribution.items && selectedDistribution.items.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Distributed Data</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportDistributionData(selectedDistribution)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                  <div className="border rounded-md max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>First Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedDistribution.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.firstName}</TableCell>
                            <TableCell>{item.phone}</TableCell>
                            <TableCell>{item.notes || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => exportDistributionData(selectedDistribution)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}