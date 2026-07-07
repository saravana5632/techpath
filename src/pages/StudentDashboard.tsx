import React, { useState, useEffect } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import { useAuth } from '../hooks/useAuth';
import { User as UserIcon, Code2, Building2, BookOpen, Trophy, ArrowRight, Activity, Calendar, Clock, Edit2 } from 'lucide-react';
import ProgressChart from '../components/ProgressChart';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<any>({
    completedCourses: 0,
    practiceSolved: 0,
    certificates: 0,
    companiesApplied: 0,
    profileCompletion: 30,
    notifications: []
  });

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch('/api/student-progress', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProgress(data);
        }
      } catch (err) {
        console.error('Failed to fetch progress', err);
      }
    };
    fetchProgress();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-blue-500/30">
      <StudentNavbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-[#0f0f12] to-[#1a1a24] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center border-2 border-blue-500/20 overflow-hidden">
              {user?.photoURL || user?.profileImage ? (
                <img src={user.photoURL || user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-blue-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user?.fullName || user?.name}</h1>
              <p className="text-blue-300/80 font-medium">Software Engineering Student • Class of {user?.year || '2025'}</p>
              <div className="mt-2 text-sm text-gray-400 font-mono flex items-center gap-4">
                <span>{user?.collegeName || 'Tech University'}</span>
                <span>•</span>
                <span>{user?.department || 'Computer Science'}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">Profile Complete</p>
                <p className="text-xl font-bold text-white">{progress.profileCompletion || 30}%</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-3 flex items-center gap-2 transition-colors border border-white/10"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#0f0f12] border border-white/5 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Code2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Problems Solved</p>
              <p className="text-2xl font-bold text-white">{progress.practiceSolved || 0} <span className="text-sm font-normal text-gray-500">/ 150</span></p>
            </div>
          </div>
          
          <div className="bg-[#0f0f12] border border-white/5 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Building2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Applications</p>
              <p className="text-2xl font-bold text-white">{progress.companiesApplied || 0}</p>
            </div>
          </div>

          <div className="bg-[#0f0f12] border border-white/5 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
              <Activity className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Certificates</p>
              <p className="text-2xl font-bold text-white">{progress.certificates || 0}</p>
            </div>
          </div>

          <div className="bg-[#0f0f12] border border-white/5 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <BookOpen className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Resources Completed</p>
              <p className="text-2xl font-bold text-white">{progress.completedCourses || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Progress Chart */}
            <div className="bg-[#0f0f12] border border-white/5 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">Learning Progress</h2>
                <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-400 focus:outline-none focus:border-blue-500">
                  <option>Last 30 Days</option>
                  <option>This Week</option>
                  <option>All Time</option>
                </select>
              </div>
              <ProgressChart progress={progress} />
            </div>

            {/* Practice Problems */}
            <div className="bg-[#0f0f12] border border-white/5 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  Recommended Practice
                </h2>
                <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {progress.practiceProblems && progress.practiceProblems.length > 0 ? (
                  progress.practiceProblems.map((problem: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                      <div>
                        <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors">{problem.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-mono">
                          <span className={`${problem.difficulty === 'Easy' ? 'text-emerald-400' : problem.difficulty === 'Hard' ? 'text-rose-400' : 'text-amber-400'}`}>{problem.difficulty}</span>
                          <span>•</span>
                          <span>{problem.topic}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {problem.timeEstimate || '15 mins'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 text-center py-8">
                    No practice problems available yet. <br/>
                    <a href="#practice" className="text-blue-400 hover:underline mt-2 inline-block">Start practicing now</a>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Active Applications */}
            <div className="bg-[#0f0f12] border border-white/5 rounded-3xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-purple-400" />
                Company Applications
              </h2>
              <div className="space-y-4">
                {progress.applications && progress.applications.length > 0 ? (
                  progress.applications.map((app: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-2">
                          {app.companyId?.logo ? (
                            <img src={app.companyId.logo} alt={app.companyId.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="font-bold text-black text-xl">{app.companyId?.name?.[0]}</span>
                          )}
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          app.status === 'Selected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          app.status === 'Interview' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          app.status === 'Under Review' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>{app.status}</span>
                      </div>
                      <h3 className="font-semibold text-gray-200">{app.roleTitle}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {app.interviewDate ? `Interview on: ${new Date(app.interviewDate).toLocaleDateString()}` : `Applied: ${new Date(app.appliedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 text-center py-6">
                    You haven't applied to any companies yet.
                  </div>
                )}
              </div>
              <button className="w-full mt-4 py-2.5 text-sm font-medium text-gray-400 bg-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-colors">
                View All Companies
              </button>
            </div>

            {/* Upcoming Resources/Events */}
            <div className="bg-[#0f0f12] border border-white/5 rounded-3xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-amber-400" />
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {progress.notifications && progress.notifications.length > 0 ? (
                  progress.notifications.map((event: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-black/40 rounded-lg flex flex-col items-center justify-center border border-white/5 shrink-0">
                        <span className="text-xs text-gray-500 uppercase">New</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-200">{event.title}</h4>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 text-center py-6">
                    No upcoming events.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
