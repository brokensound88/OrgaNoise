import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GitHubService } from '../../services/github';

interface CommitInfo {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

interface PullRequest {
  number: number;
  title: string;
  user: {
    login: string;
  };
  created_at: string;
  state: string;
}

const RepositoryViewer: React.FC = () => {
  const [commits, setCommits] = useState<CommitInfo[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const githubService = new GitHubService({
    token: process.env.REACT_APP_GITHUB_TOKEN!,
    owner: process.env.REACT_APP_GITHUB_OWNER!,
    repo: process.env.REACT_APP_GITHUB_REPO!,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [commitData, prData] = await Promise.all([
        githubService.getCommits(10),
        githubService.getPullRequests('open'),
      ]);
      setCommits(commitData);
      setPullRequests(prData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading repository data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Commits */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Commits</h2>
          <div className="space-y-4">
            {commits.map((commit) => (
              <div key={commit.sha} className="border-b pb-4">
                <p className="font-medium">{commit.commit.message}</p>
                <p className="text-sm text-gray-500">
                  by {commit.commit.author.name} on{' '}
                  {new Date(commit.commit.author.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pull Requests */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Open Pull Requests</h2>
          <div className="space-y-4">
            {pullRequests.map((pr) => (
              <div key={pr.number} className="border-b pb-4">
                <p className="font-medium">{pr.title}</p>
                <p className="text-sm text-gray-500">
                  #{pr.number} opened by {pr.user.login} on{' '}
                  {new Date(pr.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryViewer; 