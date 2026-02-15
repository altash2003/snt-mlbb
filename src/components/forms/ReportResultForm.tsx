"use client";

import { useState } from "react";

export default function ReportResultForm({ matchId, teamA, teamB }: any) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    // In a real app, you would upload the file to S3/Supabase first
    // const imageUrl = await uploadFile(file); 
    
    // For MVP, we pretend the upload worked
    alert("Screenshot uploaded! Waiting for Admin approval.");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 text-white p-6 rounded-lg max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Report Match Result</h3>
      
      <div className="mb-4">
        <label className="block mb-2">Who won?</label>
        <select className="w-full p-2 bg-gray-900 rounded border border-gray-700">
          <option value={teamA.id}>{teamA.name}</option>
          <option value={teamB.id}>{teamB.name}</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm text-gray-400">
          Upload Victory Screenshot (Must show KDA)
        </label>
        <input type="file" required accept="image/*" className="block w-full text-sm text-gray-400
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-600 file:text-white
          hover:file:bg-blue-700
        "/>
      </div>

      <button 
        disabled={loading}
        className="w-full bg-yellow-500 text-black font-bold py-3 rounded hover:bg-yellow-400 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Submit Proof"}
      </button>
    </form>
  );
}