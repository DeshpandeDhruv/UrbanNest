import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
      enum: ['apartment', 'house', 'villa', 'studio', 'other'],
    },
    offer: {
      type: Boolean,
      default: false,
    },
    imageUrls: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length <= 6;
        },
        message: 'Maximum 6 images are allowed.',
      },
      required: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Updated_User',
      required: true,
    },
   
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
