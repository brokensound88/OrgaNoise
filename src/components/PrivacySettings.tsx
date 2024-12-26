import React, { useState, useEffect } from 'react';
import { privacyService } from '../services/privacyService';
import type { PrivacySettings, ThirdPartyConnection } from '../services/privacyService';
import { toast } from 'react-toastify';

interface PrivacySettingsProps {
  userId: string;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ userId }) => {
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableConnections, setAvailableConnections] = useState<ThirdPartyConnection[]>([]);

  useEffect(() => {
    loadPrivacySettings();
    loadThirdPartyConnections();
  }, [userId]);

  const loadPrivacySettings = async () => {
    try {
      const data = await privacyService.getPrivacySettings(userId);
      setSettings(data);
    } catch (error) {
      toast.error('Failed to load privacy settings');
      console.error(error);
    }
  };

  const loadThirdPartyConnections = async () => {
    try {
      const connections = await privacyService.getThirdPartyConnections(userId);
      setAvailableConnections(connections);
    } catch (error) {
      toast.error('Failed to load third-party connections');
      console.error(error);
    }
  };

  const handleVisibilityChange = async (visibility: 'public' | 'private' | 'connections') => {
    if (!settings) return;

    setLoading(true);
    try {
      const updatedSettings = await privacyService.updatePrivacySettings(userId, {
        profileVisibility: visibility,
      });
      setSettings(updatedSettings);
      toast.success('Privacy settings updated');
    } catch (error) {
      toast.error('Failed to update privacy settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataSharingChange = async (field: keyof PrivacySettings['dataSharing']) => {
    if (!settings) return;

    setLoading(true);
    try {
      const updatedSettings = await privacyService.updatePrivacySettings(userId, {
        dataSharing: {
          ...settings.dataSharing,
          [field]: !settings.dataSharing[field],
        },
      });
      setSettings(updatedSettings);
      toast.success('Data sharing settings updated');
    } catch (error) {
      toast.error('Failed to update data sharing settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleThirdPartyConnection = async (provider: string, connect: boolean) => {
    setLoading(true);
    try {
      if (connect) {
        const connection = availableConnections.find(c => c.provider === provider);
        if (connection) {
          await privacyService.connectThirdParty(userId, connection);
          toast.success(`Connected to ${provider}`);
        }
      } else {
        await privacyService.disconnectThirdParty(userId, provider);
        toast.success(`Disconnected from ${provider}`);
      }
      await loadPrivacySettings();
    } catch (error) {
      toast.error(`Failed to ${connect ? 'connect to' : 'disconnect from'} ${provider}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Profile Visibility</h3>
        <p className="mt-1 text-sm text-gray-500">
          Control who can see your profile information
        </p>
        <div className="mt-4 space-y-4">
          {(['public', 'private', 'connections'] as const).map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`visibility-${option}`}
                name="visibility"
                checked={settings.profileVisibility === option}
                onChange={() => handleVisibilityChange(option)}
                disabled={loading}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor={`visibility-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Data Sharing</h3>
        <p className="mt-1 text-sm text-gray-500">
          Choose what information to share on your profile
        </p>
        <div className="mt-4 space-y-4">
          {(Object.keys(settings.dataSharing) as Array<keyof PrivacySettings['dataSharing']>).map((field) => (
            <div key={field} className="flex items-center">
              <input
                type="checkbox"
                id={`sharing-${field}`}
                checked={settings.dataSharing[field]}
                onChange={() => handleDataSharingChange(field)}
                disabled={loading}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`sharing-${field}`} className="ml-3 block text-sm font-medium text-gray-700">
                {field
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .replace('Show ', '')
                  .replace('Allow ', '')}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Connected Services</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your connected third-party services
        </p>
        <div className="mt-4 space-y-4">
          {settings.thirdPartyConnections.map((connection) => (
            <div key={connection.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={`/icons/${connection.provider.toLowerCase()}.svg`}
                  alt={connection.provider}
                  className="h-8 w-8"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {connection.provider}
                </span>
              </div>
              <button
                onClick={() => handleThirdPartyConnection(connection.provider, !connection.connected)}
                disabled={loading}
                className={`${
                  connection.connected
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                {connection.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 