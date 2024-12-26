import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  profileRecommendationsService,
  ProfileRecommendation,
  RecommendationFilter,
} from '../services/profileRecommendationsService';

interface ProfileRecommendationsProps {
  userId: string;
}

export const ProfileRecommendations: React.FC<ProfileRecommendationsProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<ProfileRecommendation[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<RecommendationFilter>({
    type: 'similar',
    minScore: 0.5,
    status: 'pending',
    limit: 10,
    offset: 0,
  });
  const [insights, setInsights] = useState<{
    totalRecommendations: number;
    acceptanceRate: number;
    topReasons: {
      type: string;
      count: number;
      successRate: number;
    }[];
    recentActivity: {
      date: Date;
      recommendations: number;
      acceptances: number;
      rejections: number;
    }[];
  } | null>(null);
  const [preferences, setPreferences] = useState({
    enableSimilarProfiles: true,
    enableConnectionSuggestions: true,
    enableContentRecommendations: true,
    minScore: 0.5,
    maxRecommendationsPerDay: 10,
    excludedTypes: [] as string[],
  });
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [filters]);

  useEffect(() => {
    loadInsights();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await profileRecommendationsService.getRecommendations(userId, filters);
      setRecommendations(response.recommendations);
      setTotal(response.total);
      setHasMore(response.hasMore);
    } catch (error) {
      toast.error('Failed to load recommendations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      const data = await profileRecommendationsService.getInsights(userId);
      setInsights(data);
    } catch (error) {
      toast.error('Failed to load insights');
      console.error(error);
    }
  };

  const handleUpdateStatus = async (recommendationId: string, status: 'accepted' | 'rejected' | 'hidden') => {
    try {
      const updatedRecommendation = await profileRecommendationsService.updateRecommendationStatus(
        recommendationId,
        status
      );
      setRecommendations(recommendations.map(rec =>
        rec.id === recommendationId ? updatedRecommendation : rec
      ));
      toast.success(`Recommendation ${status}`);
      loadInsights();
    } catch (error) {
      toast.error('Failed to update recommendation status');
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    try {
      await profileRecommendationsService.refreshRecommendations(userId);
      loadData();
      toast.success('Recommendations refreshed');
    } catch (error) {
      toast.error('Failed to refresh recommendations');
      console.error(error);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      await profileRecommendationsService.updatePreferences(userId, preferences);
      setShowPreferencesModal(false);
      loadData();
      toast.success('Preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
      console.error(error);
    }
  };

  const handleLoadMore = () => {
    setFilters(prev => ({
      ...prev,
      offset: (prev.offset || 0) + (prev.limit || 10),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Recommendations</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowPreferencesModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Preferences
          </button>
        </div>
      </div>

      {/* Insights */}
      {insights && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Total Recommendations</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {insights.totalRecommendations}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Acceptance Rate</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {(insights.acceptanceRate * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Recent Activity</p>
              <div className="mt-1">
                {insights.recentActivity.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{activity.date.toLocaleDateString()}</span>
                    <span>{activity.acceptances} accepted</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as RecommendationFilter['type'], offset: 0 })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="similar">Similar Profiles</option>
              <option value="connection">Connection Suggestions</option>
              <option value="content">Content Recommendations</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as RecommendationFilter['status'], offset: 0 })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <div>
            <label htmlFor="min-score" className="block text-sm font-medium text-gray-700">
              Minimum Score
            </label>
            <input
              type="number"
              id="min-score"
              min="0"
              max="1"
              step="0.1"
              value={filters.minScore}
              onChange={(e) => setFilters({ ...filters, minScore: parseFloat(e.target.value), offset: 0 })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          <div>
            <label htmlFor="limit" className="block text-sm font-medium text-gray-700">
              Items per page
            </label>
            <select
              id="limit"
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), offset: 0 })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {recommendation.recommendationType === 'similar' && 'Similar Profile'}
                  {recommendation.recommendationType === 'connection' && 'Connection Suggestion'}
                  {recommendation.recommendationType === 'content' && 'Content Recommendation'}
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  Match Score: {(recommendation.score * 100).toFixed(1)}%
                </p>
              </div>
              <div className="flex space-x-2">
                {recommendation.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(recommendation.id, 'accepted')}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(recommendation.id, 'rejected')}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleUpdateStatus(recommendation.id, 'hidden')}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hide
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700">Reasons</h5>
              <div className="mt-2 space-y-2">
                {recommendation.reasons.map((reason, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <span className="flex-1">{reason.description}</span>
                    <span className="text-gray-500">
                      Weight: {(reason.weight * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {recommendation.metadata && (
              <div className="mt-4 border-t pt-4">
                {recommendation.metadata.commonSkills && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">Common Skills: </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {recommendation.metadata.commonSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {recommendation.metadata.commonConnections !== undefined && (
                  <p className="text-sm text-gray-600">
                    {recommendation.metadata.commonConnections} common connections
                  </p>
                )}
                {recommendation.metadata.locationProximity !== undefined && (
                  <p className="text-sm text-gray-600">
                    {recommendation.metadata.locationProximity} km away
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {recommendations.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No recommendations found</p>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recommendation Preferences</h3>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="similar-profiles" className="text-sm font-medium text-gray-700">
                  Similar Profiles
                </label>
                <input
                  type="checkbox"
                  id="similar-profiles"
                  checked={preferences.enableSimilarProfiles}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    enableSimilarProfiles: e.target.checked,
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="connection-suggestions" className="text-sm font-medium text-gray-700">
                  Connection Suggestions
                </label>
                <input
                  type="checkbox"
                  id="connection-suggestions"
                  checked={preferences.enableConnectionSuggestions}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    enableConnectionSuggestions: e.target.checked,
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="content-recommendations" className="text-sm font-medium text-gray-700">
                  Content Recommendations
                </label>
                <input
                  type="checkbox"
                  id="content-recommendations"
                  checked={preferences.enableContentRecommendations}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    enableContentRecommendations: e.target.checked,
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div>
                <label htmlFor="min-score-pref" className="block text-sm font-medium text-gray-700">
                  Minimum Score
                </label>
                <input
                  type="number"
                  id="min-score-pref"
                  min="0"
                  max="1"
                  step="0.1"
                  value={preferences.minScore}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    minScore: parseFloat(e.target.value),
                  })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="max-daily" className="block text-sm font-medium text-gray-700">
                  Maximum Recommendations per Day
                </label>
                <input
                  type="number"
                  id="max-daily"
                  min="1"
                  max="100"
                  value={preferences.maxRecommendationsPerDay}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    maxRecommendationsPerDay: parseInt(e.target.value),
                  })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePreferences}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Save
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