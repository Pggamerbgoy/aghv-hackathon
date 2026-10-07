import { Octokit } from '@octokit/rest';

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || undefined,
});

export const parseGithubUrl = (url: string): { owner: string; repo: string } => {
  const cleanUrl = url.trim().replace(/\/$/, '');
  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/i);
  if (!match) {
    throw new Error(`Invalid GitHub repository URL: "${url}". Format must be https://github.com/owner/repo`);
  }
  return { owner: match[1], repo: match[2] };
};
