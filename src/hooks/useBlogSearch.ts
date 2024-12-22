import { useState, useEffect, useMemo } from 'react';
import { BlogPost } from '../types/blog';

export function useBlogSearch(posts: BlogPost[], query: string) {
  const [searchResults, setSearchResults] = useState<BlogPost[]>(posts);

  const searchPosts = useMemo(() => {
    return (posts: BlogPost[], query: string) => {
      if (!query.trim()) return posts;
      
      const searchTerms = query.toLowerCase().split(' ');
      
      return posts.filter(post => {
        const searchText = `${post.title} ${post.excerpt} ${post.category} ${post.tags.join(' ')}`.toLowerCase();
        return searchTerms.every(term => searchText.includes(term));
      });
    };
  }, []);

  useEffect(() => {
    setSearchResults(searchPosts(posts, query));
  }, [posts, query, searchPosts]);

  return searchResults;
}