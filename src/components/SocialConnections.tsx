import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  socialConnectionsService,
  Connection,
  ConnectionType,
  BlockedUser,
  MutedUser,
} from '../services/socialConnectionsService';

interface SocialConnectionsProps {
  userId: string;
}

export const SocialConnections: React.FC<SocialConnectionsProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'connections' | 'requests' | 'blocked' | 'muted'>('connections');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionType, setConnectionType] = useState<ConnectionType>('friend');
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [mutedUsers, setMutedUsers] = useState<MutedUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [userId, activeTab, connectionType]);

  const loadData = async () => {
    setLoading(true);
    try {
      let data;
      let blockedData;
      let mutedData;

      switch (activeTab) {
        case 'connections':
          data = await socialConnectionsService.getConnections(userId, connectionType);
          setConnections(data);
          break;
        case 'blocked':
          blockedData = await socialConnectionsService.getBlockedUsers(userId);
          setBlockedUsers(blockedData);
          break;
        case 'muted':
          mutedData = await socialConnectionsService.getMutedUsers(userId);
          setMutedUsers(mutedData);
          break;
      }
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveConnection = async (connectionId: string) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) return;

    try {
      await socialConnectionsService.removeConnection(userId, connectionId);
      setConnections(connections.filter(c => c.id !== connectionId));
      toast.success('Connection removed successfully');
    } catch (error) {
      toast.error('Failed to remove connection');
      console.error(error);
    }
  };

  const handleRespondToRequest = async (connectionId: string, accept: boolean) => {
    try {
      await socialConnectionsService.respondToRequest(userId, connectionId, accept);
      await loadData();
      toast.success(`Request ${accept ? 'accepted' : 'rejected'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${accept ? 'accept' : 'reject'} request`);
      console.error(error);
    }
  };

  const handleUnblockUser = async (targetUserId: string) => {
    try {
      await socialConnectionsService.unblockUser(userId, targetUserId);
      setBlockedUsers(blockedUsers.filter(b => b.targetUserId !== targetUserId));
      toast.success('User unblocked successfully');
    } catch (error) {
      toast.error('Failed to unblock user');
      console.error(error);
    }
  };

  const handleUnmuteUser = async (targetUserId: string) => {
    try {
      await socialConnectionsService.unmuteUser(userId, targetUserId);
      setMutedUsers(mutedUsers.filter(m => m.targetUserId !== targetUserId));
      toast.success('User unmuted successfully');
    } catch (error) {
      toast.error('Failed to unmute user');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['connections', 'requests', 'blocked', 'muted'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'connections' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setConnectionType('friend')}
                className={`px-4 py-2 rounded-md ${
                  connectionType === 'friend'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Friends
              </button>
              <button
                onClick={() => setConnectionType('follow')}
                className={`px-4 py-2 rounded-md ${
                  connectionType === 'follow'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Following
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {connection.targetUserId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Connected since {connection.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveConnection(connection.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 gap-4">
          {connections
            .filter((connection) => connection.status === 'pending')
            .map((request) => (
              <div
                key={request.id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {request.targetUserId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Requested to {request.type} • {request.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRespondToRequest(request.id, true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespondToRequest(request.id, false)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {activeTab === 'blocked' && (
        <div className="grid grid-cols-1 gap-4">
          {blockedUsers.map((blocked) => (
            <div
              key={blocked.targetUserId}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {blocked.targetUserId}
                </h3>
                <p className="text-sm text-gray-500">
                  Blocked since {blocked.createdAt.toLocaleDateString()}
                  {blocked.reason && ` • ${blocked.reason}`}
                </p>
              </div>
              <button
                onClick={() => handleUnblockUser(blocked.targetUserId)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'muted' && (
        <div className="grid grid-cols-1 gap-4">
          {mutedUsers.map((muted) => (
            <div
              key={muted.targetUserId}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {muted.targetUserId}
                </h3>
                <p className="text-sm text-gray-500">
                  Muted since {muted.createdAt.toLocaleDateString()}
                  {muted.expiresAt && ` • Until ${muted.expiresAt.toLocaleDateString()}`}
                </p>
              </div>
              <button
                onClick={() => handleUnmuteUser(muted.targetUserId)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Unmute
              </button>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
}; 