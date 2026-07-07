import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base text-white tracking-tight block">TechPath</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-mono">Curriculum & Placement</span>
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-6 text-sm font-semibold text-gray-400">
          
          {user && (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin/dashboard" className="hover:text-white transition-colors text-blue-400">Admin Panel</Link>
              ) : (
                <Link to="/student/dashboard" className="hover:text-white transition-colors text-blue-400">My Progress</Link>
              )}
              <a href="/#companies" className="hover:text-white transition-colors">Companies</a>
              <a href="/#sandbox" className="hover:text-white transition-colors">Practice</a>
              <a href="/#resources" className="hover:text-white transition-colors">Resources</a>
              
              <div className="pl-4 border-l border-white/10 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <img src={user.profileImage || user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="avatar" className="w-8 h-8 rounded-full border border-white/10 object-cover" />
                    <span className="text-xs font-mono text-gray-300 hidden md:block">{user.fullName || user.displayName || user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose-400 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span className="sr-only">Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {!user && (
            <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
              Login
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}
