import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ListingItem({ listing, showButtons = true }) {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 transition hover:shadow-lg w-full max-w-sm">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls?.[0]}
          alt={listing.name}
          className="h-48 w-full object-cover rounded-md mb-3"
        />
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{listing.name}</h3>
        <p className="text-gray-600 mb-1">{listing.address}</p>
        <p className="text-purple-700 font-semibold mb-2">
          ₹
          {listing.offer
            ? listing.discountPrice.toLocaleString()
            : listing.regularPrice.toLocaleString()}
        </p>
        <div className="flex gap-3 text-sm text-gray-600 mb-2">
          <span>
            {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}
          </span>
          <span>{listing.furnished ? 'Furnished' : 'Unfurnished'}</span>
          <span className="capitalize">{listing.type}</span>
        </div>
      </Link>

      {/* ✅ Only show buttons if enabled */}
      {currentUser && showButtons && (
        <div className="mt-3 flex justify-between">
          <Link
            to={`/property/${listing._id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow text-sm"
          >
            View Listing
          </Link>
         <Link
  to={`/similar/${listing._id}`}
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow text-sm"
>
  Show Similar
</Link>
        </div>
      )}
    </div>
  );
}
