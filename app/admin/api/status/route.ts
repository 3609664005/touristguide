import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasToken = !!process.env.GITHUB_TOKEN;
  const hasOwner = !!process.env.GITHUB_OWNER;
  const hasRepo = !!process.env.GITHUB_REPO;
  const configured = hasToken && hasOwner && hasRepo;

  let apiStatus = "unknown";
  if (configured) {
    try {
      const apiUrl = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/data/entities.json?ref=${process.env.GITHUB_BRANCH || "main"}`;
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        signal: AbortSignal.timeout(5000),
      });
      apiStatus = res.ok ? "ok" : `error_${res.status}`;
    } catch (e) {
      apiStatus = e instanceof Error ? e.message : "fetch_failed";
    }
  }

  return NextResponse.json({
    configured,
    hasToken,
    hasOwner,
    hasRepo,
    apiStatus,
    env: process.env.NODE_ENV,
  });
}