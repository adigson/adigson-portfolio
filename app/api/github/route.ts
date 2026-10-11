import { NextResponse } from "next/server";

type GitHubRepository = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
};

export const revalidate = 900;

export async function GET() {
  try {
    const response = await fetch(
      "https://api.github.com/users/adigson/repos?sort=updated&per_page=100",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "adigson-portfolio",
        },
        next: { revalidate: 900 },
      },
    );

    if (!response.ok) {
      console.error(`GitHub repository request failed with status ${response.status}.`);
      return NextResponse.json(
        { error: "GitHub could not return repository data. Please try again later." },
        { status: 502 },
      );
    }

    const repositories = (await response.json()) as GitHubRepository[];
    const languages = new Map<string, number>();

    for (const repository of repositories) {
      if (!repository.fork && repository.language) {
        languages.set(repository.language, (languages.get(repository.language) ?? 0) + 1);
      }
    }

    return NextResponse.json({
      repositoryCount: repositories.length,
      languages: Array.from(languages, ([name, count]) => ({ name, count })).sort(
        (left, right) => right.count - left.count,
      ),
      repositories: repositories.slice(0, 6).map((repository) => ({
        id: repository.id,
        name: repository.name,
        description: repository.description,
        url: repository.html_url,
        language: repository.language,
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        updatedAt: repository.updated_at,
      })),
      source: "GitHub REST API",
    });
  } catch (error) {
    console.error("GitHub repository fetch failed:", error);
    return NextResponse.json(
      { error: "GitHub is temporarily unreachable. Please try again later." },
      { status: 502 },
    );
  }
}
