import React, { useState } from 'react';
import { FaMicroscope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import sparrowLogo from '../images/sparrow.png';
import { useSelector } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedCity) {
      navigate(`/search?address=${encodeURIComponent(selectedCity)}`);
    }
  };

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow',
    'Surat', 'Indore', 'Nagpur', 'Shirdi', 'Chandigarh'
  ];

  return (
    <header className="bg-gradient-to-r from-purple-900 to-purple-400 shadow-md p-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="pl-2 flex items-center">
          <img src={sparrowLogo} alt="UrbanNest Logo" className="w-10 h-10 mr-2" />
          <h1 className="font-normal text-2xl sm:text-3xl text-white font-semibold">
            UrbanNest
          </h1>
        </Link>

        {/* Search Bar (Dropdown) */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center justify-center w-full sm:w-auto mx-auto bg-white shadow-sm rounded-md p-1"
        >
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-transparent focus:outline-none w-40 sm:w-56 rounded-l-md p-1 text-gray-800"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <button type="submit">
            <FaMicroscope className="text-slate-600 ml-2 p-1 bg-slate-200 rounded-r-md cursor-pointer" />
          </button>
        </form>

        {/* Navigation Links */}
        <ul className="flex items-center gap-3">
          <li className="hidden sm:inline text-white hover:underline pr-2">
            <Link to="/">Home</Link>
          </li>
          <li className="hidden sm:inline text-white hover:underline pr-2">
            <Link to="/about">About</Link>
          </li>
          {currentUser && (
            <li className="hidden sm:inline text-white hover:underline pr-2">
              <Link to="/create">Create</Link>
            </li>
          )}
          <li>
            {currentUser ? (
              <Link to="/profile">
                <img
                  className="rounded-full h-7 w-7 object-cover border border-white"
                  src={currentUser.avatar || 'https://via.placeholder.com/150'}
                  alt="profile"
                />
              </Link>
            ) : (
              <Link to="/signin" className="text-white hover:underline">
                Sign In
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
