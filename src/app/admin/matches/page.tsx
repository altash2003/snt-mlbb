import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminMatchesPage() {
  // 1. Fetch all matches waiting for approval
  const pendingMatches = await prisma.match.findMany({
    where: { status: "PENDING", proofImage: { not: null } },
    include: { tournament: true },
    orderBy: { tournamentId: 'desc' }
  });

  // 2. Server Action to Approve Win
  async function approveWin(formData: FormData) {
    "use server";
    const matchId = formData.get("matchId") as string;
    const winnerId = formData.get("winnerId") as string;

    await prisma.match.update({
      where: { id: matchId },
      data: { status: "COMPLETED", winnerId: winnerId }
    });
    
    // logic to move winner to next round would go here (see Phase 4)
    revalidatePath("/admin/matches");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">👮 Admin: Match Approvals</h1>
      
      <div className="grid gap-4">
        {pendingMatches.map((match) => (
          <div key={match.id} className="border p-4 rounded shadow bg-white flex gap-6 items-center">
            
            {/* Proof Image */}
            <div className="w-48 h-28 bg-gray-100 overflow-hidden rounded relative group">
               <img src={match.proofImage!} alt="Proof" className="object-cover w-full h-full" />
               <a href={match.proofImage!} target="_blank" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100">
                 View Full
               </a>
            </div>

            {/* Match Info */}
            <div className="flex-1">
              <p className="text-sm text-gray-500">{match.tournament.name} • Round {match.round}</p>
              <div className="font-bold">Match ID: {match.id.slice(0,8)}</div>
            </div>

            {/* Actions */}
            <form action={approveWin} className="flex gap-2">
              <input type="hidden" name="matchId" value={match.id} />
              
              <button 
                name="winnerId" 
                value={match.teamAId!} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Team A Won
              </button>
              
              <button 
                name="winnerId" 
                value={match.teamBId!} 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Team B Won
              </button>
            </form>
          </div>
        ))}
        
        {pendingMatches.length === 0 && (
          <p className="text-gray-500 italic">No matches currently awaiting review.</p>
        )}
      </div>
    </div>
  );
}