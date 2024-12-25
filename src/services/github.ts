import { Octokit } from '@octokit/rest';

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

export class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(config: GitHubConfig) {
    this.octokit = new Octokit({
      auth: config.token
    });
    this.owner = config.owner;
    this.repo = config.repo;
  }

  async getRepositoryInfo() {
    try {
      const { data } = await this.octokit.repos.get({
        owner: this.owner,
        repo: this.repo,
      });
      return data;
    } catch (error) {
      console.error('Error fetching repository info:', error);
      throw error;
    }
  }

  async getCommits(perPage: number = 10) {
    try {
      const { data } = await this.octokit.repos.listCommits({
        owner: this.owner,
        repo: this.repo,
        per_page: perPage,
      });
      return data;
    } catch (error) {
      console.error('Error fetching commits:', error);
      throw error;
    }
  }

  async getPullRequests(state: 'open' | 'closed' | 'all' = 'open') {
    try {
      const { data } = await this.octokit.pulls.list({
        owner: this.owner,
        repo: this.repo,
        state,
      });
      return data;
    } catch (error) {
      console.error('Error fetching pull requests:', error);
      throw error;
    }
  }

  async getBranches() {
    try {
      const { data } = await this.octokit.repos.listBranches({
        owner: this.owner,
        repo: this.repo,
      });
      return data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  }
} 