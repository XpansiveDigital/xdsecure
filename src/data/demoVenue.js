// Demo venue data for Secure Venue Layer prototype.
// TODO: Replace with API call to backend (e.g. GET /api/guides/:id) when backend is ready.

export const demoVenue = {
  guideName: "Venue Guide 2026",
  venueName: "The Grand Assembly Rooms",
  description:
    "A curated guide to The Grand Assembly Rooms — presenting everything you need to explore the space, understand the layout, and plan your event.",
  // TODO: Hash this before persisting. Replace with token-based access when backend is ready.
  accessCode: "venue2026",
  assets: [
    {
      id: "1",
      name: "Main Venue Tour",
      type: "embed",
      url: "https://my.matterport.com/show/?m=SxQL3iGyvQk",
      description:
        "Full 3D walkthrough of the main event spaces. Ideal for early-stage client conversations.",
      category: "Main Tour",
      visibility: "both",
    },
    {
      id: "2",
      name: "Ground Floor Floorplan",
      type: "pdf",
      url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf",
      description:
        "Dimensioned floorplan for the ground floor, including all event spaces and capacities.",
      category: "Floorplans",
      visibility: "both",
    },
    {
      id: "3",
      name: "Venue Gallery",
      type: "image",
      url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=80",
      description:
        "Main ballroom dressed for a gala dinner — a strong representation of the space at its best.",
      category: "Gallery",
      visibility: "both",
    },
    {
      id: "4",
      name: "Back of House Plan",
      type: "pdf",
      url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf",
      description:
        "Detailed back of house layout including kitchen access, loading bay, and service corridors. Shared with qualified partners.",
      category: "Back of House",
      visibility: "vetted",
    },
    {
      id: "5",
      name: "Emergency & Evacuation Layout",
      type: "pdf",
      url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf",
      description:
        "Exit routes, muster points, and evacuation flow for all primary event spaces.",
      category: "Emergency / Exits",
      visibility: "vetted",
    },
    {
      id: "6",
      name: "Operations Briefing",
      type: "video",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description:
        "A walkthrough of venue setup procedures, AV systems, and day-of logistics. For confirmed clients and production teams.",
      category: "Operations",
      visibility: "vetted",
    },
  ],
};

export const ASSET_TYPES = [
  { value: "embed", label: "Embed Link (Matterport, etc.)" },
  { value: "pdf", label: "PDF Document" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video Link (YouTube, Vimeo)" },
];

export const ASSET_CATEGORIES = [
  "Main Tour",
  "Floorplans",
  "Gallery",
  "Video",
  "Operations",
  "Back of House",
  "Emergency / Exits",
];

export const VISIBILITY_OPTIONS = [
  {
    value: "both",
    label: "Sales + Vetted",
    description: "Visible in both views",
  },
  {
    value: "sales",
    label: "Sales Only",
    description: "Visible in Sales View only",
  },
  {
    value: "vetted",
    label: "Vetted Access",
    description: "Shared selectively with qualified users",
  },
];
