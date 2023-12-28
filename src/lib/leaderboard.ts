import prisma from "@/lib/db/prisma";

export type LeaderboardData = {
  id: string;
  name: string;
  score: number;
  github: string | null;
  rank: number;
}[];

export default async function getLeaderboardData(): Promise<LeaderboardData> {
  const REFRESH_TIME = process.env["LEADERBOARD_REFRESH_TIME"]
    ? parseInt(process.env["LEADERBOARD_REFRESH_TIME"])
    : 1000 * 60 * 60 * 12;

  // Fetch the leaderboard
  const leaderboardEntries = await prisma.globalLeaderboard.findMany({});

  // Check when the leaderboard was last updated
  const lastUpdated = leaderboardEntries?.[0]?.lastUpdated ?? new Date(0);
  if (Date.now() - lastUpdated.getTime() > REFRESH_TIME) {
    // If the leaderboard is stale, refresh it
    await refreshLeaderboard();
  }

  // Fetch the leaderboard again
  const refreshedLeaderboardEntries = await prisma.globalLeaderboard.findMany({
    orderBy: {
      rank: "asc",
    },
    include: {
      user: {
        select: {
          name: true,
          github: true,
        },
      },
    },
  });

  // Return the leaderboard
  return refreshedLeaderboardEntries.map((entry) => {
    return {
      id: entry.userId,
      name: entry.user.name,
      score: entry.score,
      github: entry.user.github,
      rank: entry.rank,
    };
  });
}

async function refreshLeaderboard() {
  // Get all the users and their scores
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      submissions: {
        select: {
          id: true,
          allotedScore: true,
        },
      },
    },
  });

  // Sum the scores for each user
  const userScores = users.map((user) => {
    const score = user.submissions.reduce((acc: number, curr) => {
      return acc + (curr.allotedScore ?? 0);
    }, 0);

    return {
      id: user.id,
      name: user.name,
      score,
    };
  });

  // Sort the scores
  userScores.sort((a, b) => b.score - a.score);

  // Update the leaderboard
  await prisma.globalLeaderboard.deleteMany({});

  const leaderboardEntries = userScores.map((user, idx) => {
    return {
      userId: user.id,
      score: user.score,
      rank: idx + 1,
      lastUpdated: new Date(),
    };
  });

  if (leaderboardEntries.length === 0) {
    return;
  }

  await prisma.globalLeaderboard.createMany({
    data: leaderboardEntries,
  });
}
