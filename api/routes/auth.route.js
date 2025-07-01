import express from "express";
import { signup } from "../controllers/auth.controller.js";
import { signin } from "../controllers/auth.controller.js";
import { google } from "../controllers/auth.controller.js";
import { getProfile, updateProfile } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyToken.js';
import { deleteUser } from "../controllers/auth.controller.js";


const router=express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google);


// protected route
router.get('/profile', verifyToken, getProfile);
router.put('/update', verifyToken, updateProfile);

router.post('/signout', (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: 'Lax',
    // secure: process.env.NODE_ENV === 'production' // uncomment in production
  });
  res.status(200).json({ message: 'Signed out successfully' });
});


router.delete('/delete', verifyToken, deleteUser);



export default router;

