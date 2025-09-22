'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  BarChart3,
  Download,
  X,
  Loader2
} from 'lucide-react';
import { useFileUpload } from '@/hooks/useDistributions';
import { useAgents } from '@/hooks/useAgents';
import { UploadResponse } from '@/types';

export default function UploadPage() {
  const { uploading, error, result, uploadFile, resetUpload } = useFileUpload();
  const { getActiveAgents } = useAgents();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [activeAgents, setActiveAgents] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchActiveAgents = async () => {
      try {
        const agents = await getActiveAgents();
        setActiveAgents(agents.length);
      } catch (error) {
        console.error('Failed to fetch active agents:', error);
      }
    };

    fetchActiveAgents();
  }, [getActiveAgents]);

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(csv|xlsx|xls)$/i)) {
      alert('Please select a valid CSV or Excel file (.csv, .xlsx, .xls)');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    resetUpload();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    if (activeAgents === 0) {
      alert('No active agents available. Please create and activate agents before uploading.');
      return;
    }

    try {
      await uploadFile(file);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleReset = () => {
    setFile(null);
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload & Distribute</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload CSV or Excel files to distribute data among active agents
        </p>
      </div>

      {/* Active Agents Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Active Agents</p>
                <p className="text-sm text-gray-600">Available for distribution</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{activeAgents}</p>
              <p className="text-xs text-gray-500">
                {activeAgents === 0 ? 'No agents available' : 'Ready to receive data'}
              </p>
            </div>
          </div>
          {activeAgents === 0 && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need at least one active agent to distribute data. 
                <Button variant="link" className="p-0 ml-1 h-auto" onClick={() => window.location.href = '/dashboard/agents'}>
                  Create agents here
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>
            Upload CSV or Excel files containing FirstName, Phone, and Notes columns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Upload className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports CSV, XLSX, and XLS files up to 5MB
                  </p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Select File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Upload Button */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading || activeAgents === 0}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Distribute
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} disabled={uploading}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="font-medium">Processing file...</span>
              </div>
              <Progress value={50} className="w-full" />
              <p className="text-sm text-gray-600">
                Uploading and distributing data among {activeAgents} active agents
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Upload Successful
            </CardTitle>
            <CardDescription>
              File has been processed and distributed among agents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FileText className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">File</p>
                <p className="font-semibold">{result.fileName}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Valid Records</p>
                <p className="font-semibold">{result.validRecords}</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <AlertCircle className="mx-auto h-8 w-8 text-orange-600 mb-2" />
                <p className="text-sm text-gray-600">Invalid Records</p>
                <p className="font-semibold">{result.invalidRecords}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">Agents</p>
                <p className="font-semibold">{result.agentsCount}</p>
              </div>
            </div>

            <Separator />

            {/* Distribution Details */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Distribution Summary
              </h3>
              <div className="space-y-3">
                {result.distributions.map((dist, index) => (
                  <div key={dist.distributionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{dist.agentName}</p>
                      <p className="text-sm text-gray-600">{dist.agentEmail}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {dist.itemsAssigned} records
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {((dist.itemsAssigned / result.validRecords) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Errors */}
            {result.validationErrors && result.validationErrors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  Validation Issues ({result.validationErrors.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {result.validationErrors.slice(0, 10).map((error: any, index: number) => (
                    <div key={index} className="p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                      <p className="font-medium">Row {error.row}:</p>
                      <ul className="list-disc list-inside text-orange-700">
                        {error.errors.map((err: string, i: number) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {result.validationErrors.length > 10 && (
                    <p className="text-sm text-gray-500 text-center">
                      ... and {result.validationErrors.length - 10} more issues
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button onClick={() => window.location.href = '/dashboard/distributions'}>
                <BarChart3 className="mr-2 h-4 w-4" />
                View Distributions
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Upload Another File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Format Help */}
      <Card>
        <CardHeader>
          <CardTitle>File Format Requirements</CardTitle>
          <CardDescription>
            Ensure your file meets these requirements for successful processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Required Columns:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li><strong>FirstName</strong> - Text field (required)</li>
                <li><strong>Phone</strong> - Phone number without special characters (required)</li>
                <li><strong>Notes</strong> - Additional information (optional)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Supported Formats:</h4>
              <div className="flex gap-2">
                <Badge variant="outline">.csv</Badge>
                <Badge variant="outline">.xlsx</Badge>
                <Badge variant="outline">.xls</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">File Limits:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Maximum file size: 5MB</li>
                <li>Data is distributed equally among active agents</li>
                <li>If records don't divide evenly, remainder is distributed sequentially</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}