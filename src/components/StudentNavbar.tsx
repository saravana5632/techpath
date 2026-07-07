import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, LogOut, LayoutDashboard, Building2, Code2, 
  BookOpen, FolderOpen, FileText, Award, User as UserIcon, 
  Settings, Bell, HelpCircle, Menu, X, ChevronDown, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function StudentNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainNavLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Companies', path: '/student/companies', icon: Building2 },
    { name: 'Practice', path: '/student/practice', icon: Code2 },
    { name: 'Learning', path: '/student/learning', icon: BookOpen },
    { name: 'Resources', path: '/student/resources', icon: FolderOpen },
  ];

  const moreNavLinks = [
    { name: 'My Applications', path: '/student/applications', icon: FileText },
    { name: 'Certificates', path: '/student/certificates', icon: Award },
  ];

  const allNavLinks = [...mainNavLinks, ...moreNavLinks];

  const profileLinks = [
    { name: 'My Profile', path: '/profile/edit', icon: UserIcon },
    { name: 'Settings', path: '/student/settings', icon: Settings },
    { name: 'Notifications', path: '/student/notifications', icon: Bell },
    { name: 'Help', path: '/student/help', icon: HelpCircle },
  ];

  return (
    <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base text-white tracking-tight block">TechPath</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-mono">Curriculum & Placement</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 mx-6 flex-1 justify-center">
          {mainNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
          
          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                moreNavLinks.some(link => location.pathname === link.path) ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
              More
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            
            {isMoreDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMoreDropdownOpen(false)}></div>
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#0f0f12] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                  {moreNavLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsMoreDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          isActive ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {link.name}
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </nav>

        {/* User Profile & Mobile Toggle */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Notifications (Desktop) */}
          <Link to="/student/notifications" className="hidden sm:flex relative items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#050505]"></span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative hidden sm:block">
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 pl-4 border-l border-white/10 focus:outline-none"
            >
              <div className="flex items-center gap-2 text-left">
                <img 
                  src={user?.profileImage || user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}`} 
                  alt="avatar" 
                  className="w-9 h-9 rounded-full border border-white/10 object-cover" 
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white leading-tight">{user?.fullName || user?.displayName || user?.name || 'Student'}</p>
                  <p className="text-xs text-gray-500 font-mono">{user?.registerNumber || 'Student'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-56 bg-[#0f0f12] border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden py-2">
                  <div className="px-4 py-3 border-b border-white/5 mb-2 md:hidden">
                    <p className="text-sm font-medium text-white">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  {profileLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          location.pathname === link.path ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-gray-400" />
                        {link.name}
                      </Link>
                    )
                  })}
                  <div className="h-px bg-white/5 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-16 left-0 right-0 bg-[#0f0f12] border-b border-white/10 shadow-2xl overflow-y-auto transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[calc(100vh-4rem)] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="px-4 py-6 space-y-1">
          {/* User Info Mobile */}
          <div className="flex items-center gap-4 p-4 mb-4 bg-white/5 rounded-xl border border-white/5">
            <img 
              src={user?.profileImage || user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}`} 
              alt="avatar" 
              className="w-12 h-12 rounded-full border border-white/10 object-cover" 
            />
            <div>
              <p className="font-semibold text-white">{user?.fullName || user?.displayName || user?.name || 'Student'}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-2">Navigation</div>
          {allNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                {link.name}
              </Link>
            );
          })}
          
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6 px-2">Account</div>
          {profileLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                {link.name}
              </Link>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
