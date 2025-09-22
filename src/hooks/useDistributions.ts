'use client';

import { useState, useCallback } from 'react';
import { Distribution, DistributionQueryParams, UploadResponse } from '@/types';
import { distributionApi } from '@/services/api';

export const useDistributions = () => {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchDistributions = useCallback(async (params: DistributionQueryParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await distributionApi.getAll(params);
      setDistributions(response.distributions);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch distributions');
      console.error('Error fetching distributions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDistributionById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await distributionApi.getById(id);
      return response.distribution;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch distribution');
      console.error('Error fetching distribution:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDistribution = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await distributionApi.delete(id);
      setDistributions(prev => prev.filter(dist => dist.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete distribution');
      console.error('Error deleting distribution:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    distributions,
    loading,
    error,
    pagination,
    fetchDistributions,
    getDistributionById,
    deleteDistribution,
  };
};

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    try {
      setUploading(true);
      setError(null);
      setResult(null);
      
      const response = await distributionApi.upload(file);
      setResult(response);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      console.error('Error uploading file:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const resetUpload = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return {
    uploading,
    error,
    result,
    uploadFile,
    resetUpload,
  };
};