import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  profileBadgesService,
  Badge,
  BadgeCategory,
} from '../services/profileBadgesService';

interface ProfileBadgesProps {
  userId: string;
}

export const ProfileBadges: React.FC<ProfileBadgesProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [categories, setCategories] = useState<BadgeCategory[]>([]);
  const [statistics, setStatistics] = useState<{
    totalBadges: number;
    badgesByType: Record<string, number>;
    badgesByLevel: Record<string, number>;
    recentlyEarned: Badge[];
    nextAvailableBadges: Badge[];
    completionRate: number;
  } | null>(null);
  const [selectedType, setSelectedType] = useState<'achievement' | 'skill' | 'verification' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [verificationData, setVerificationData] = useState({
    method: '',
    evidence: '',
  });

  useEffect(() => {
    loadData();
    loadCategories();
    loadStatistics();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const options = {
        ...(selectedType && { type: selectedType }),
        ...(selectedCategory && { category: selectedCategory }),
      };
      const response = await profileBadgesService.getBadges(userId, options);
      setBadges(response.badges);
    } catch (error) {
      toast.error('Failed to load badges');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categories = await profileBadgesService.getBadgeCategories();
      setCategories(categories);
    } catch (error) {
      toast.error('Failed to load badge categories');
      console.error(error);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await profileBadgesService.getBadgeStatistics(userId);
      setStatistics(stats);
    } catch (error) {
      toast.error('Failed to load badge statistics');
      console.error(error);
    }
  };

  const handleUpdateVisibility = async (badgeId: string, isVisible: boolean) => {
    try {
      const updatedBadge = await profileBadgesService.updateBadgeVisibility(
        userId,
        badgeId,
        isVisible
      );
      setBadges(badges.map(badge =>
        badge.id === badgeId ? updatedBadge : badge
      ));
      toast.success(`Badge ${isVisible ? 'shown' : 'hidden'} successfully`);
    } catch (error) {
      toast.error('Failed to update badge visibility');
      console.error(error);
    }
  };

  const handleRequestVerification = async () => {
    if (!selectedBadge) return;

    try {
      const updatedBadge = await profileBadgesService.requestVerification(
        userId,
        selectedBadge.id,
        verificationData
      );
      setBadges(badges.map(badge =>
        badge.id === selectedBadge.id ? updatedBadge : badge
      ));
      setShowVerificationModal(false);
      setSelectedBadge(null);
      setVerificationData({ method: '', evidence: '' });
      toast.success('Verification request submitted successfully');
    } catch (error) {
      toast.error('Failed to submit verification request');
      console.error(error);
    }
  };

  const getBadgeTypeIcon = (type: 'achievement' | 'skill' | 'verification') => {
    switch (type) {
      case 'achievement':
        return (
          <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'skill':
        return (
          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'verification':
        return (
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
    }
  };

  const getBadgeLevelColor = (level?: 'bronze' | 'silver' | 'gold' | 'platinum') => {
    switch (level) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      case 'bronze':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Badges</h2>
          {statistics && (
            <p className="mt-1 text-sm text-gray-500">
              {statistics.totalBadges} total badges ({Math.round(statistics.completionRate * 100)}% earned)
            </p>
          )}
        </div>
        <div className="flex space-x-4">
          <div>
            <label htmlFor="badge-type" className="sr-only">Badge Type</label>
            <select
              id="badge-type"
              value={selectedType || ''}
              onChange={(e) => {
                setSelectedType(e.target.value ? e.target.value as 'achievement' | 'skill' | 'verification' : null);
                loadData();
              }}
              className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Types</option>
              <option value="achievement">Achievements</option>
              <option value="skill">Skills</option>
              <option value="verification">Verifications</option>
            </select>
          </div>

          <div>
            <label htmlFor="badge-category" className="sr-only">Badge Category</label>
            <select
              id="badge-category"
              value={selectedCategory || ''}
              onChange={(e) => {
                setSelectedCategory(e.target.value || null);
                loadData();
              }}
              className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Badge Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">By Type</p>
              <div className="mt-2 space-y-2">
                {Object.entries(statistics.badgesByType).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="capitalize">{type}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">By Level</p>
              <div className="mt-2 space-y-2">
                {Object.entries(statistics.badgesByLevel).map(([level, count]) => (
                  <div key={level} className="flex justify-between text-sm">
                    <span className="capitalize">{level}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Recently Earned</p>
              <div className="mt-2 space-y-2">
                {statistics.recentlyEarned.slice(0, 3).map(badge => (
                  <div key={badge.id} className="text-sm">
                    {badge.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  {getBadgeTypeIcon(badge.type)}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {badge.name}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {badge.description}
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    {badge.level && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getBadgeLevelColor(badge.level)
                      }`}>
                        {badge.level.charAt(0).toUpperCase() + badge.level.slice(1)}
                      </span>
                    )}
                    {badge.category && (
                      <span className="text-xs text-gray-500">
                        {badge.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {badge.type === 'verification' && !badge.metadata.verificationDetails && (
                  <button
                    onClick={() => {
                      setSelectedBadge(badge);
                      setShowVerificationModal(true);
                    }}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Request Verification
                  </button>
                )}
                <button
                  onClick={() => handleUpdateVisibility(badge.id, !badge.isVisible)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {badge.isVisible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {badge.criteria && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round((badge.criteria.current / badge.criteria.value) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 rounded-full h-2"
                    style={{ width: `${(badge.criteria.current / badge.criteria.value) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Verification Status */}
            {badge.metadata.verificationDetails && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    badge.metadata.verificationDetails.status === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : badge.metadata.verificationDetails.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {badge.metadata.verificationDetails.status.charAt(0).toUpperCase() +
                      badge.metadata.verificationDetails.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {badge.metadata.verificationDetails.method}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {badges.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No badges found</p>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {showVerificationModal && selectedBadge && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Request Badge Verification</h3>
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setSelectedBadge(null);
                  setVerificationData({ method: '', evidence: '' });
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="verification-method" className="block text-sm font-medium text-gray-700">
                  Verification Method
                </label>
                <select
                  id="verification-method"
                  value={verificationData.method}
                  onChange={(e) => setVerificationData({ ...verificationData, method: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a method</option>
                  <option value="document">Document Upload</option>
                  <option value="certification">Certification</option>
                  <option value="reference">Professional Reference</option>
                </select>
              </div>

              <div>
                <label htmlFor="verification-evidence" className="block text-sm font-medium text-gray-700">
                  Evidence
                </label>
                <textarea
                  id="verification-evidence"
                  value={verificationData.evidence}
                  onChange={(e) => setVerificationData({ ...verificationData, evidence: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Provide details about your evidence..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setSelectedBadge(null);
                  setVerificationData({ method: '', evidence: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestVerification}
                disabled={!verificationData.method || !verificationData.evidence}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </button>
            </div>
          </div>
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