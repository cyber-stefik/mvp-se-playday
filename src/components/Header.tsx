import React, { useState, useEffect } from 'react';
import Logo from "./../assets/logo_PlayDay_1.png";
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../lib/firebase'; // Import firebase auth and firestore
import { onAuthStateChanged } from 'firebase/auth'; // Import auth state change listener
import { doc, getDoc } from 'firebase/firestore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); // Track user data
  const [role, setRole] = useState<string>(''); // Track the user's role ('player' or 'owner')
  const [loading, setLoading] = useState<boolean>(true); // Track loading state for authentication check

  // Listen to auth state changes and fetch user role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Get user role from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role); // Set role from Firestore data
        }
      } else {
        setUser(null);
        setRole(''); // Reset role if the user is logged out
      }

      setLoading(false); // Set loading to false after authentication state is checked
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    navigate('/signIn');
  };

  const handleSignUp = () => {
    navigate('/signUp');
  };

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/home'); // Redirect to home after sign out
  };

  if (loading) {
    return (
      <header className="flex justify-between items-center p-4 shadow-md">
        <div>Loading...</div>
      </header>
    );
  }

  return (
    <header className="flex justify-between items-center p-4 shadow-md">
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src={Logo}
          alt="Logo"
          className="h-12 w-12 object-cover rounded-full border-2 border-black"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-6">
        <a href="/home" className="hover:text-[#065C64]">
          Home
        </a>

        <a href="/about" className="hover:text-[#065C64]">
          About Us
        </a>

        {role === 'owner' ? (
          <a href="/my-fields" className="hover:text-[#065C64]">
            My Fields
          </a>
        ) : (
          <a href="/fields" className="hover:text-[#065C64]">
            Fields
          </a>
        )}
        {role === 'player' || role !== 'owner' ? (
          <a href="/games" className="hover:text-[#065C64]">
            Games
          </a>
        ) : null}

        {/* Conditionally render 'My Profile' only if the user is authenticated */}
        {user ? (
          <a href="/my-profile" className="hover:text-[#065C64]">
            My Profile
          </a>
        ) : null}
      </nav>

      {/* Authentication Buttons */}
      <div className="flex gap-4">
        {user ? (
          <>
            <button
              onClick={handleSignOut}
              className="border-2 border-black px-4 py-1 hover:text-white hover:bg-[#065C64]"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            {/* Show Sign In and Sign Up buttons if user is not signed in */}
            <button
              onClick={handleSignIn}
              className="border-2 border-black px-4 py-1 hover:text-white hover:bg-[#065C64]"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="border-2 border-black px-4 py-1 hover:text-white hover:bg-[#065C64]"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
