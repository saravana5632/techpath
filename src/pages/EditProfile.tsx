import React, { useState, useEffect } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import { useAuth } from '../hooks/useAuth';
import { User as UserIcon, Camera, Save, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    collegeName: '',
    registerNumber: '',
    department: '',
    year: '',
    skills: '',
    bio: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    profileImage: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            fullName: data.fullName || '',
            email: data.email || '',
            mobile: data.mobile || '',
            collegeName: data.collegeName || '',
            registerNumber: data.registerNumber || '',
            department: data.department || '',
            year: data.year?.toString() || '',
            skills: data.skills?.join(', ') || '',
            bio: data.bio || '',
            linkedinUrl: data.linkedinUrl || '',
            githubUrl: data.githubUrl || '',
            portfolioUrl: data.portfolioUrl || '',
            profileImage: data.profileImage || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      try {
        const res = await fetch('/api/users/profile/photo', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user?.token}`
          },
          body: formDataUpload
        });

        if (res.ok) {
          const data = await res.json();
          setFormData({ ...formData, profileImage: data.profileImage });
        } else {
          const data = await res.json();
          setError(data.message || 'Failed to upload photo');
        }
      } catch (err: any) {
        setError('Error uploading photo');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year) || undefined,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        updateUser(data); // update context
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-blue-500/30">
      <StudentNavbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate('/student-dashboard')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-[#0f0f12] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h1 className="text-2xl font-bold text-white mb-8">Edit Profile</h1>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Profile updated successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            
            {/* Photo Upload */}
            <div className="flex items-center gap-6">
              <div className="relative group w-24 h-24 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10 text-gray-500" />
                )}
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
              <div>
                <h3 className="font-semibold text-white">Profile Photo</h3>
                <p className="text-sm text-gray-500 mt-1">Upload a professional photo or use an avatar. Max 5MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Email (Read Only)</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Mobile Number</label>
                <input 
                  type="text" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Register Number</label>
                <input 
                  type="text" 
                  name="registerNumber"
                  value={formData.registerNumber}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">College Name</label>
                <input 
                  type="text" 
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Department</label>
                <input 
                  type="text" 
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Year</label>
                <input 
                  type="number" 
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Skills (comma separated)</label>
                <input 
                  type="text" 
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Node.js, Python"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Bio</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell us a bit about yourself..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">LinkedIn URL</label>
                <input 
                  type="url" 
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">GitHub URL</label>
                <input 
                  type="url" 
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Portfolio URL</label>
                <input 
                  type="url" 
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="pt-6 flex items-center justify-end gap-4 border-t border-white/5">
              <button 
                type="button"
                onClick={() => navigate('/student-dashboard')}
                className="px-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
