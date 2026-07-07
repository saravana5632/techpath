import React from 'react';
import { 
  Code2, 
  Building, 
  Compass, 
  FileText, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import CodeSandbox from '../components/CodeSandbox';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-blue-500/30">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-12">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Master your CS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">placements.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            A simple, highly-curated placement guide providing essential curriculum tracks, company-specific preparation patterns, and standard resume templates for SDE roles.
          </p>
          <div className="pt-4">
            <a href="#curriculum" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer">
              Explore Guide <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Modules / Curriculum Section */}
        <section id="curriculum" className="space-y-8 pt-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">Curriculum Tracks</span>
            <h2 className="text-2xl font-bold text-white">What you need to know</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0f0f12] border border-white/5 p-8 rounded-3xl hover:border-blue-500/30 transition-colors group">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Data Structures & Algorithms</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Focus on the most frequently asked patterns: Sliding Window, Two Pointers, BFS/DFS traversals, and Dynamic Programming. Stop grinding blindly and study the archetypes.
              </p>
              <ul className="space-y-3">
                {['Array Manipulation Patterns', 'Graph Traversal (BFS/DFS)', 'Dynamic Programming Basics'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0f0f12] border border-white/5 p-8 rounded-3xl hover:border-purple-500/30 transition-colors group">
              <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">CS Fundamentals</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Core theoretical concepts tested in almost every technical interview. OS concepts, DBMS normalization, and Computer Networks.
              </p>
              <ul className="space-y-3">
                {['OS: Threading & Deadlocks', 'DBMS: Normalization & SQL Queries', 'CN: OSI Model & Protocols'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Companies Section */}
        <section id="companies" className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">Target Profiles</span>
            <h2 className="text-2xl font-bold text-white">Top Company Preparation</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Google', roles: 'SDE, SWE Intern', tags: ['Graphs', 'DP', 'System Design'] },
              { name: 'Amazon', roles: 'SDE-1, SDE-2', tags: ['Trees', 'Leadership Principles'] },
              { name: 'Goldman Sachs', roles: 'Analyst, Associate', tags: ['Math', 'Arrays', 'Puzzles'] }
            ].map((company, i) => (
              <div key={i} className="bg-[#0f0f12] border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <Building className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-lg">{company.name}</h4>
                <span className="text-xs text-gray-500 mb-4">{company.roles}</span>
                <div className="flex flex-wrap justify-center gap-2 mt-auto">
                  {company.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Code Sandbox Section */}
        <section id="sandbox" className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">Practice Arena</span>
            <h2 className="text-2xl font-bold text-white">Interactive Compiler</h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              Test your logic directly in the browser. Select a basic problem from the list, write your JavaScript solution, and execute it in our secure client-side runtime.
            </p>
          </div>
          <CodeSandbox />
        </section>

        {/* Resume & ATS Section */}
        <section id="resources" className="bg-gradient-to-br from-blue-900/20 to-blue-600/10 border border-blue-500/20 rounded-3xl p-8 md:p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">ATS-Friendly Resume Guidelines</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm leading-relaxed">
            Avoid fancy graphics or two-column layouts. Keep it single-column, use simple fonts like Arial or Times New Roman, and ensure your bullet points highlight your impact using the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]."
          </p>
          <div className="pt-2">
            <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border border-white/10">
              Download Standard Template
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 mt-12 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <span>&copy; 2026 TechPath. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="https://saravana5632.github.io/portfolio/#contact" className="hover:text-gray-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
