import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  profileVerificationService,
  VerificationRequest,
  DocumentVerification,
  VerificationStatus,
} from '../services/profileVerificationService';

interface ProfileVerificationProps {
  userId: string;
}

export const ProfileVerification: React.FC<ProfileVerificationProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [emailVerification, setEmailVerification] = useState<VerificationRequest | null>(null);
  const [phoneVerification, setPhoneVerification] = useState<VerificationRequest | null>(null);
  const [documents, setDocuments] = useState<DocumentVerification[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadVerificationStatus();
  }, [userId]);

  const loadVerificationStatus = async () => {
    setLoading(true);
    try {
      const status = await profileVerificationService.getVerificationStatus(userId);
      setEmailVerification(status.email);
      setPhoneVerification(status.phone);
      setDocuments(status.documents);
    } catch (error) {
      toast.error('Failed to load verification status');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailVerification = async (email: string) => {
    try {
      const result = await profileVerificationService.sendEmailVerification(userId, email);
      setEmailVerification(result);
      toast.success('Verification email sent successfully');
    } catch (error) {
      toast.error('Failed to send verification email');
      console.error(error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const result = await profileVerificationService.verifyEmail(userId, verificationCode);
      setEmailVerification(result);
      setVerificationCode('');
      toast.success('Email verified successfully');
    } catch (error) {
      toast.error('Failed to verify email');
      console.error(error);
    }
  };

  const handleSendPhoneVerification = async (phoneNumber: string) => {
    try {
      const result = await profileVerificationService.sendPhoneVerification(userId, phoneNumber);
      setPhoneVerification(result);
      toast.success('Verification code sent to your phone');
    } catch (error) {
      toast.error('Failed to send verification code');
      console.error(error);
    }
  };

  const handleVerifyPhone = async () => {
    try {
      const result = await profileVerificationService.verifyPhone(userId, verificationCode);
      setPhoneVerification(result);
      setVerificationCode('');
      toast.success('Phone number verified successfully');
    } catch (error) {
      toast.error('Failed to verify phone number');
      console.error(error);
    }
  };

  const handleUploadDocument = async (
    documentType: string,
    documentNumber: string,
    file: File
  ) => {
    try {
      const result = await profileVerificationService.uploadDocument(
        userId,
        documentType,
        documentNumber,
        file
      );
      setDocuments([...documents, result]);
      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload document');
      console.error(error);
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'verified':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'expired':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="space-y-8">
      {/* Email Verification */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Verification</h3>
        {emailVerification ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Email: {emailVerification.value}</p>
                <span className={getStatusBadge(emailVerification.status)}>
                  {emailVerification.status}
                </span>
              </div>
              {emailVerification.status === 'pending' && (
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    onClick={handleVerifyEmail}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Verify
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSendEmailVerification(formData.get('email') as string);
            }}
            className="flex space-x-4"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Verification
            </button>
          </form>
        )}
      </div>

      {/* Phone Verification */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Phone Verification</h3>
        {phoneVerification ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Phone: {phoneVerification.value}</p>
                <span className={getStatusBadge(phoneVerification.status)}>
                  {phoneVerification.status}
                </span>
              </div>
              {phoneVerification.status === 'pending' && (
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    onClick={handleVerifyPhone}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Verify
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSendPhoneVerification(formData.get('phone') as string);
            }}
            className="flex space-x-4"
          >
            <input
              type="tel"
              name="phone"
              required
              placeholder="Enter your phone number"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Verification
            </button>
          </form>
        )}
      </div>

      {/* Document Verification */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Document Verification</h3>
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const file = fileInputRef.current?.files?.[0];
              if (file) {
                handleUploadDocument(
                  formData.get('documentType') as string,
                  formData.get('documentNumber') as string,
                  file
                );
              }
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
                Document Type
              </label>
              <select
                id="documentType"
                name="documentType"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>

            <div>
              <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">
                Document Number
              </label>
              <input
                type="text"
                id="documentNumber"
                name="documentNumber"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="documentFile" className="block text-sm font-medium text-gray-700">
                Document File
              </label>
              <input
                type="file"
                id="documentFile"
                name="documentFile"
                ref={fileInputRef}
                required
                accept="image/*,.pdf"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Upload Document
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {doc.documentType} - {doc.documentNumber}
                  </h4>
                  <span className={getStatusBadge(doc.status)}>{doc.status}</span>
                  {doc.rejectionReason && (
                    <p className="mt-1 text-sm text-red-600">{doc.rejectionReason}</p>
                  )}
                </div>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View Document
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
}; 