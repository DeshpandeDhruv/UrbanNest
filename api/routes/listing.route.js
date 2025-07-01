import express from 'express';
import {
  createListing,
  getUserListings,
  getFeaturedListings,
  updateListing,
  deleteListing,
  getSingleListing,
  contactLandlord,
  getFilteredListings,
} from '../controllers/listing.controller.js';

import { verifyToken } from '../utils/verifyToken.js';
import { getSimilarListings } from '../controllers/listing.controller.js';

const router = express.Router();

// Listing creation & user's listings
router.post('/create', verifyToken, createListing);
router.get('/mylisting', verifyToken, getUserListings);

// Explore listings
router.get('/featured', getFeaturedListings);
router.get('/get', getFilteredListings);
router.get('/details/:id', getSingleListing);      // ✅ Used for EditListing

// Actions on specific listings
router.put('/:id', verifyToken, updateListing);
router.delete('/:id', verifyToken, deleteListing);
router.post('/contact/:id', contactLandlord);


router.get('/similar/:id', getSimilarListings);

// Optional fallback if needed (not required if you use /details/:id)
//router.get('/:id', getSingleListing); // <-- optional fallback

export default router;
