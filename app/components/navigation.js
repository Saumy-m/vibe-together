"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
//import { set } from "mongoose";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    setIsLoggedIn(!!userEmail);

    const userId = localStorage.getItem("userId");
    setUserId(userId);

    setLoading(false);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="nav-container">
      <div className="nav-wrapper">
        {!loading && isLoggedIn ? (
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 cursor-default hover:from-blue-300 hover:to-purple-400 transition-all duration-300">
            VibeTogether
          </span>
        ) : (
          <Link
            href="/"
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-300 hover:to-purple-400 transition-all duration-300"
          >
            VibeTogether
          </Link>
        )}

        {!loading && isLoggedIn && (
          <div className="flex gap-8 items-center">
            <Link
              href="/matching"
              className="text-slate-300 hover:text-blue-400 font-semibold transition-colors duration-300 relative group"
            >
              Matching
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link
              href="/chats"
              className="text-slate-300 hover:text-blue-400 font-semibold transition-colors duration-300 relative group"
            >
              Chats
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link
              href={`/profile/${userId}`}
              className="text-slate-300 hover:text-blue-400 font-semibold transition-colors duration-300 relative group">
              Profile
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        )}

        <div className="nav-links">
          {!loading && isLoggedIn ? (
            <button onClick={handleSignOut} className="btn-nav-primary">
              Sign Out
            </button>
          ) : (
            <>
              <Link href="/login" className="btn-nav-secondary">
                Login
              </Link>

              <Link href="/signup" className="btn-nav-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}