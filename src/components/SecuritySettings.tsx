import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { securityService, PasswordChangeData, SecurityQuestionData } from '../services/securityService';
import { toast } from 'react-toastify';
import QRCode from 'qrcode.react';

interface SecuritySettingsProps {
  userId: string;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'password' | '2fa' | 'questions'>('password');
  const [loading, setLoading] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string>();
  const [backupCodes, setBackupCodes] = useState<string[]>();
  
  const passwordForm = useForm<PasswordChangeData>();
  const questionForm = useForm<{ questions: SecurityQuestionData[] }>();

  const handlePasswordChange = async (data: PasswordChangeData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await securityService.changePassword(userId, data);
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (error) {
      toast.error('Failed to change password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const setupTwoFactor = async () => {
    setLoading(true);
    try {
      const result = await securityService.setupTwoFactor(userId);
      if (result.secret) {
        setTwoFactorSecret(result.secret);
        setBackupCodes(result.backupCodes);
      }
    } catch (error) {
      toast.error('Failed to set up 2FA');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityQuestions = async (data: { questions: SecurityQuestionData[] }) => {
    setLoading(true);
    try {
      await securityService.setSecurityQuestions(userId, data.questions);
      toast.success('Security questions updated');
      questionForm.reset();
    } catch (error) {
      toast.error('Failed to update security questions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('password')}
            className={`${
              activeTab === 'password'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Password
          </button>
          <button
            onClick={() => setActiveTab('2fa')}
            className={`${
              activeTab === '2fa'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Two-Factor Auth
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`${
              activeTab === 'questions'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Security Questions
          </button>
        </nav>
      </div>

      {activeTab === 'password' && (
        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              {...passwordForm.register('currentPassword', { required: 'Current password is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              {...passwordForm.register('newPassword', { required: 'New password is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...passwordForm.register('confirmPassword', { required: 'Please confirm your password' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      )}

      {activeTab === '2fa' && (
        <div className="space-y-6">
          {!twoFactorSecret ? (
            <button
              onClick={setupTwoFactor}
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Setting up 2FA...' : 'Set up Two-Factor Authentication'}
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Scan QR Code</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Scan this QR code with your authenticator app
                </p>
                <div className="mt-4">
                  <QRCode value={twoFactorSecret} size={200} />
                </div>
              </div>
              {backupCodes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Backup Codes</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Save these backup codes in a secure place
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {backupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="p-2 bg-gray-100 rounded-md text-mono text-sm"
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'questions' && (
        <form onSubmit={questionForm.handleSubmit(handleSecurityQuestions)} className="space-y-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="space-y-4">
              <div>
                <label
                  htmlFor={`question-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Security Question {index}
                </label>
                <input
                  type="text"
                  id={`question-${index}`}
                  {...questionForm.register(`questions.${index - 1}.question` as const, {
                    required: 'Question is required',
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor={`answer-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Answer
                </label>
                <input
                  type="text"
                  id={`answer-${index}`}
                  {...questionForm.register(`questions.${index - 1}.answer` as const, {
                    required: 'Answer is required',
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Saving Questions...' : 'Save Security Questions'}
          </button>
        </form>
      )}
    </div>
  );
}; 