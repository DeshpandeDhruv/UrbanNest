// ✅ Create a new file in: frontend/src/pages/CreateListing.jsx

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    regularPrice: '',
    discountPrice: '',
    bedrooms: 1,
    furnished: false,
    type: 'apartment',
    offer: false,
    imageUrls: [],
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async () => {
    const urls = [];
    setLoading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      //formData.append('upload_preset', 'YOUR_CLOUDINARY_PRESET');
      //formData.append('cloud_name', 'YOUR_CLOUDINARY_NAME');
      formData.append('upload_preset', 'realestate_preset');
      formData.append('cloud_name', 'dlcbt7th8');

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/dlcbt7th8/image/upload`, {
  method: 'POST',
  body: formData,
});
        const data = await res.json();
        urls.push(data.secure_url);
      } catch (err) {
        console.error('Upload failed:', err);
        setError('Image upload failed');
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return setError('Upload at least one image');
    if (files.length > 6) return setError('Maximum 6 images allowed');
    if (Number(formData.discountPrice) >= Number(formData.regularPrice)) {
      return setError('Discount price must be less than regular price');
    }

    const imageUrls = await handleImageUpload();
    if (!imageUrls) return;

    try {
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData, imageUrls }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Reset form after success
      setFormData({
        name: '',
        description: '',
        address: '',
        regularPrice: '',
        discountPrice: '',
        bedrooms: 1,
        furnished: false,
        type: 'apartment',
        offer: false,
        imageUrls: [],
      });
      setFiles([]);

      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (!currentUser) {
    return <div className="text-center py-20 text-xl font-semibold">Please log in to create a listing.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h1 className="text-3xl font-bold text-center text-primary-accent mb-8">Create New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {['name', 'description', 'address', 'regularPrice', 'discountPrice', 'bedrooms'].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block mb-1 capitalize font-medium text-text-primary">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            {field === 'description' ? (
              <textarea
                id={field}
                value={formData[field]}
                onChange={handleChange}
                className="form-input w-full h-32 resize-none"
                required
              />
            ) : (
              <input
                id={field}
                type={field === 'regularPrice' || field === 'discountPrice' || field === 'bedrooms' ? 'number' : 'text'}
                value={formData[field]}
                onChange={handleChange}
                className="form-input w-full"
                required={field !== 'discountPrice'}
              />
            )}
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-text-primary">Type</label>
            <select id="type" value={formData.type} onChange={handleChange} className="form-select w-full">
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input type="checkbox" id="furnished" checked={formData.furnished} onChange={handleChange} className="mr-2" />
              Furnished
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" id="offer" checked={formData.offer} onChange={handleChange} className="mr-2" />
              Offer
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-text-primary">Images </label>
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn w-full"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Listing'}
        </motion.button>
      </form>
    </div>
  );
};

export default CreateListing;
