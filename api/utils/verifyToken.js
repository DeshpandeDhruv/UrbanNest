import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
//dotenv.config();
dotenv.config();



export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    console.log(' No token found in cookies.');
    return res.status(401).json({ message: 'Access Denied' });
  }

  jwt.verify(token,process.env.JWT_secret, (err, decoded) => {
    if (err) {

      console.log(' Token verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid Token' });
    }

    req.user = decoded;
    console.log("JWT CHECK:", process.env.JWT_SECRET);

    //  Log decoded user payload for debugging
    console.log(' Token verified. Decoded user:', decoded);

    next();
  });
};
