import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase'; // ✅ Import initialized Firebase auth

import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Send user info to your backend for processing
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ So cookie is set
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        throw new Error(data.message || 'Google auth failed');
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('Could not sign in with Google:', error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-purple-800 text-white p-3 rounded-lg transition transform hover:scale-105 hover:bg-purple-900 w-1/3 mx-auto"
    >
      USE GOOGLE
    </button>
  );
}
