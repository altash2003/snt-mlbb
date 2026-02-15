import prisma from "./prisma";

export async function advanceWinner(matchId: string, winnerId: string) {
  // 1. Get current match details
  const currentMatch = await prisma.match.findUnique({
    where: { id: matchId }
  });

  if (!currentMatch) return;

  // 2. Calculate Next Match details
  // Logic: If I am match #0 in Round 1, I go to match #0 in Round 2.
  // If I am match #1 in Round 1, I ALSO go to match #0 in Round 2 (as opponent).
  const nextRound = currentMatch.round + 1;
  const nextMatchOrder = Math.floor(currentMatch.matchOrder / 2);

  // 3. Find the destination match node
  const nextMatch = await prisma.match.findFirst({
    where: {
      tournamentId: currentMatch.tournamentId,
      round: nextRound,
      matchOrder: nextMatchOrder
    }
  });

  if (!nextMatch) return; // Must be the finals!

  // 4. Place winner in the correct slot (Team A or Team B?)
  const isTeamA = (currentMatch.matchOrder % 2 === 0); // Evens go to A, Odds go to B
  
  await prisma.match.update({
    where: { id: nextMatch.id },
    data: isTeamA ? { teamAId: winnerId } : { teamBId: winnerId }
  });
}