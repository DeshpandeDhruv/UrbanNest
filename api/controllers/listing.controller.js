import Listing from '../models/listingModel.js';
import Updated_User from '../models/updateduser.model.js';
import sendEmail from '../utils/sendEmail.js';
import mongoose from 'mongoose';
import fs from  'fs';

// CREATE LISTING
export const createListing = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bedrooms,
      furnished,
      type,
      offer,
      imageUrls,
    } = req.body;

    if (!imageUrls || imageUrls.length === 0) {
      return res.status(400).json({ message: 'At least 1 image is required.' });
    }

    if (imageUrls.length > 6) {
      return res.status(400).json({ message: 'Maximum 6 images allowed.' });
    }

    const newListing = new Listing({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bedrooms,
      furnished,
      type,
      offer,
      imageUrls,
      userRef: req.user.id,
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error while creating listing' });
  }
};



// GET USER LISTINGS
export const getUserListings = async (req, res) => {
  try {
    const userId = req.user.id;
    const listings = await Listing.find({ userRef: userId }).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
};

// GET FEATURED LISTINGS
export const getFeaturedListings = async (req, res) => {
  try {
    const userId = req.user?.id;
    const matchStage = userId ? { userRef: { $ne: userId } } : {};

    const listings = await Listing.aggregate([
      { $match: matchStage },
      { $sample: { size: 3 } },
    ]);

    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching featured listings:', error);
    res.status(500).json({ message: 'Failed to fetch featured listings' });
  }
};

// UPDATE LISTING
export const updateListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.userRef.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own listings' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(listingId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedListing);
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Failed to update listing' });
  }
};

// DELETE LISTING
export const deleteListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.userRef.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }

    await Listing.findByIdAndDelete(listingId);
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Failed to delete listing' });
  }
};

// ✅ UPDATED GET SINGLE LISTING
export const getSingleListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid listing ID' });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching listing by ID:', error);
    res.status(500).json({ message: 'Failed to fetch listing' });
  }
};

// CONTACT LANDLORD
export const contactLandlord = async (req, res) => {
  try {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const landlord = await Updated_User.findById(listing.userRef);
    if (!landlord) {
      return res.status(404).json({ message: 'Landlord not found' });
    }

    // Send email using nodemailer
    await sendEmail({
      to: landlord.email,
      subject: `Interest in your property: ${listing.name}`,
      text: `Hi ${landlord.username},\n\nSomeone is interested in your property listed at ${listing.address}.\n\nRegards,\nUrbanNest`,
    });

    res.status(200).json({ message: 'Email sent to landlord!' });
  } catch (error) {
    console.error('Error contacting landlord:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

// ✅ GET LISTINGS WITH FILTERS
// ✅ GET LISTINGS WITH FILTERS (Updated for address/city support)
// ✅ GET LISTINGS WITH FILTERS (Supports city, type, offer, furnished, bedrooms, sort)
export const getFilteredListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const {
      searchTerm = '',
      address = '',
      type = 'all',
      furnished = 'false',
      offer = 'false',
      bedrooms = '',
      sort = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {
      name: { $regex: searchTerm, $options: 'i' },
    };

    if (address) {
      query.address = { $regex: address, $options: 'i' };
    }

    if (type !== 'all') query.type = type;
    if (offer === 'true') query.offer = true;
    if (furnished === 'true') query.furnished = true;

   if (bedrooms) {
  const exactBedrooms = parseInt(bedrooms);
  if (!isNaN(exactBedrooms)) {
    query.bedrooms = exactBedrooms;
  }
}
    const listings = await Listing.find(query)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json(listings);
  } catch (error) {

    next(error);

  }

};


// backend/controllers/listing.controller.js
export const getSimilarListings = async (req, res) => {
  const { id } = req.params;
  // Load clusterMap
  const clusterMap = JSON.parse(fs.readFileSync('./api/data/clusterMap.json'));
  const clusterId = clusterMap[id];
  if (clusterId === undefined) return res.status(404).json({ message: 'No cluster found' });

  const similarIds = Object.entries(clusterMap)
    .filter(([key, val]) => val === clusterId && key !== id)
    .map(([key]) => key)
    .slice(0, 4);

  const listings = await Listing.find({ _id: { $in: similarIds } });
  res.json(listings);
};
