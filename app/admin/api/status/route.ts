import { NextResponse } from "next/server";

function getGitHubConfig() {
  return {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

export async function GET() {
  const cfg = getGitHubConfig();
  return NextResponse.json({
    mode: process.env.NODE_ENV === "development" || !(cfg.token && cfg.owner && cfg.repo) ? "local" : "github",
    hasToken: !!cfg.token,
    hasOwner: !!cfg.owner,
    hasRepo: !!cfg.repo,
    branch: cfg.branch,
    env: process.env.NODE_ENV,
  });
}