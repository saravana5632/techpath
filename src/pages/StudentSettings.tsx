import React from 'react';
import StudentNavbar from '../components/StudentNavbar';

export default function StudentSettings() {
  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-blue-500/30">
      <StudentNavbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <p className="text-gray-400">Account settings will appear here.</p>
        </div>
      </main>
    </div>
  );
}
