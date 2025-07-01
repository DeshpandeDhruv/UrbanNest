import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ListingItem from './ListingItem';

const MyListings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await fetch('/api/listing/mylisting', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setListings(data);
      } catch (err) {
        console.error('Error loading listings:', err.message);
      }
    };

    if (currentUser) {
      fetchMyListings();
    } else {
      navigate('/signin');
    }
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/listing/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setListings((prev) => prev.filter((l) => l._id !== id));
      alert('Listing deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err.message);
      alert('Failed to delete listing');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">My Listings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {listings
          .filter((l) => l && l._id)
          .map((listing) => (
            <div key={listing._id} className="bg-white shadow-md rounded-lg p-4">
              <ListingItem listing={listing} showButtons={false} />

              <div className="flex justify-between mt-4">
                <Link
                  to={`/editlisting/${listing._id}`}
                  className="bg-blue-400 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg shadow"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {listings.length === 0 && (
        <p className="text-center text-gray-500 mt-8">You have no listings yet.</p>
      )}
    </div>
  );
};

export default MyListings;
