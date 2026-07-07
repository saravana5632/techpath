import React, { useEffect, useState } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import { useAuth } from '../hooks/useAuth';

export default function StudentPractice() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchProblems();
  }, [user]);

  const fetchProblems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/practice-problems', {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {}
      });
      if (res.ok) {
        setProblems(await res.json());
      } else {
        setError('Failed to fetch practice problems.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching problems.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-blue-500/30">
      <StudentNavbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Practice Problems</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading problems...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : problems.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-gray-400">No practice problems available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {problems.map(problem => (
              <div key={problem._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/10 transition-colors">
                <div>
                  <h3 className="text-xl font-bold text-white">{problem.title}</h3>
                  <div className="flex gap-2 items-center mt-2 text-sm">
                    <span className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">{problem.topic}</span>
                    <span className={`px-2 py-1 rounded-md ${
                      problem.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10' :
                      problem.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10' :
                      'text-rose-400 bg-rose-500/10'
                    }`}>{problem.difficulty}</span>
                    <span className="text-gray-500">{problem.timeEstimate || '15 mins'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">Solve</button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">View Solution</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
