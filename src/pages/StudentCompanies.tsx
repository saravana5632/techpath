import React, { useEffect, useState } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import { useAuth } from '../hooks/useAuth';

export default function StudentCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchCompanies();
  }, [user]);

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/companies', {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {}
      });
      if (res.ok) {
        setCompanies(await res.json());
      } else {
        setError('Failed to fetch companies.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching companies.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-blue-500/30">
      <StudentNavbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Companies</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading companies...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-gray-400">No companies available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map(company => (
              <div key={company._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col hover:bg-white/10 transition-colors">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{company.name}</h3>
                  <p className="text-blue-400 text-sm mb-2">{company.industry}</p>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{company.description}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm font-medium transition-colors">View Details</button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">Apply</button>
                  <button className="flex-1 border border-white/10 hover:bg-white/5 text-white py-2 rounded-lg text-sm font-medium transition-colors">Save</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
