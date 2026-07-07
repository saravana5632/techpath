import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Lock, Mail, Shield, User as UserIcon, GraduationCap, Building2, Hash, BookOpen, Calendar, Phone } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    collegeName: '',
    registerNumber: '',
    department: '',
    year: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptedTerms) {
      setError('You must accept the Terms & Conditions.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year) || 1
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await login(data);
        navigate('/student/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0B1120] font-sans selection:bg-blue-500/30">
      
      {/* LEFT SIDE - Hero & Features */}
      <div className="relative w-full md:w-5/12 flex flex-col justify-center p-8 lg:p-16 overflow-hidden bg-gradient-to-br from-[#1E3A8A] to-[#0B1120]">
        
        {/* Subtle wave patterns and glowing effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[140px]"></div>
          
          <svg className="absolute bottom-0 left-0 w-full text-white/5" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="relative z-10 max-w-lg mx-auto md:mx-0">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">TechPath</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Join TechPath Today
          </h1>
          <p className="text-blue-200 text-lg mb-12 leading-relaxed">
            Create an account to start your personalized learning and placement journey.
          </p>

          <div className="space-y-6">
            <div className="flex gap-5 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl hover:bg-white/10 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Admin</h3>
                <p className="text-blue-200/80 leading-relaxed text-sm">
                  Access and manage the platform, students, companies and resources. Only an existing admin can approve admin accounts.
                </p>
              </div>
            </div>

            <div className="flex gap-5 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl hover:bg-white/10 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Student</h3>
                <p className="text-blue-200/80 leading-relaxed text-sm">
                  Access learning resources, practice coding, apply to companies and track your progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Registration Form */}
      <div className="w-full md:w-7/12 flex flex-col justify-center p-6 sm:p-10 lg:p-16 relative overflow-y-auto max-h-screen">
        <div className="w-full max-w-2xl mx-auto">
          
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[20px] shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create Account</h2>
              <p className="text-gray-400 text-sm">Fill in the details below to register.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full bg-[#0B1120]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:bg-[#0B1120]/80" placeholder="John Doe" />
                  </div>
                </div>

                {/* College Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">College Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input type="text" name="collegeName" required value={formData.collegeName} onChange={handleChange} className="w-full bg-[#0B1120]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:bg-[#0B1120]/80" placeholder="Tech University" />
                  </div>
                </div>

                {/* Register Number */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Register Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Hash className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input type="text" name="registerNumber" required value={formData.registerNumber} onChange={handleChange} className="w-full bg-[#0B1120]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:bg-[#0B1120]/80" placeholder="REG123456" />
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Department</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <BookOpen className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input type="text" name="department" required value={formData.department} onChange={handleChange} className="w-full bg-[#0B1120]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:bg-[#0B1120]/80" placeholder="Computer Science" />
                  </div>
                </div>

                {/* Year */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Year</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <select name="year" required value={formData.year} onChange={handleChange} className="w-full bg-[#0B1120]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:bg-[#0B1120]/80 appearance-none">
                      <option value="" disabled className="bg-gray-900">Select Year</option>
                      <option value="1" className="bg-gray-900">1st Year</option>
                      <option value="2" className="bg-gray-900">2nd Year</option>
                      <option value="3" className="bg-gray-900">3rd Year</option>
                      <option value="4" className="bg-gray-900">4th Year</option>
                    </select>
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Mobile Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} className="w-full bg-[#0B1120]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:bg-[#0B1120]/80" placeholder="+1 234 567 890" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-[#0B1120]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:bg-[#0B1120]/80" placeholder="student@techpath.com" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input type={showPassword ? 'text' : 'password'} name="password" required minLength={8} value={formData.password} onChange={handleChange} className="w-full bg-[#0B1120]/50 border border-white/10 rounded-xl pl-11 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:bg-[#0B1120]/80" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" required minLength={8} value={formData.confirmPassword} onChange={handleChange} className="w-full bg-[#0B1120]/50 border border-white/10 rounded-xl pl-11 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:bg-[#0B1120]/80" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-rose-400 text-sm font-medium text-center bg-rose-500/10 py-2.5 rounded-xl border border-rose-500/20">
                  {error}
                </div>
              )}

              {/* Accept Terms */}
              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="appearance-none w-4 h-4 border border-white/20 rounded bg-[#0B1120]/50 checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer focus:ring-1 focus:ring-blue-500" />
                    {acceptedTerms && (
                      <svg className="absolute w-3 h-3 text-white left-0.5 top-0.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    I accept the <a href="#" className="text-blue-400 hover:text-blue-300">Terms & Conditions</a>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1E3A8A] hover:to-[#2563EB] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-400">
                Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Login here</Link>
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
