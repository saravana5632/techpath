import React, { useEffect, useState } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import { useAuth } from '../hooks/useAuth';
import { ExternalLink, FolderOpen } from 'lucide-react';

export default function StudentResources() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchResources();
  }, [user]);

  const fetchResources = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/resources', {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {}
      });
      if (res.ok) {
        setResources(await res.json());
      } else {
        setError('Failed to fetch resources.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching resources.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-blue-500/30">
      <StudentNavbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Resources</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading resources...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 flex items-center justify-center rounded-2xl mb-4">
              <FolderOpen className="w-8 h-8" />
            </div>
            <p className="text-gray-400 text-lg">No resources available.</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for new materials.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => (
              <div key={resource._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:bg-white/10 transition-colors">
                {resource.thumbnail ? (
                  <img src={resource.thumbnail} alt={resource.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-blue-900/10 flex items-center justify-center border-b border-white/10">
                    <FolderOpen className="w-12 h-12 text-blue-500/30" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">{resource.category}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-3">{resource.description || resource.summary}</p>
                  {resource.driveLink && (
                    <a 
                      href={resource.driveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors mt-auto"
                    >
                      Open Resource
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
