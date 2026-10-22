/*
 List of activities available during signup and profile editing.
 
 `id` is the stable value saved in a user's interests array. Avoid changing
 existing IDs without migrating saved profiles and updating matching logic.
 `label` is the readable name shown in the dropdown and elsewhere in the UI.
 
 This file contains data only. It does not manage React state or styling.
 */
export const ACTIVITIES = [
  { id: "hiking", label: "Hiking" },
  { id: "cycling", label: "Cycling" },
  { id: "camping", label: "Camping" },
  { id: "kayaking", label: "Kayaking" },
  { id: "rock_climbing", label: "Rock Climbing" },
  { id: "painting", label: "Painting" },
  { id: "photography", label: "Photography" },
  { id: "pottery", label: "Pottery" },
  { id: "writing", label: "Creative Writing" },
  { id: "music", label: "Playing Music" },
  { id: "cooking", label: "Cooking" },
  { id: "wine_tasting", label: "Wine Tasting" },
  { id: "board_games", label: "Board Games" },
  { id: "karaoke", label: "Karaoke" },
  { id: "coffee", label: "Coffee Crawls" },
  { id: "yoga", label: "Yoga" },
  { id: "running", label: "Running" },
  { id: "gym", label: "Gym / Weightlifting" },
  { id: "meditation", label: "Meditation" },
  { id: "dance", label: "Dancing" },
  { id: "coding", label: "Coding / Hackathons" },
  { id: "book_club", label: "Book Club" },
  { id: "language", label: "Language Exchange" },
  { id: "gaming", label: "Video Gaming" },
  { id: "film", label: "Film / Documentaries" },
];

// Return a readable activity name, including for older or unknown saved IDs.
export function activityLabel(id) {
  const activity = ACTIVITIES.find((item) => item.id === id);
  return activity?.label ?? String(id).replace(/_/g, " ");
}
