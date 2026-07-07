import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { ArrowLeft, Code2, Clock, Trophy, ChevronRight } from 'lucide-react';

interface CodeProgress {
  id: string; // e.g., 'two-sum_javascript'
  code: string;
  updatedAt: string;
  lastExecutionTime?: number;
}

interface UserProfileProps {
  onBack?: () => void;
  hideBackButton?: boolean;
}

export default function UserProfile({ onBack, hideBackButton }: UserProfileProps) {
  const { user } = useAuth();
  const [progressList, setProgressList] = useState<CodeProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'users', user.uid, 'code_progress'));
        const querySnapshot = await getDocs(q);
        const data: CodeProgress[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as CodeProgress);
        });
        // Sort by most recent
        data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setProgressList(data);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-400">Please sign in to view your profile.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-white">Go Back</button>
      </div>
    );
  }

  // Calculate some dummy stats based on progress
  const uniqueProblems = new Set(progressList.map(p => p.id.split('_')[0])).size;
  
  const executionTimes = progressList.map(p => p.lastExecutionTime).filter(t => t !== undefined) as number[];
  const avgExecutionTime = executionTimes.length > 0 
    ? Math.round(executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length) 
    : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      {!hideBackButton && onBack && (
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-6 bg-[#0f0f12] border border-white/5 rounded-3xl p-8">
        <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="Profile" className="w-20 h-20 rounded-2xl border-2 border-white/10" />
        <div>
          <h1 className="text-2xl font-bold text-white">{user.displayName || 'Developer'}</h1>
          <p className="text-gray-400 font-mono text-sm">{user.email}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f0f12] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Problems Tried</p>
            <p className="text-2xl font-bold text-white">{uniqueProblems}</p>
          </div>
        </div>
        <div className="bg-[#0f0f12] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Saved Snippets</p>
            <p className="text-2xl font-bold text-white">{progressList.length}</p>
          </div>
        </div>
        <div className="bg-[#0f0f12] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Avg Runtime</p>
            <p className="text-2xl font-bold text-white">{avgExecutionTime ? `~${avgExecutionTime}ms` : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Saved Code Snippets */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          Saved Progress
        </h2>
        
        {loading ? (
          <div className="text-center py-12 text-gray-500 animate-pulse">Loading progress...</div>
        ) : progressList.length === 0 ? (
          <div className="bg-[#0f0f12] border border-white/5 rounded-2xl p-12 text-center text-gray-500 border-dashed">
            You haven't saved any code snippets yet. Head to the Practice Arena to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progressList.map((progress) => {
              const [problemId, lang] = progress.id.split('_');
              return (
                <div key={progress.id} className="bg-[#0f0f12] border border-white/5 rounded-2xl overflow-hidden flex flex-col hover:border-white/10 transition-colors">
                  <div className="px-6 py-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-200 capitalize">{problemId.replace('-', ' ')}</h3>
                      <p className="text-xs font-mono text-gray-500">{new Date(progress.updatedAt).toLocaleDateString()} • {lang}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-[#0a0a0c] flex-1">
                    <pre className="text-xs font-mono text-gray-400 overflow-x-auto whitespace-pre-wrap max-h-32">
                      {progress.code}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
