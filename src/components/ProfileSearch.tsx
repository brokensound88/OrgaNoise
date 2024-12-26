import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  profileSearchService,
  SearchFilters,
  SearchResult,
  SavedSearch,
} from '../services/profileSearchService';

interface ProfileSearchProps {
  userId: string;
}

export const ProfileSearch: React.FC<ProfileSearchProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 10,
    sortBy: 'relevance',
    sortOrder: 'desc',
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [filterOptions, setFilterOptions] = useState<{
    skills: string[];
    industries: string[];
    locations: string[];
  }>({
    skills: [],
    industries: [],
    locations: [],
  });
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');

  useEffect(() => {
    loadInitialData();
  }, [userId]);

  const loadInitialData = async () => {
    try {
      const [options, saved] = await Promise.all([
        profileSearchService.getFilterOptions(),
        profileSearchService.getSavedSearches(userId),
      ]);
      setFilterOptions(options);
      setSavedSearches(saved);
    } catch (error) {
      toast.error('Failed to load search data');
      console.error(error);
    }
  };

  const handleSearch = async (newPage?: number) => {
    setLoading(true);
    try {
      const searchFilters = {
        ...filters,
        page: newPage || filters.page,
      };
      const response = await profileSearchService.searchProfiles(searchFilters);
      setResults(response.results);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setFilters(searchFilters);
    } catch (error) {
      toast.error('Failed to search profiles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: SearchFilters[keyof SearchFilters]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset page when filters change
    }));
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  };

  const handleKeywordChange = async (value: string) => {
    handleFilterChange('keywords', value);
    if (value.length >= 2) {
      try {
        const suggestions = await profileSearchService.getSearchSuggestions(value);
        setSearchSuggestions(suggestions);
      } catch (error) {
        console.error('Failed to get search suggestions:', error);
      }
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSaveSearch = async () => {
    if (!newSearchName.trim()) {
      toast.error('Please enter a name for your search');
      return;
    }

    try {
      const savedSearch = await profileSearchService.saveSearch(
        userId,
        newSearchName,
        filters
      );
      setSavedSearches([savedSearch, ...savedSearches]);
      setShowSaveSearchModal(false);
      setNewSearchName('');
      toast.success('Search saved successfully');
    } catch (error) {
      toast.error('Failed to save search');
      console.error(error);
    }
  };

  const handleDeleteSavedSearch = async (searchId: string) => {
    if (!window.confirm('Are you sure you want to delete this saved search?')) return;

    try {
      await profileSearchService.deleteSavedSearch(userId, searchId);
      setSavedSearches(savedSearches.filter(s => s.id !== searchId));
      toast.success('Search deleted successfully');
    } catch (error) {
      toast.error('Failed to delete search');
      console.error(error);
    }
  };

  const handleLoadSavedSearch = (search: SavedSearch) => {
    setFilters(search.filters);
    handleSearch(1);
  };

  return (
    <div className="space-y-8">
      {/* Search Controls */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          {/* Keyword Search */}
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
              Keywords
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="keywords"
                value={filters.keywords || ''}
                onChange={(e) => handleKeywordChange(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by name, skills, or location"
              />
              {searchSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleFilterChange('keywords', suggestion);
                        setSearchSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills
              </label>
              <select
                id="skills"
                multiple
                value={filters.skills || []}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  handleFilterChange('skills', values);
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {filterOptions.skills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <select
                id="location"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Any location</option>
                {filterOptions.locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <select
                id="industry"
                multiple
                value={filters.industry || []}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  handleFilterChange('industry', values);
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {filterOptions.industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Experience Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="min-experience" className="block text-sm font-medium text-gray-700">
                Min Experience (years)
              </label>
              <input
                type="number"
                id="min-experience"
                min="0"
                value={filters.experience?.min || ''}
                onChange={(e) => handleFilterChange('experience', {
                  ...filters.experience,
                  min: e.target.value ? parseInt(e.target.value) : undefined,
                })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
            <div>
              <label htmlFor="max-experience" className="block text-sm font-medium text-gray-700">
                Max Experience (years)
              </label>
              <input
                type="number"
                id="max-experience"
                min="0"
                value={filters.experience?.max || ''}
                onChange={(e) => handleFilterChange('experience', {
                  ...filters.experience,
                  max: e.target.value ? parseInt(e.target.value) : undefined,
                })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search
              </button>
              <button
                onClick={() => setShowSaveSearchModal(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Search
              </button>
            </div>
            <div>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'])}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                aria-label="Sort results by"
              >
                <option value="relevance">Relevance</option>
                <option value="experience">Experience</option>
                <option value="location">Location</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Searches</h3>
          <div className="space-y-4">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{search.name}</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Created {search.createdAt.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLoadSavedSearch(search)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDeleteSavedSearch(search.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Search Results {total > 0 && `(${total} found)`}
        </h3>
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              {result.avatarUrl && (
                <img
                  src={result.avatarUrl}
                  alt={`${result.name}'s avatar`}
                  className="h-12 w-12 rounded-full"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{result.name}</h4>
                  <span className="text-sm text-gray-500">
                    Match Score: {result.matchScore}%
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{result.title}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <span>{result.location}</span>
                  <span className="mx-2">•</span>
                  <span>{result.experience} years experience</span>
                  <span className="mx-2">•</span>
                  <span>{result.availability}</span>
                </div>
              </div>
            </div>
          ))}

          {results.length === 0 && !loading && (
            <p className="text-sm text-gray-500 text-center py-4">
              No results found. Try adjusting your search filters.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleSearch(page)}
                  disabled={loading}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === filters.page
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Save Search Modal */}
      {showSaveSearchModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Save Search</h3>
              <button
                onClick={() => setShowSaveSearchModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <label htmlFor="search-name" className="block text-sm font-medium text-gray-700">
                Search Name
              </label>
              <input
                type="text"
                id="search-name"
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter a name for your search"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowSaveSearchModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSearch}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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