import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListingItem from './ListingItem';

const SimilarListings = () => {
  const { id } = useParams();
  const [similarListings, setSimilarListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await fetch(`/api/listing/similar/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch');
        setSimilarListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Similar Listings</h2>
      {similarListings.length === 0 ? (
        <p className="text-center text-gray-500">No similar listings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilarListings;
