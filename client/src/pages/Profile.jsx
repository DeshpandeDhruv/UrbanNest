import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logout,
} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());

    try {
      const res = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateUserFailure(data.message || 'Update failed'));
        return;
      }

      dispatch(updateUserSuccess(data));
      setIsEditing(false);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        dispatch(logout());
        navigate('/');
      } else {
        console.error('Sign out failed');
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action is irreversible.');
    if (!confirmed) return;

    try {
      const res = await fetch('/api/auth/delete', {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to delete account');
        return;
      }

      dispatch(logout());
      navigate('/');
    } catch (error) {
      alert('Error deleting account');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="relative h-16 bg-gradient-to-r from-purple-400 to-purple-100">

            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden">
                <img
                  src={currentUser?.avatar || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">
                  {currentUser?.username}
                </h1>
                <p className="text-text-secondary mt-1">
                  {currentUser?.email}
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                {!isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="btn btn-secondary"
                  >
                    Edit Profile
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/mylistings')}
                  className="btn bg-blue-600 text-white hover:bg-blue-700"
                >
                  My Listings
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="btn bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Sign Out
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteAccount}
                  className="btn bg-red-600 text-white hover:bg-red-700"
                >
                  Del Acc.
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn"
                >
                  Save Changes
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-1">
                  Username
                </h3>
                <p className="text-text-primary">{currentUser?.username}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-1">
                  Email
                </h3>
                <p className="text-text-primary">{currentUser?.email}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
