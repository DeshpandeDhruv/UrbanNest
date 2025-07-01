import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-900 to-purple-400 text-transparent bg-clip-text">
          About UrbanNest
        </h1>
        <p className="mt-4 text-text-secondary max-w-2xl mx-auto text-lg">
          UrbanNest is your trusted partner in navigating the real estate market.
          We provide a seamless, smart, and secure platform to help you find your dream property with ease.
        </p>
      </motion.div>

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* ✅ WORKING IMAGE */}
        <motion.img
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1470&q=80"
          alt="Luxury Property"
          className="w-full rounded-lg shadow-lg object-cover h-96"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Feature List */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-purple-400 text-transparent bg-clip-text mb-4">
  Why Choose UrbanNest?
</h2>

          <ul className="list-disc list-inside text-text-secondary space-y-3 text-lg">
            <li>AI-powered property discovery tailored to your needs</li>
            <li> Verified users, secure listings, and safe transactions</li>
            <li> Direct contact with landlords via in-app email</li>
            <li> Professional, minimal UI with modern experience</li>
            <li> Fast, mobile-friendly, and always evolving</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
