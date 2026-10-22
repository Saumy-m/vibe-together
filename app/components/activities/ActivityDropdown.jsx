"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ACTIVITIES } from "./activities";
import styles from "./ActivityDropdown.module.css";

// Keep this export so existing imports of activityLabel from the component can be updated easily.
export { activityLabel } from "./activities";

/*
  Reusable activity selector for signup and profile editing.
 
  The parent component owns `interests` and handles saving it to the server.
  This dropdown only reports changes through `onChange(nextInterests)`.
 
  Example:
    <ActivityDropdown interests={interests} onChange={setInterests} />
 
  `interests` is an array of activity IDs, e.g. ["hiking", "gaming"].
 */
export default function ActivityDropdown({
  interests = [],
  onChange,
  placeholder = "Choose your interests…",
}) {
  // Only temporary UI state belongs here. Selected interests live in the parent.
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const panelId = useId();
  const groupId = useId();

  // Build the trigger text from the parent's selected values.
  const triggerLabel =
    interests.length === 0
      ? placeholder
      : interests.length === 1
        ? "1 activity selected"
        : `${interests.length} activities selected`;

  // Search only affects which rows are visible; it never removes selections.
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredActivities = normalizedQuery
    ? ACTIVITIES.filter((activity) =>
        activity.label.toLowerCase().includes(normalizedQuery)
      )
    : ACTIVITIES;

  // Toggle one ID and report an entirely new array to the parent.
  function handleToggle(id) {
    const nextInterests = interests.includes(id)
      ? interests.filter((selectedId) => selectedId !== id)
      : [...interests, id];
    onChange(nextInterests);
  }

  // Close the panel and return keyboard focus to the trigger if requested. 
  function closeDropdown({ restoreFocus = false } = {}) {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  // Close when clicking outside; always remove the global listener on unmount.
  useEffect(() => {
    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, []);

  // Focus search when opening the dropdown so typing can begin immediately.
  useEffect(() => {
    if (isOpen) searchRef.current?.focus();
  }, [isOpen]);

  // Escape should work while focus is on any control inside the panel.
  function handlePanelKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeDropdown({ restoreFocus: true });
    }
  }

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Button that opens or closes the activity selector. */}
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""} ${
          interests.length ? styles.triggerHasSelection : ""
        }`}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <span className={styles.triggerText}>{triggerLabel}</span>
        {interests.length > 0 && (
          <span className={styles.countBadge} aria-hidden="true">
            {interests.length}
          </span>
        )}
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div id={panelId} className={styles.panel} onKeyDown={handlePanelKeyDown}>
          {/* Searching does not change the selected activity IDs. */}
          <div className={styles.searchArea}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search…"
              aria-label="Search activities"
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => {
                  setSearchQuery("");
                  searchRef.current?.focus();
                }}
                aria-label="Clear activity search"
              >
                ×
              </button>
            )}
          </div>

          <div className={styles.selectionHeader}>
            <span>{interests.length} selected</span>
            {interests.length > 0 && (
              <button type="button" className={styles.textButton} onClick={() => onChange([])}>
                Clear all
              </button>
            )}
          </div>

          {/* Native checkboxes support keyboard selection without custom listbox logic. */}
          <div className={styles.activityList} role="group" aria-labelledby={groupId}>
            <span id={groupId} className={styles.visuallyHidden}>Available activities</span>
            {filteredActivities.length === 0 ? (
              <p className={styles.noResults}>No activities match "{searchQuery}"</p>
            ) : (
              filteredActivities.map((activity) => {
                const checked = interests.includes(activity.id);
                return (
                  <label
                    key={activity.id}
                    className={`${styles.activityRow} ${checked ? styles.activityRowSelected : ""}`}
                  >
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={checked}
                      onChange={() => handleToggle(activity.id)}
                    />
                    <span>{activity.label}</span>
                    {checked && (
                      <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </label>
                );
              })
            )}
          </div>

          {/* Done closes the panel; each toggle has already notified the parent. */}
          <div className={styles.footer}>
            <button type="button" className={styles.doneButton} onClick={() => closeDropdown({ restoreFocus: true })}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
