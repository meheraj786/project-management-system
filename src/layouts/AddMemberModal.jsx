import React, { useState } from 'react';
import { X, User, Mail, Briefcase, Phone, MapPin, Calendar, Lock, Eye, EyeOff, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { useSelector } from 'react-redux';

export const AddMemberModal = ({ onClose, onAddMember }) => {
  
  const data = useSelector((state) => state.userInfo.value);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profileImage: '',
    role: '',
    phone: '',
    department: '',
    joinDate: new Date().toISOString().split('T')[0],
  });
  const db= getDatabase()

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

    const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "e-com app with firebase");
    data.append("cloud_name", "dlrycnxnh");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlrycnxnh/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();

    setFormData((prev) => ({
      ...prev,
      profileImage: result.secure_url,
    }));
    setImagePreview(result.secure_url);
  };

  const departments = [
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations'
  ];

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'Product Manager',
    'Project Manager',
    'Marketing Specialist',
    'Sales Representative',
    'HR Manager',
    'Financial Analyst'
  ];

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newMember = {
        id: Date.now(),
        ...formData,
        avatar: formData.name.charAt(0).toUpperCase(),
        color: randomColor,
        status: 'Active'
      };

            const auth = getAuth();
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(auth.currentUser, {
            displayName: `${formData.firstName} ${formData.lastName}`,
            photoURL: formData.profileImage,
            businessType: formData.businessType,
            role: formData.role,
            companyName: formData.companyName,
          }).then(() => {
            set(ref(db, "users/" + user.uid), {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              profileImage: formData.profileImage,
              businessType: formData.businessType,
              role: formData.role,
              companyName: formData.companyName,
              adminId: data?.uid
            });
            onClose()
            toast.success("Member Successfully Created!");
          });
        })
        .catch((error) => {
          const errorMessage = error.message;
          toast.error(errorMessage);
          // ..
        });
      
      onAddMember(newMember);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: '',
      phone: '',
      department: '',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: ''
    });
    setErrors({});
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Member</h2>
            <p className="text-gray-600 mt-1">Create a new team member account</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Account Info Notice */}
        <div className="mx-6 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Account Creation</h4>
            <p className="text-sm text-blue-700">
              This will create a new member account. The member can use their email and password to log in to the system and access their dashboard.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
                              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="profile-image"
                        />
                        <label
                          htmlFor="profile-image"
                          className="cursor-pointer bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300 inline-flex items-center space-x-2"
                        >
                          <Camera className="h-4 w-4" />
                          <span>Choose Image</span>
                        </label>
                      </div>
                    </div>
                  </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              <p className="text-xs text-gray-500 mt-1">This will be their login email</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-500">Minimum 8 characters</p>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-xs text-primary hover:text-primary/80 underline"
                >
                  Generate Random
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Role/Position *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>

            {/* Join Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Join Date
              </label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Preview */}
          {formData.name && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Member Preview</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{formData.name}</h4>
                  {formData.role && <p className="text-primary text-sm">{formData.role}</p>}
                  {formData.department && <p className="text-gray-600 text-sm">{formData.department}</p>}
                  {formData.email && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                      <p className="text-blue-700">
                        <strong>Login Credentials:</strong> {formData.email}
                        {formData.password && ` / ${formData.password}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Login Instructions */}
          {formData.email && formData.password && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-2">
                📧 Member Login Instructions
              </h4>
              <p className="text-sm text-green-700 mb-3">
                Share these credentials with the new member:
              </p>
              <div className="bg-white p-3 rounded border border-green-200 text-sm">
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Password:</strong> {formData.password}</p>
                <p className="text-gray-600 mt-2">
                  They can use these credentials to log in to their account and access the system.
                </p>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary text-white rounded-lg transition-colors font-medium"
            >
              Create Member Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};