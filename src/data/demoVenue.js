// Demo venue data — single source of truth for the prototype.
// TODO: Replace with API calls (GET/PUT /api/guides/:id) when backend is ready.

export const demoVenue = {
  guideName: "Venue Guide 2026",
  venueName: "The Grand Assembly Rooms",
  description:
    "A curated guide to The Grand Assembly Rooms — presenting everything you need to explore the space, understand the layout, and plan your event.",
  accessCode: "venue2026",
  accessCodeHint: "",
  accentColor: "#0f172a",
  logoUrl: null,
  publishStatus: "draft", // 'draft' | 'published'
  lastUpdated: "20 April 2026",
  sectionOrder: [
    "Main Tour",
    "Floorplans",
    "Gallery",
    "Venue Details",
    "Additional Information",
  ],
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
      status: "ready",
      featured: true,
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
      status: "ready",
      featured: false,
    },
    {
      id: "3",
      name: "Back of House Plan",
      type: "pdf",
      url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf",
      description:
        "Detailed back of house layout including kitchen access, loading bay, and service corridors. Shared with qualified partners.",
      category: "Floorplans",
      visibility: "vetted",
      status: "ready",
      featured: false,
    },
    {
      id: "4",
      name: "Venue Gallery",
      type: "image",
      url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=80",
      description:
        "Main ballroom dressed for a gala dinner — a strong representation of the space at its best.",
      category: "Gallery",
      visibility: "both",
      status: "ready",
      featured: false,
    },
    {
      id: "5",
      name: "Emergency & Evacuation Layout",
      type: "pdf",
      url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf",
      description:
        "Exit routes, muster points, and evacuation flow for all primary event spaces.",
      category: "Venue Details",
      visibility: "vetted",
      status: "ready",
      featured: false,
    },
    {
      id: "6",
      name: "Operations Briefing",
      type: "video",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description:
        "A walkthrough of venue setup procedures, AV systems, and day-of logistics. For confirmed clients and production teams.",
      category: "Additional Information",
      visibility: "vetted",
      status: "ready",
      featured: false,
    },
  ],
}

export const ASSET_TYPES = [
  { value: "embed", label: "Virtual Tour" },
  { value: "pdf",   label: "PDF / Floorplan" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "link",  label: "External Link" },
]

export const ASSET_CATEGORIES = [
  "Main Tour",
  "Floorplans",
  "Gallery",
  "Video",
  "Event Spaces",
  "Venue Details",
  "Additional Information",
]

export const VISIBILITY_OPTIONS = [
  { value: "both",   label: "Sales + Vetted", description: "Visible in both views" },
  { value: "sales",  label: "Sales Only",     description: "Visible in Sales View only" },
  { value: "vetted", label: "Vetted Access",  description: "Shared selectively with qualified users" },
]
