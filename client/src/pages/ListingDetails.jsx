import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ListingDetails = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/details/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setListing(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchListing();
  }, [id]);

  const handleContact = async () => {
    try {
      const res = await fetch(`/api/listing/contact/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEmailSent(true);
    } catch (err) {
      alert('Failed to contact landlord: ' + err.message);
    }
  };

  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;
  if (!listing) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">{listing.name}</h2>

      <div className="w-full overflow-hidden rounded-md mb-6">
        <img
          src={listing.imageUrls?.[0]}
          alt={listing.name}
          className="w-full object-cover aspect-video rounded-md"
        />
      </div>

      <p className="text-lg text-text-secondary mb-2">
        <strong>Address:</strong> {listing.address}
      </p>
      <p className="text-lg mb-2">
        <strong>Price:</strong> ₹{listing.regularPrice.toLocaleString()}
      </p>
      <p className="mb-2">
        <strong>Description:</strong> {listing.description}
      </p>
      <div className="mb-4 flex gap-4 flex-wrap">
        <span>
          <strong>Bedrooms:</strong> {listing.bedrooms}
        </span>
        <span>
          <strong>Type:</strong>{' '}
          {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
        </span>
        <span>
          <strong>Furnished:</strong> {listing.furnished ? 'Yes' : 'No'}
        </span>
      </div>

      {emailSent ? (
        <p className="text-green-600 font-semibold">✅ Email sent to landlord!</p>
      ) : (
        <button
          onClick={handleContact}
          className="btn btn-primary mt-4"
          disabled={emailSent}
        >
          Contact Landlord
        </button>
      )}
    </div>
  );
};

export default ListingDetails;
