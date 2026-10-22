"use client";

// Navigation Bar imports
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";


export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
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
    // Navigation bar container with responsive design
    <nav className="nav-container">

      {/* Wrapper for navigation content */}
      <div className="nav-wrapper">

        {/* Logo and menu toggle button for mobile view */}
        <div className="title-style-frame">
          {isLoggedIn ? (
            <span className="title-text-style">
              VibeTogether
            </span>
          ) : (
            <Link
              href="/"
              className="title-text-style"
            >
              VibeTogether
            </Link>
          )}

          {/* Toggle button for mobile menu */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="menu-toggle-button"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Navigation links and buttons, conditionally rendered based on login state */}
        <div className={`${menuOpen ? "flex" : "hidden"} nav-links-container`}>
          {isLoggedIn && (
            <div className="nav-links">
              <Link
                href="/matching"
                className="nav-link group"
                onClick={() => setMenuOpen(false)}
              >
                Matching
                <span className="nav-bar-span group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href="/chats"
                className="nav-link group"
                onClick={() => setMenuOpen(false)}
              >
                Chats
                <span className="nav-bar-span group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href={`/profile/${userId}`}
                className="nav-link group"
                onClick={() => setMenuOpen(false)}
              >
                Profile
                <span className="nav-bar-span group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          )}

          <div className="nav-links">
            {isLoggedIn ? (
              <button onClick={handleSignOut} className="nav-button-prim">
                Sign Out
              </button>
            ) : (
              <>
                {pathname === '/login' && (
                  <Link href="/signup" className="nav-button-prim" onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </Link>
                )}

                {pathname === '/signup' && (
                  <Link href="/login" className="nav-button-sec" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}