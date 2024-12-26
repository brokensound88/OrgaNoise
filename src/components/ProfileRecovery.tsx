import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  profileRecoveryService,
  BackupCode,
  AccountRecoveryRequest,
  PasswordResetRequest,
} from '../services/profileRecoveryService';

interface ProfileRecoveryProps {
  userId: string;
}

export const ProfileRecovery: React.FC<ProfileRecoveryProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'password' | 'account' | 'backup'>('password');
  const [loading, setLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([]);
  const [recoveryRequest, setRecoveryRequest] = useState<AccountRecoveryRequest | null>(null);
  const [resetRequest, setResetRequest] = useState<PasswordResetRequest | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

  const passwordForm = useForm<{ email: string }>();
  const recoveryForm = useForm<{
    identifier: string;
    type: 'email' | 'phone' | 'security_questions';
  }>();
  const newPasswordForm = useForm<{ password: string; confirmPassword: string }>();

  useEffect(() => {
    loadBackupCodes();
  }, [userId]);

  const loadBackupCodes = async () => {
    try {
      const codes = await profileRecoveryService.getBackupCodes(userId);
      setBackupCodes(codes);
    } catch (error) {
      console.error('Failed to load backup codes:', error);
    }
  };

  const handlePasswordReset = async (data: { email: string }) => {
    setLoading(true);
    try {
      const request = await profileRecoveryService.requestPasswordReset(data.email);
      setResetRequest(request);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error('Failed to request password reset');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountRecovery = async (data: {
    identifier: string;
    type: 'email' | 'phone' | 'security_questions';
  }) => {
    setLoading(true);
    try {
      const request = await profileRecoveryService.initiateAccountRecovery(
        data.identifier,
        data.type
      );
      setRecoveryRequest(request);
      toast.success('Recovery instructions sent');
    } catch (error) {
      toast.error('Failed to initiate account recovery');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!recoveryRequest) return;

    setLoading(true);
    try {
      const updatedRequest = await profileRecoveryService.verifyRecoveryCode(
        recoveryRequest.id,
        verificationCode
      );
      setRecoveryRequest(updatedRequest);
      if (updatedRequest.status === 'verified') {
        toast.success('Code verified successfully');
      }
    } catch (error) {
      toast.error('Failed to verify code');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (data: { password: string; confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (recoveryRequest?.status === 'verified') {
        await profileRecoveryService.completeAccountRecovery(recoveryRequest.id, data.password);
      } else if (resetRequest?.token) {
        await profileRecoveryService.resetPassword(resetRequest.token, data.password);
      }
      toast.success('Password updated successfully');
      setRecoveryRequest(null);
      setResetRequest(null);
      newPasswordForm.reset();
    } catch (error) {
      toast.error('Failed to update password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBackupCodes = async () => {
    setLoading(true);
    try {
      const newCodes = await profileRecoveryService.generateBackupCodes(userId);
      setBackupCodes(newCodes);
      toast.success('New backup codes generated');
    } catch (error) {
      toast.error('Failed to generate backup codes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['password', 'account', 'backup'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab} Recovery
            </button>
          ))}
        </nav>
      </div>

      {/* Password Reset Tab */}
      {activeTab === 'password' && (
        <div className="space-y-6">
          {!resetRequest ? (
            <form onSubmit={passwordForm.handleSubmit(handlePasswordReset)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  {...passwordForm.register('email', { required: 'Email is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Sending...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <form onSubmit={newPasswordForm.handleSubmit(handleSetNewPassword)} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...newPasswordForm.register('password', { required: 'Password is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...newPasswordForm.register('confirmPassword', { required: 'Please confirm your password' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Account Recovery Tab */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {!recoveryRequest ? (
            <form onSubmit={recoveryForm.handleSubmit(handleAccountRecovery)} className="space-y-4">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  id="identifier"
                  {...recoveryForm.register('identifier', { required: 'This field is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Recovery Method
                </label>
                <select
                  id="type"
                  {...recoveryForm.register('type', { required: 'Please select a recovery method' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="security_questions">Security Questions</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Initiating...' : 'Start Recovery'}
              </button>
            </form>
          ) : recoveryRequest.status === 'pending' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={loading || !verificationCode}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={newPasswordForm.handleSubmit(handleSetNewPassword)} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...newPasswordForm.register('password', { required: 'Password is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...newPasswordForm.register('confirmPassword', { required: 'Please confirm your password' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Backup Codes Tab */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Backup Codes</h3>
            <button
              onClick={handleGenerateBackupCodes}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Generating...' : 'Generate New Codes'}
            </button>
          </div>

          {backupCodes.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {backupCodes.map((code) => (
                <div
                  key={code.id}
                  className={`p-4 rounded-md ${
                    code.isUsed ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-800'
                  }`}
                >
                  <div className="font-mono text-sm">{code.code}</div>
                  {code.isUsed && (
                    <div className="text-xs mt-1">
                      Used on {code.usedAt?.toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No backup codes available. Generate new codes to get started.
            </p>
          )}

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Save these backup codes in a secure place. Each code can only be used once, and
                    new codes can be generated at any time (which will invalidate all existing codes).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 