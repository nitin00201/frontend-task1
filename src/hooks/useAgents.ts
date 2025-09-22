'use client';

import { useState, useCallback } from 'react';
import { Agent, CreateAgentRequest, UpdateAgentRequest, AgentQueryParams } from '@/types';
import { agentApi } from '@/services/api';

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchAgents = useCallback(async (params: AgentQueryParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await agentApi.getAll(params);
      setAgents(response.agents);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch agents');
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAgent = useCallback(async (agentData: CreateAgentRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await agentApi.create(agentData);
      setAgents(prev => [response.agent, ...prev]);
      return response.agent;
    } catch (err: any) {
      setError(err.message || 'Failed to create agent');
      console.error('Error creating agent:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAgent = useCallback(async (id: string, agentData: UpdateAgentRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await agentApi.update(id, agentData);
      setAgents(prev => prev.map(agent => agent.id === id ? response.agent : agent));
      return response.agent;
    } catch (err: any) {
      setError(err.message || 'Failed to update agent');
      console.error('Error updating agent:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAgent = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await agentApi.delete(id);
      setAgents(prev => prev.filter(agent => agent.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete agent');
      console.error('Error deleting agent:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getActiveAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await agentApi.getActive();
      return response.agents;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch active agents');
      console.error('Error fetching active agents:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    agents,
    loading,
    error,
    pagination,
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    getActiveAgents,
  };
};