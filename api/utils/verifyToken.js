import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    console.log('❌ No token found in cookies.');
    return res.status(401).json({ message: 'Access Denied' });
  }

  jwt.verify(token, "test", (err, decoded) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid Token' });
    }

    req.user = decoded;

    // ✅ Log decoded user payload for debugging
    console.log('✅ Token verified. Decoded user:', decoded);

    next();
  });
};
