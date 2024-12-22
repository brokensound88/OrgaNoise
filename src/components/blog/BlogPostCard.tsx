import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { Card } from '../ui/Card';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card hover className="h-full">
      <Link to={`/blog/${post.slug}`}>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover rounded-t-lg mb-4"
          />
        )}
        <div className="p-4">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span className="inline-flex items-center">
              <User className="h-4 w-4 mr-1" />
              {post.author}
            </span>
            <span className="inline-flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime} min read
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {post.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Read more →
            </span>
            <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {post.category}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}