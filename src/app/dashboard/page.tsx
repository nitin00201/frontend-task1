'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAgents } from '@/hooks/useAgents';
import { useDistributions } from '@/hooks/useDistributions';
import { Users, Upload, BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { agents, fetchAgents } = useAgents();
  const { distributions, fetchDistributions } = useDistributions();
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalDistributions: 0,
    totalRecords: 0,
  });

  useEffect(() => {
    fetchAgents();
    fetchDistributions();
  }, [fetchAgents, fetchDistributions]);

  useEffect(() => {
    if (agents && distributions) {
      const activeAgents = agents.filter(agent => agent.isActive).length;
      const totalRecords = distributions.reduce((sum, dist) => sum + dist.totalItems, 0);
      
      setStats({
        totalAgents: agents.length,
        activeAgents,
        totalDistributions: distributions.length,
        totalRecords,
      });
    }
  }, [agents, distributions]);

  const statCards = [
    {
      title: 'Total Agents',
      value: stats.totalAgents,
      description: `${stats.activeAgents} active`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Agents',
      value: stats.activeAgents,
      description: 'Available for distribution',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Distributions',
      value: stats.totalDistributions,
      description: 'Files processed',
      icon: Upload,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Records Distributed',
      value: stats.totalRecords,
      description: 'Across all agents',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentDistributions = distributions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your agent management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Distributions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Distributions
            </CardTitle>
            <CardDescription>
              Latest file uploads and distributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDistributions.length > 0 ? (
                recentDistributions.map((distribution) => (
                  <div
                    key={distribution.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {distribution.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Agent: {distribution.agentName}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {distribution.totalItems} records
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(distribution.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Upload className="mx-auto h-8 w-8 mb-2" />
                  <p>No distributions yet</p>
                  <p className="text-xs">Upload a file to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Agent Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Agent Status
            </CardTitle>
            <CardDescription>
              Current status of all agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.length > 0 ? (
                agents.slice(0, 5).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {agent.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {agent.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={agent.isActive ? "default" : "secondary"}>
                        {agent.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {agent.mobile}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Users className="mx-auto h-8 w-8 mb-2" />
                  <p>No agents yet</p>
                  <p className="text-xs">Create agents to start distributing</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => window.location.href = '/dashboard/agents'}>
              <CardContent className="p-4 text-center">
                <Users className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                <p className="font-medium">Manage Agents</p>
                <p className="text-xs text-gray-500">Add, edit, or remove agents</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => window.location.href = '/dashboard/upload'}>
              <CardContent className="p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-green-600 mb-2" />
                <p className="font-medium">Upload File</p>
                <p className="text-xs text-gray-500">Distribute CSV/Excel data</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => window.location.href = '/dashboard/distributions'}>
              <CardContent className="p-4 text-center">
                <BarChart3 className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                <p className="font-medium">View Reports</p>
                <p className="text-xs text-gray-500">Distribution analytics</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}