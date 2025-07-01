import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ListingItem from './ListingItem';

export default function Search() {
  const location = useLocation();

  const [filters, setFilters] = useState({
    searchTerm: '',
    bedrooms: '',
    type: 'all',
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [allListings, setAllListings] = useState([]); // All listings from backend (city only)
  const [filteredListings, setFilteredListings] = useState([]); // Listings after filtering
  const [visibleCount, setVisibleCount] = useState(9);

  const applyFrontendFilters = () => {
    let filtered = [...allListings];

    if (filters.searchTerm) {
      filtered = filtered.filter(listing =>
        listing.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(listing =>
        listing.bedrooms === parseInt(filters.bedrooms)
      );
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(listing => listing.type === filters.type);
    }

    if (filters.furnished) {
      filtered = filtered.filter(listing => listing.furnished === true);
    }

    if (filters.offer) {
      filtered = filtered.filter(listing => listing.offer === true);
    }

    filtered.sort((a, b) => {
      if (filters.sort === 'regularPrice') {
        return filters.order === 'asc'
          ? a.regularPrice - b.regularPrice
          : b.regularPrice - a.regularPrice;
      } else {
        return filters.order === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredListings(filtered);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const city = params.get('address');

    const fetchCityListings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get?address=${encodeURIComponent(city)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllListings(data);
        } else {
          setAllListings([]);
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
        setAllListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCityListings();
  }, [location.search]);

  useEffect(() => {
    applyFrontendFilters();
  }, [filters, allListings]);

  const handleChange = (e) => {
    const { id, value, type, checked, name } = e.target;
    if (name === 'type') {
      setFilters((prev) => ({ ...prev, type: value }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [id]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar Filters */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen bg-gray-50 w-full md:w-[350px]">
        <form className="flex flex-col gap-6">
          <div>
            <label htmlFor="searchTerm" className="block font-semibold mb-1">
              Search:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search by name"
              className="border rounded-lg p-3 w-full"
              value={filters.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="bedrooms" className="block font-semibold mb-1">
              Bedrooms:
            </label>
            <select
              id="bedrooms"
              value={filters.bedrooms}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            >
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Property Type:</label>
            <div className="flex flex-col gap-2">
              {['all', 'apartment', 'house', 'villa', 'studio', 'other'].map((value) => (
                <label key={value} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value={value}
                    checked={filters.type === value}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="capitalize">{value}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="inline-flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              id="furnished"
              checked={filters.furnished}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Furnished
          </label>

          <label className="inline-flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              id="offer"
              checked={filters.offer}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Special Offer
          </label>

          <div>
            <label className="font-semibold block mb-1">Sort by:</label>
            <select
              id="sort"
              value={`${filters.sort}_${filters.order}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('_');
                setFilters((prev) => ({ ...prev, sort, order }));
              }}
              className="border rounded-lg p-2 w-full"
            >
              <option value="createdAt_desc">Newest</option>
              <option value="createdAt_asc">Oldest</option>
              <option value="regularPrice_desc">Price: High to Low</option>
              <option value="regularPrice_asc">Price: Low to High</option>
            </select>
          </div>
        </form>
      </div>

      {/* Listings */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results
        </h1>

        <div className="p-7 flex flex-wrap gap-6">
          {loading && <p className="text-xl text-slate-700 text-center w-full">Loading...</p>}

          {!loading && filteredListings.length === 0 && (
            <p className="text-xl text-slate-700">No listings found!</p>
          )}

          {!loading &&
            filteredListings.slice(0, visibleCount).map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {!loading && visibleCount < filteredListings.length && (
            <button
              onClick={handleShowMore}
              className="text-blue-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
