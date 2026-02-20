import Updated_User from "../models/updateduser.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

// ⚠️ DO NOT use dotenv here if already used in index.js
// dotenv should be loaded once in server entry (index.js)


// ==============================
// SIGNUP
// ==============================
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(errorHandler(400, "Please fill all the fields"));
    }

    const userExists = await Updated_User.findOne({ email });
    if (userExists) {
      return next(errorHandler(400, "User already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userCreated = await Updated_User.create({
      username,
      email,
      password: hashedPassword,
    });

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


// ==============================
// GOOGLE AUTH
// ==============================
export const google = async (req, res, next) => {
  try {
    const user = await Updated_User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const { password: pass, ...rest } = user._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json(rest);

    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = new Updated_User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const { password: pass, ...rest } = newUser._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};


// ==============================
// SIGNIN
// ==============================
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await Updated_User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong password"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(rest);

  } catch (error) {
    next(error);
  }
};


// ==============================
// GET PROFILE
// ==============================
export const getProfile = async (req, res) => {
  try {
    const user = await Updated_User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


// ==============================
// UPDATE PROFILE
// ==============================
export const updateProfile = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    const updates = { username, email, avatar };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await Updated_User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};


// ==============================
// DELETE USER
// ==============================
export const deleteUser = async (req, res) => {
  try {
    await Updated_User.findByIdAndDelete(req.user.id);

    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch {
    res.status(500).json({ message: "Deletion failed" });
  }
};