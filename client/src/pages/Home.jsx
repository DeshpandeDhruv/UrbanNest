import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/listing/featured', {
          headers: {
            'Content-Type': 'application/json',
            ...(currentUser && {
              Authorization: `Bearer ${currentUser.token}`,
            }),
          },
        });
        const data = await res.json();
        setFeaturedProperties(data);
      } catch (error) {
        console.error('Error fetching featured listings:', error);
      }
    };

    fetchFeatured();
  }, [currentUser]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80"
            alt="Dream Home"
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find Your Dream Home
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover the perfect property that matches your lifestyle and aspirations
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {currentUser ? (
              <Link to="/properties" className="btn btn-secondary text-lg px-8 py-3">
                Explore Properties
              </Link>
            ) : (
              <Link to="/signup" className="btn btn-secondary text-lg px-8 py-3">
                Sign Up
              </Link>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary-accent mb-4">
              Featured Properties
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Explore our handpicked selection of premium properties
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card overflow-hidden bg-white shadow rounded-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.imageUrls[0]}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
                  <p className="text-primary-accent font-bold text-lg mb-2">
                    ₹{property.regularPrice.toLocaleString()}
                  </p>
                  <p className="text-text-secondary mb-4">{property.address}</p>
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.furnished ? 'Furnished' : 'Unfurnished'}</span>
                    <span>{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4"
                  >
                    <Link
                      to={`/property/${property._id}`}
                      className="btn w-full text-center"
                    >
                      View Details
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/properties"
              className="btn btn-secondary inline-block"
            >
              View All Properties
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-400">
              Why Choose Urban Nest?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We combine cutting-edge technology with personalized service to make your real estate journey seamless
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏠',
                title: 'Smart Search',
                description: 'Find your perfect match with our AI-powered property search',
              },
              {
                icon: '🔒',
                title: 'Secure Transactions',
                description: 'Safe and transparent property transactions with our secure platform',
              },
              {
                icon: '💎',
                title: 'Premium Listings',
                description: 'Access exclusive properties and premium real estate opportunities',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card text-center p-8 shadow-md"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
