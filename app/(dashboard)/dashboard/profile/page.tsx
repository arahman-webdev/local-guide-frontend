// app/profile/page.tsx
"use client";

import { getMyProfile } from '@/app/utils/auth';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { 
  User, Mail, Phone, MapPin, Calendar, Shield, 
  Edit2, Save, X, Globe, Award, Star, Users,
  CreditCard, Clock, CheckCircle, Award as Trophy,
  Camera, Upload, Trash2, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePic: string;
  bio?: string;
  role: 'TOURIST' | 'GUIDE' | 'ADMIN';
  address?: string;
  city?: string;
  country?: string;
  joinedAt: string;
  verified: boolean;
  totalReviews?: number;
  averageRating?: number;
  totalBookings?: number;
  languages?: string[];
  specialties?: string[];
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export default function ProfilePage() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMyProfile();
        setUser(response?.data || null);
        setEditForm(response?.data || {});
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [pathname]);

  const handleEditToggle = () => {
    if (editing) {
      setEditForm(user || {});
      setNewImage(null);
      setImagePreview(null);
    }
    setEditing(!editing);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setNewImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageRemove = () => {
    setNewImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


// In your frontend handleSaveProfile function:
const handleSaveProfile = async () => {
  try {
    setSaving(true);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      toast.error('Please login again');
      return;
    }

    const formData = new FormData();
    
    // Add profile data as JSON
    formData.append('data', JSON.stringify(editForm));
    
    // Add image file if selected
    if (newImage) {
      formData.append('image', newImage);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/${user?.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        // DON'T set Content-Type for FormData - browser will set it automatically
      },
      body: formData,
    });

    const result = await res.json();
    
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update profile');
    }

    // Update local state
    if (result.data) {
      setUser(result.data);
      setEditForm(result.data);
      
      // Clear image states
      if (newImage) {
        toast.success('Profile picture updated!');
      }
      setNewImage(null);
      setImagePreview(null);
      
      setEditing(false);
      toast.success('Profile updated successfully!');
    }
  } catch (error: any) {
    toast.error(error.message || 'Failed to update profile');
  } finally {
    setSaving(false);
  }
};

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'GUIDE': return 'bg-linear-to-r from-cyan-500 to-blue-500';
      case 'ADMIN': return 'bg-linear-to-r from-purple-500 to-pink-500';
      default: return 'bg-linear-to-r from-green-500 to-emerald-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'GUIDE': return <Award className="h-4 w-4" />;
      case 'ADMIN': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <Button onClick={() => router.push('/login')}>Login Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-blue-50/30 pb-16">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-blue-600 via-cyan-500 to-blue-700 pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-32 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
            {/* Profile Header with Image Upload */}
            <div className="flex items-center gap-6 md:gap-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="relative group"
              >
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden">
                  <Image
                    src={imagePreview || user.profilePic || '/default-user.jpg'}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Edit Overlay */}
                  {editing && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <Camera className="h-8 w-8 text-white mb-1" />
                      <span className="text-white text-xs font-medium">Change Photo</span>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                {editing && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-full border-4 border-white hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  </>
                )}

                {user.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-white z-10">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
              </motion.div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {editing ? (
                      <Input
                        value={editForm.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-3xl font-bold bg-white/10 border-white/30 text-white placeholder-white/70"
                        placeholder="Your Name"
                      />
                    ) : (
                      user.name
                    )}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 ${getRoleBadgeColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    {user.role}
                  </span>
                </div>
                
                {editing ? (
                  <div className="space-y-2">
                    <Input
                      value={editForm.email || ''}
                      readOnly
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder-white/70"
                      placeholder="Email"
                    />
                    <Input
                      value={editForm.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder-white/70"
                      placeholder="Phone"
                    />
                  </div>
                ) : (
                  <div className="space-y-1 text-white/90">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {editing ? (
                <>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving || uploadingImage}
                    className="bg-white text-blue-600 hover:bg-white/90 shadow-lg"
                  >
                    {saving || uploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        {uploadingImage ? 'Uploading...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleEditToggle}
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEditToggle}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Image Upload Progress */}
          {uploadingImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto"
            >
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Uploading profile picture...</p>
                  <div className="h-1 bg-white/30 rounded-full overflow-hidden mt-1">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-1">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Activity Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-linear-to-r from-blue-50 to-cyan-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Star className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {user.averageRating?.toFixed(1) || 'N/A'}
                        <span className="text-sm text-gray-500">/5</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-linear-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Reviews</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {user.totalReviews || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-linear-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {user.totalBookings || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Image Upload Instructions */}
            {editing && newImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  New Profile Picture
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview || ''}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {newImage.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {(newImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleImageRemove}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Click save to update your profile picture
                  </p>
                </div>
              </motion.div>
            )}

            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(user.joinedAt)}
                    </p>
                  </div>
                </div>

                {user.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      {editing ? (
                        <Textarea
                          value={editForm.address || ''}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="mt-1"
                          placeholder="Your address"
                          rows={2}
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{user.address}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    {editing ? (
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Input
                          value={editForm.city || ''}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="City"
                        />
                        <Input
                          value={editForm.country || ''}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          placeholder="Country"
                        />
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900">
                        {user.city || 'Not specified'}, {user.country || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

        
          </div>

          {/* Right Column - Tabs & Bio */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
            >
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-14">
                  <TabsTrigger 
                    value="about" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full px-6"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger 
                    value="activity" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full px-6"
                  >
                    Activity
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full px-6"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="p-6">
                  <div className="space-y-6">
                    {/* Bio Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Bio</h3>
                        {editing && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => router.push('/profile/bio')}
                            className="text-blue-600"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Bio
                          </Button>
                        )}
                      </div>
                      {editing ? (
                        <Textarea
                          value={editForm.bio || ''}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={6}
                          className="w-full"
                        />
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {user.bio || 'No bio provided yet. Click edit to add a bio.'}
                        </p>
                      )}
                    </div>

                    {/* Image Upload Tips */}
                    {editing && (
                      <div className="p-4 rounded-lg bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          Profile Picture Tips
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Use a clear, well-lit headshot</li>
                          <li>• Smile and look friendly</li>
                          <li>• Maximum file size: 5MB</li>
                          <li>• Supported formats: JPG, PNG, WebP</li>
                          <li>• Square images work best</li>
                        </ul>
                      </div>
                    )}

                    {/* Social Links */}
                    {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Social Links</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {user.socialLinks.website && (
                            <a
                              href={user.socialLinks.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors"
                            >
                              <Globe className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-medium text-gray-900">Website</p>
                                <p className="text-sm text-gray-600 truncate">
                                  {user.socialLinks.website.replace(/^https?:\/\//, '')}
                                </p>
                              </div>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="p-6">
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto bg-linear-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-6">
                      <Clock className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Activity Coming Soon</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Your recent activities, bookings, and reviews will appear here.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Account Settings</h3>
                    <div className="grid gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Security</h4>
                        <p className="text-sm text-gray-600 mb-3">Manage your password and security settings</p>
                        <Button variant="outline" size="sm">Change Password</Button>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Notifications</h4>
                        <p className="text-sm text-gray-600 mb-3">Control your notification preferences</p>
                        <Button variant="outline" size="sm">Notification Settings</Button>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Privacy</h4>
                        <p className="text-sm text-gray-600 mb-3">Manage your privacy settings</p>
                        <Button variant="outline" size="sm">Privacy Settings</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Recent Achievements */}
            {user.role === 'GUIDE' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  Guide Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600 mb-1">⭐ 5.0</div>
                    <p className="text-sm text-gray-600">Perfect Rating Streak</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600 mb-1">50+</div>
                    <p className="text-sm text-gray-600">Tours Conducted</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600 mb-1">98%</div>
                    <p className="text-sm text-gray-600">Satisfaction Rate</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}