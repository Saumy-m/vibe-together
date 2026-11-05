"use client";

// Navigation Bar imports
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; 

const supabase = createClient();

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Replaced localStorage check with Supabase's Realtime Auth Listener
  useEffect(() => {
    // 1. Get initial session state on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
      setLoading(false);
    });

    // 2. Listen instantly to sign-in / sign-out events across the whole app
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setUserId(session.user.id);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
      }
      setLoading(false);
    });

    // 3. Clean up the listener when the navbar unmounts
    return () => {
      subscription.unsubscribe();
    };
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

  // Handle user sign-out safely using Supabase
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
  };

  // Prevent flashing empty states while checking auth status
  if (loading) {
    return null; // Or return a simple loading skeleton matching your navbar height
  }

  return (
    <nav className="nav-container">
      <div className="nav-wrapper">
        <div className="title-style-frame">
          {isLoggedIn ? (
            <span className="title-text-style">VibeTogether</span>
          ) : (
            <Link href="/" className="title-text-style">VibeTogether</Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="menu-toggle-button"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        <div className={`${menuOpen ? "flex" : "hidden"} nav-links-container`}>
          {isLoggedIn && (
            <div className="nav-links">
              <Link href="/matching" className="nav-link group" onClick={() => setMenuOpen(false)}>
                Matching
                <span className="nav-bar-span group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link href="/chats" className="nav-link group" onClick={() => setMenuOpen(false)}>
                Chats
                <span className="nav-bar-span group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link href={`/profile/${userId}`} className="nav-link group" onClick={() => setMenuOpen(false)}>
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