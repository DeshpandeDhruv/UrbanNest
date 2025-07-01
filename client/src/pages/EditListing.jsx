import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    regularPrice: '',
    discountPrice: '',
    bedrooms: '',
    furnished: false,
    type: 'apartment',
    offer: false,
    imageUrls: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/details/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(currentUser && {
              Authorization: `Bearer ${currentUser.token}`,
            }),
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setFormData(data);
      } catch (error) {
        alert('Error fetching listing: ' + error.message);
        navigate('/mylistings');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATIONS
    if (!formData.imageUrls || formData.imageUrls.length === 0) {
      return alert('Please include at least 1 image.');
    }

    if (formData.imageUrls.length > 6) {
      return alert('Maximum 6 images allowed.');
    }

    if (Number(formData.discountPrice) >= Number(formData.regularPrice)) {
      return alert('Discount price must be less than regular price.');
    }

    try {
      const res = await fetch(`/api/listing/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(currentUser && {
            Authorization: `Bearer ${currentUser.token}`,
          }),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update listing');

      alert('Listing updated successfully!');
      navigate('/mylistings');
    } catch (error) {
      alert('Error updating listing: ' + error.message);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          id="name"
          placeholder="Name"
          className="form-input w-full"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          id="description"
          placeholder="Description"
          className="form-textarea w-full"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          id="address"
          placeholder="Address"
          className="form-input w-full"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          id="regularPrice"
          placeholder="Regular Price"
          className="form-input w-full"
          value={formData.regularPrice}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          id="discountPrice"
          placeholder="Discount Price"
          className="form-input w-full"
          value={formData.discountPrice}
          onChange={handleChange}
        />
        <input
          type="number"
          id="bedrooms"
          placeholder="Bedrooms"
          className="form-input w-full"
          value={formData.bedrooms}
          onChange={handleChange}
          required
        />
        <select
          id="type"
          value={formData.type}
          onChange={handleChange}
          className="form-select w-full"
        >
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="studio">Studio</option>
          <option value="other">Other</option>
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="furnished"
            checked={formData.furnished}
            onChange={handleChange}
          />
          <span>Furnished</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="offer"
            checked={formData.offer}
            onChange={handleChange}
          />
          <span>Offer Available</span>
        </label>
        <button type="submit" className="btn btn-primary w-full">
          Update Listing
        </button>
      </form>
    </div>
  );
};

export default EditListing;
