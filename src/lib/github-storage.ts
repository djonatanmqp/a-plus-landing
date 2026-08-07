// src/lib/github-storage.ts
import { Octokit } from "@octokit/rest";
import sharp from "sharp";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const REPO_OWNER = process.env.GITHUB_OWNER || "";
const REPO_NAME = process.env.GITHUB_REPO || "";
const BRANCH = process.env.GITHUB_BRANCH || "main";

/**
 * Converts buffer to .webp and commits to GitHub repository
 * Returns the relative public path (e.g., "/assets/...")
 */
export async function uploadAndCommitImage(
  fileBuffer: Buffer,
  targetFolder: string, // e.g. "public/assets/services/driveways"
  filenameWithoutExt: string
): Promise<string> {
  // 1. Convert image to WebP using sharp
  const webpBuffer = await sharp(fileBuffer)
    .webp({ quality: 80 })
    .toBuffer();

  const cleanFilename = filenameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

  const relativePath = `/${targetFolder.replace(/^public\//, "")}/${cleanFilename}.webp`;
  const repoPath = `${targetFolder}/${cleanFilename}.webp`;

  let sha: string | undefined = undefined;

  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: repoPath,
      ref: BRANCH,
    });
    if (!Array.isArray(data)) sha = data.sha;
  } catch (err) {
    // File does not exist yet
  }

  await octokit.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: repoPath,
    message: `admin: upload image ${repoPath}`,
    content: webpBuffer.toString("base64"),
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  });

  return relativePath;
}