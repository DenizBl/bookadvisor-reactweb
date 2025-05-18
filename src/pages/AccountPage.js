import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUser, updateUser } from '../services/userService';
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

// İkonlar (SVG olarak)
const UserIcon = ({ className = "h-5 w-5 text-gray-500" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const MailIcon = ({ className = "h-5 w-5 text-gray-500" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const InfoIcon = ({ className = "h-5 w-5 text-gray-500" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

const PencilIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const SaveIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const CameraIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

export default function AccountPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    firstLast: '',
    email: '',
    role: '',
    about: '',
    signUpDate: '',
    boardIds: [],
    profilePictureUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        const data = await getUser(currentUser.uid);
        setUserData({
          ...data,
          email: currentUser.email
        });
        setEditedData({
          ...data,
          email: currentUser.email
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out!');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out.');
      console.error("Logout error:", error);
    }
  };

  const handleEditProfile = () => {
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateUser(currentUser.uid, {
        firstName: editedData.firstName,
        lastName: editedData.lastName,
        about: editedData.about,
        profilePictureUrl: editedData.profilePictureUrl
      });
      
      setUserData(editedData);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedData(userData);
    setEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageClick = () => {
    if (editing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      
      // Create a storage reference
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}/${file.name}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update the edited data with the new image URL
      setEditedData(prev => ({
        ...prev,
        profilePictureUrl: downloadURL
      }));

      toast.success('Profile picture uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 p-10 bg-white shadow-xl rounded-2xl">
        <h2 className="text-center text-4xl font-bold text-gray-800 mb-10">
          Account
        </h2>

        <div className="relative w-36 h-36 mx-auto mb-8">
          <div 
            onClick={handleImageClick}
            className={`relative w-full h-full rounded-full overflow-hidden cursor-pointer ${editing ? 'hover:opacity-90' : ''}`}
          >
            <img
              src={userData.profilePictureUrl || `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random`}
              alt="Profile"
              className="w-full h-full object-cover border-4 border-white shadow-lg"
            />
            {editing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <CameraIcon className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          {!editing && (
            <button
              onClick={handleEditProfile}
              className="absolute bottom-1 right-1 bg-gray-700 hover:bg-gray-800 text-white p-2.5 rounded-full shadow-md transition-transform duration-150 ease-in-out hover:scale-110"
              aria-label="Edit Profile"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
          {uploadingImage && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Full Name (firstLast) */}
          <div>
            <label htmlFor="firstLast" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="mt-1 flex items-center w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
              <UserIcon className="h-5 w-5 text-gray-500 mr-3" />
              {editing ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editedData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={editedData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                <span className="capitalize">{userData.firstLast}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="mt-1 flex items-center w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
              <MailIcon className="h-5 w-5 text-gray-500 mr-3" />
              <span>{userData.email}</span>
            </div>
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <div className="mt-1 flex items-center w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
              <UserIcon className="h-5 w-5 text-gray-500 mr-3" />
              <span className="capitalize">{userData.role}</span>
            </div>
          </div>

          {/* About */}
          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>
            <div className="mt-1 flex items-start w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
              <InfoIcon className="h-5 w-5 text-gray-500 mr-3 mt-1" />
              {editing ? (
                <textarea
                  value={editedData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-sm min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <span className="flex-1">{userData.about || 'No information provided'}</span>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="flex gap-4 pt-6">
            <button
              onClick={handleSaveProfile}
              className="flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
            >
              <SaveIcon className="h-5 w-5" />
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 py-3 px-4 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="pt-8">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-xl text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-colors duration-150"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}