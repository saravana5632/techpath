import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { Users, Shield, Settings, Search, Edit2, Trash2, X, Check, FolderOpen, Plus } from 'lucide-react';

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface ResourceData {
  _id: string;
  title: string;
  description: string;
  category: string;
  driveLink: string;
  thumbnail: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'resources'>('users');
  
  // User state
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');

  // Resource state
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceData | null>(null);
  const [resourceFormData, setResourceFormData] = useState({
    title: '',
    description: '',
    category: '',
    driveLink: '',
    thumbnail: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchResources();
  }, [user]);

  const fetchUsers = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources');
      if (res.ok) {
        setResources(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRole = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ role: editRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, role: editRole } : u));
        setEditingUser(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingResource ? `/api/resources/${editingResource._id}` : '/api/resources';
      const method = editingResource ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify(resourceFormData)
      });
      
      if (res.ok) {
        setIsResourceModalOpen(false);
        setEditingResource(null);
        setResourceFormData({ title: '', description: '', category: '', driveLink: '', thumbnail: '' });
        fetchResources();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      const res = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        setResources(resources.filter(r => r._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openEditResource = (resource: ResourceData) => {
    setEditingResource(resource);
    setResourceFormData({
      title: resource.title,
      description: resource.description || '',
      category: resource.category,
      driveLink: resource.driveLink || '',
      thumbnail: resource.thumbnail || ''
    });
    setIsResourceModalOpen(true);
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-blue-500/30">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        
        <div className="flex items-center gap-6 bg-[#0f0f12] border border-white/5 rounded-3xl p-8">
          <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center border-2 border-blue-500/20">
            <Settings className="w-10 h-10 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-gray-400 font-mono text-sm">Welcome back, {user?.fullName || user?.name}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-white/10 pb-2">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'users' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'resources' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Resources
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0f0f12] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Total Students</p>
                  <p className="text-2xl font-bold text-white">{totalStudents}</p>
                </div>
              </div>
              
              <div className="bg-[#0f0f12] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Total Admins</p>
                  <p className="text-2xl font-bold text-white">{totalAdmins}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f0f12] border border-white/5 rounded-3xl p-8 overflow-hidden flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-white">Manage Users</h2>
                <div className="relative group w-full sm:w-auto">
                  <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-64 bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-10 text-gray-500">Loading users...</div>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="text-xs text-gray-500 uppercase bg-black/40">
                      <tr>
                        <th className="px-4 py-3 rounded-l-xl">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Joined</th>
                        <th className="px-4 py-3 text-right rounded-r-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-4 text-white font-medium">{u.fullName}</td>
                          <td className="px-4 py-4 text-gray-400">{u.email}</td>
                          <td className="px-4 py-4">
                            {editingUser === u._id ? (
                              <select 
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-blue-500"
                              >
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {u.role}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-gray-500">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-right">
                            {editingUser === u._id ? (
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleUpdateRole(u._id)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"><Check className="w-4 h-4" /></button>
                                <button onClick={() => setEditingUser(null)} className="p-1.5 bg-gray-500/20 text-gray-400 rounded hover:bg-gray-500/30 transition-colors"><X className="w-4 h-4" /></button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => { setEditingUser(u._id); setEditRole(u.role); }} className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors" title="Edit Role">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors" title="Delete User">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Manage Resources</h2>
              <button 
                onClick={() => {
                  setEditingResource(null);
                  setResourceFormData({ title: '', description: '', category: '', driveLink: '', thumbnail: '' });
                  setIsResourceModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Resource
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map(resource => (
                <div key={resource._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white">{resource.title}</h3>
                    <p className="text-sm text-blue-400 mb-2">{resource.category}</p>
                    {resource.driveLink && <a href={resource.driveLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">Google Drive Link</a>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditResource(resource)} className="p-2 text-gray-400 hover:text-blue-400 bg-white/5 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteResource(resource._id)} className="p-2 text-gray-400 hover:text-rose-400 bg-white/5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {resources.length === 0 && <p className="text-gray-400">No resources found.</p>}
            </div>

            {/* Resource Modal */}
            {isResourceModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsResourceModalOpen(false)}></div>
                <div className="bg-[#0f0f12] border border-white/10 rounded-2xl p-6 w-full max-w-lg relative z-10">
                  <h3 className="text-xl font-bold text-white mb-6">{editingResource ? 'Edit Resource' : 'Add Resource'}</h3>
                  <form onSubmit={handleResourceSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                      <input type="text" required value={resourceFormData.title} onChange={e => setResourceFormData({...resourceFormData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                      <input type="text" required value={resourceFormData.category} onChange={e => setResourceFormData({...resourceFormData, category: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                      <textarea value={resourceFormData.description} onChange={e => setResourceFormData({...resourceFormData, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none h-24" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Google Drive Link</label>
                      <input type="url" value={resourceFormData.driveLink} onChange={e => setResourceFormData({...resourceFormData, driveLink: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail URL</label>
                      <input type="url" value={resourceFormData.thumbnail} onChange={e => setResourceFormData({...resourceFormData, thumbnail: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setIsResourceModalOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl font-medium transition-colors">Cancel</button>
                      <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-colors">{editingResource ? 'Update' : 'Create'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
