import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-purple-400 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} UrbanNest. All rights reserved.
        </p>
        <div className="space-x-4 mt-2 md:mt-0 text-sm flex flex-col md:flex-row items-center gap-2">
          <span className="hover:underline"> UrbanNest@gmail.com</span>
          <span className="hover:underline"> +91-8976801009</span>
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
