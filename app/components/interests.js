"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const ACTIVITIES = [
  { id: "hiking",        label: "Hiking" },
  { id: "cycling",       label: "Cycling" },
  { id: "camping",       label: "Camping" },
  { id: "kayaking",      label: "Kayaking" },
  { id: "rock_climbing", label: "Rock Climbing" },
  { id: "painting",      label: "Painting" },
  { id: "photography",   label: "Photography" },
  { id: "pottery",       label: "Pottery" },
  { id: "writing",       label: "Creative Writing" },
  { id: "music",         label: "Playing Music" },
  { id: "cooking",       label: "Cooking" },
  { id: "wine_tasting",  label: "Wine Tasting" },
  { id: "board_games",   label: "Board Games" },
  { id: "karaoke",       label: "Karaoke" },
  { id: "coffee",        label: "Coffee Crawls" },
  { id: "yoga",          label: "Yoga" },
  { id: "running",       label: "Running" },
  { id: "gym",           label: "Gym / Weightlifting" },
  { id: "meditation",    label: "Meditation" },
  { id: "dance",         label: "Dancing" },
  { id: "coding",        label: "Coding / Hackathons" },
  { id: "book_club",     label: "Book Club" },
  { id: "language",      label: "Language Exchange" },
  { id: "gaming",        label: "Video Gaming" },
  { id: "film",          label: "Film / Documentaries" },
];

export const activityLabel = (id) =>
  ACTIVITIES.find((a) => a.id === id)?.label ?? id.replace(/_/g, " ");

// function to execute activity selection and updation when updating user profile
export default function ActivityDropdown({ interests, onChange, placeholder = "Choose your interests…" }) {
  const [isOpen, setIsOpen]      = useState(false);
  const [searchQuery, setSearch] = useState("");
  const containerRef             = useRef(null);
  const searchRef                = useRef(null);

  const triggerLabel =
    interests.length === 0
      ? placeholder
      : interests.length === 1
      ? "1 activity selected"
      : `${interests.length} activities selected`;

  const filtered = searchQuery.trim()
    ? ACTIVITIES.filter((a) =>
        a.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ACTIVITIES;

  const handleToggle = useCallback(
    (id) => {
      const next = interests.includes(id)
        ? interests.filter((x) => x !== id)
        : [...interests, id];
      onChange(next);
    },
    [interests, onChange]
  );

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) searchRef.current.focus();
  }, [isOpen]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "10px 14px",
          background: "rgba(51,65,85,0.5)",
          border: isOpen ? "1.5px solid #818cf8" : "1.5px solid rgba(100,116,139,0.5)",
          borderRadius: "10px",
          color: interests.length ? "#e2e8f0" : "#94a3b8",
          fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit",
          boxShadow: isOpen ? "0 0 0 3px rgba(129,140,248,0.2)" : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          textAlign: "left", gap: "8px",
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span style={{ flex: 1 }}>{triggerLabel}</span>
        {interests.length > 0 && (
          <span style={{
            background: "#7c5cbf", color: "#fff", borderRadius: "99px",
            fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px",
            minWidth: "22px", textAlign: "center",
          }}>
            {interests.length}
          </span>
        )}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
          style={{ width: 16, height: 16, color: "#94a3b8", flexShrink: 0,
            transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            zIndex: 300, background: "#1e293b",
            border: "1.5px solid rgba(100,116,139,0.4)", borderRadius: "14px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
            display: "flex", flexDirection: "column", maxHeight: "360px",
            overflow: "hidden", animation: "vtDropIn 0.13s ease",
          }}
          onKeyDown={(e) => { if (e.key === "Escape") setIsOpen(false); }}
        >
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", padding: "10px 12px",
            borderBottom: "1px solid rgba(100,116,139,0.3)", position: "relative" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2}
              style={{ position: "absolute", left: 22, width: 15, height: 15, pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef} type="text" value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                width: "100%", padding: "7px 30px 7px 34px",
                background: "rgba(51,65,85,0.6)",
                border: "1px solid rgba(100,116,139,0.4)", borderRadius: "7px",
                color: "#e2e8f0", fontSize: "0.85rem", fontFamily: "inherit", outline: "none",
              }}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearch("")}
                style={{ position: "absolute", right: 20, background: "none", border: "none",
                  color: "#94a3b8", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>
                ×
              </button>
            )}
          </div>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "6px 14px", background: "rgba(15,23,42,0.5)",
            borderBottom: "1px solid rgba(100,116,139,0.2)" }}>
            <span style={{ fontSize: "0.77rem", color: "#94a3b8", fontWeight: 500 }}>
              {interests.length} selected
            </span>
            {interests.length > 0 && (
              <button type="button" onClick={() => onChange([])}
                style={{ background: "none", border: "none", color: "#818cf8",
                  fontSize: "0.77rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Clear all
              </button>
            )}
          </div>

          {/* Flat list */}
          <ul style={{ listStyle: "none", margin: 0, padding: "6px 0", overflowY: "auto", flex: 1 }}
            role="listbox" aria-multiselectable="true">
            {filtered.length === 0 ? (
              <li style={{ padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                No activities match "{searchQuery}"
              </li>
            ) : filtered.map((activity) => {
              const checked = interests.includes(activity.id);
              return (
                <li key={activity.id} role="option" aria-selected={checked}>
                  <label style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 14px", cursor: "pointer", userSelect: "none",
                    fontSize: "0.88rem",
                    color: checked ? "#a5b4fc" : "#cbd5e1",
                    fontWeight: checked ? 500 : 400,
                    background: checked ? "rgba(129,140,248,0.1)" : "transparent",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = "rgba(129,140,248,0.07)"; }}
                  onMouseLeave={(e) => { if (!checked) e.currentTarget.style.background = "transparent"; }}
                  >
                    <input
                      type="checkbox" checked={checked}
                      onChange={() => handleToggle(activity.id)}
                      style={{ accentColor: "#818cf8", width: 15, height: 15,
                        cursor: "pointer", flexShrink: 0 }}
                    />
                    {activity.label}
                    {checked && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth={2.5}
                        style={{ width: 13, height: 13, marginLeft: "auto", flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(100,116,139,0.3)",
            background: "rgba(15,23,42,0.5)", display: "flex", justifyContent: "flex-end" }}>
            <button type="button" onClick={() => setIsOpen(false)} style={{
              padding: "7px 20px",
              background: "linear-gradient(135deg, #6366f1, #7c5cbf)",
              color: "#fff", border: "none", borderRadius: "7px",
              fontSize: "0.85rem", fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
            }}>
              Done
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes vtDropIn { from { opacity:0; transform:translateY(-5px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  );
}