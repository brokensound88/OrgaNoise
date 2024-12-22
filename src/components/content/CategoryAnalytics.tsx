import React from 'react';
import { CategoryAnalytics as CategoryAnalyticsType } from '../../utils/content/categories/types';
import { Card } from '../ui/Card';
import { BarChart, TrendingUp, Users } from 'lucide-react';

interface CategoryAnalyticsProps {
  analytics: CategoryAnalyticsType;
}

export function CategoryAnalytics({ analytics }: CategoryAnalyticsProps) {
  const { stats, performance } = analytics;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Category Analytics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <BarChart className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {stats.totalItems}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Engagement Rate
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {performance.engagement.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Views
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {performance.views.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Content Status
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.publishedItems}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.scheduledItems}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Draft</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.draftItems}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}