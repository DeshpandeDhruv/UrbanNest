///
// import User from "../models/user.model.js";
import Updated_User from "../models/updateduser.model.js";

import bcrypt from "bcrypt";


import jwt from 'jsonwebtoken';
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if all fields are provided
        if (!username || !email || !password) {
            return next(errorHandler(400, "Please fill all the fields"));
        }

        // Check if user already exists
        const userExists = await Updated_User.findOne({ email });
        if (userExists) {
            return next(errorHandler(400, "User already exists"));
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const userCreated = await Updated_User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Send response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: userCreated._id,
                username: userCreated.username,
                email: userCreated.email,
            },
        });
    } catch (error) {
        next(error);
    }

};

export const google = async (req, res, next) => {
    try {
      const user = await Updated_User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, "test");
        const { password: pass, ...rest } = user._doc;
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
        const newUser = new Updated_User({
          username:
            req.body.name.split(' ').join('').toLowerCase() +
            Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.photo,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, "test");
        const { password: pass, ...rest } = newUser._doc;
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  };
  



export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await Updated_User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong password!'));

    // ✅ Always use environment variable for secret
    const token = jwt.sign({ id: validUser._id }, "test", {
      expiresIn: '1d', // optional, but useful
    });

    const { password: pass, ...rest } = validUser._doc;

    // ✅ Send token via httpOnly cookie
    res
      .cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'Lax', // 'Strict' for stricter security, 'None' for cross-site
        //secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};



// create profile function 
// ✅ GET /api/auth/profile (Protected)
export const getProfile = async (req, res) => {
  try {
    const user = await Updated_User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ PUT /api/auth/update (Protected)
export const updateProfile = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;
    const updates = { username, email, avatar };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

   const updatedUser = await Updated_User.findByIdAndUpdate(
  req.user.id,            // 👈 extracted from JWT
  { $set: updates },
  { new: true }           // 👈 return updated doc

    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await Updated_User.findByIdAndDelete(req.user.id);
    res.clearCookie('access_token'); // ✅ Clear JWT cookie
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed' });
  }
};



