"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navigation";

export default function ChatsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Chats
          </h1>

          <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
            <p className="text-slate-300 text-lg">
              Connect and chat with your matches
            </p>
            <p className="text-slate-400 mt-4">Chat feature coming soon...</p>
          </div>
        </div>
      </main>
    </>
  );
}
