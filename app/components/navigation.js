"use client";

// Navigation Bar imports
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    setIsLoggedIn(!!userEmail);

    const userId = localStorage.getItem("userId");
    setUserId(userId);

    setLoading(false);
  }, []);

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // Handle user sign-out by clearing local storage and redirecting to the home page
  const handleSignOut = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="nav-container">
      <div className="nav-wrapper">
        <div className="flex items-center justify-between w-full md:w-auto">
          {!loading && isLoggedIn ? (
            <span className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 cursor-default hover:from-blue-300 hover:to-purple-400 transition-all duration-300">
              VibeTogether
            </span>
          ) : (
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-300 hover:to-purple-400 transition-all duration-300"
            >
              VibeTogether
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-600/60 bg-slate-800/70 px-3 py-2 text-sm font-medium text-slate-200 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        <div className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-4 md:flex md:w-auto md:flex-row md:items-center md:gap-8`}>
          {!loading && isLoggedIn && (
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
              <Link
                href="/matching"
                className="text-slate-300 hover:text-blue-400 font-semibold transition-colors duration-300 relative group"
                onClick={() => setMenuOpen(false)}
              >
                Matching
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href="/chats"
                className="text-slate-300 hover:text-blue-400 font-semibold transition-colors duration-300 relative group"
                onClick={() => setMenuOpen(false)}
              >
                Chats
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href={`/profile/${userId}`}
                className="text-slate-300 hover:text-blue-400 font-semibold transition-colors duration-300 relative group"
                onClick={() => setMenuOpen(false)}
              >
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
                <Link href="/login" className="btn-nav-secondary" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>

                <Link href="/signup" className="btn-nav-primary" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}