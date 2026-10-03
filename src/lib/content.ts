/**
 * All site copy lives here. Anything marked PLACEHOLDER needs real data
 * before launch — nothing below is a claim about real clients or results.
 */

export const brand = {
  name: "Studio FX Estate",
  email: "hello@example.com", // PLACEHOLDER
};

export const nav = [
  { label: "Walkthroughs", href: "#work" },
  { label: "Workflows", href: "#services" },
  { label: "Process", href: "#process" },
];

export const disciplines = ["Generative FPV", "Image-to-video", "Synthetic rendering"];
/** Shorter set for the hero strip, which only has three grid columns. */
export const heroTags = ["Generative FPV", "Image-to-video"];

/**
 * Hero walkthrough chapters, timed to the scenes in footage/hero.mp4.
 * `from`/`to` are scroll progress (0–1) = frame / 167.
 */
export const chapters = [
  { word: "Arrival", from: 0.06, to: 0.18 }, // driveway, through the glass doors
  { word: "Light", from: 0.18, to: 0.42 }, // sunlit living room and great room
  { word: "Grounds", from: 0.42, to: 0.6 }, // across the lawn
  { word: "Detail", from: 0.6, to: 0.84 }, // terrace dining, floating stair
  { word: "Retreat", from: 0.84, to: 1.01 }, // stone bathroom, cinema room
] as const;

/** Length of the hero clip, used for the HUD timecode. */
export const heroDurationSeconds = 14;

export const intro = {
  title: "From listing photos to moving tours",
  body: "Send us the photography, renders or floor plans for a property. Our pipeline generates one continuous camera move through it, art-directed shot by shot, so buyers understand the layout before they visit.",
};

// PLACEHOLDER
export const featured = {
  name: "Wannsee Residence",
  specs: [
    { label: "Location", value: "Surrey Hills" },
    { label: "Runtime", value: "2:50" },
    { label: "Pipeline", value: "Image-to-video" },
    { label: "Year", value: "2026" },
  ],
};

// PLACEHOLDER — "48+" reads as a real result; replace before launch.
export const stats = [
  { value: "48+", label: "Estates generated" },
  { value: "0", label: "Cameras on site" },
  { value: "7", label: "Days to delivery" },
];

export const services = [
  {
    name: "Generative FPV property tours",
    meta: "Workflow: Generative FPV",
    body: "One continuous first-person sweep from the driveway through every room, on camera paths no drone could physically or legally fly.",
  },
  {
    name: "Image-to-video walkthroughs",
    meta: "Pipeline: Image-to-video",
    body: "Your existing listing photography becomes moving footage, with seamless transitions between rooms and nothing new to shoot.",
  },
  {
    name: "Synthetic architectural rendering",
    meta: "Input: Plans and renders",
    body: "For off-plan and unbuilt estates, we generate finished, furnished interiors from your plans and design renders, at any time of day, including golden hour.",
  },
];

// PLACEHOLDER — replace with real tours.
export const tours = [
  { name: "The Orchard House", place: "Cotswolds", length: "2:40" },
  { name: "Harbour Lofts", place: "Bristol", length: "1:55" },
  { name: "Westcombe Farm", place: "Somerset", length: "3:10" },
  { name: "No. 9 Chalk Lane", place: "Lewes", length: "2:05" },
];

export const steps = [
  { day: 0, title: "You send the assets", body: "Share listing photos, renders or floor plans and tell us which spaces sell the home. We storyboard the camera path for your sign-off." },
  { day: 3, title: "We generate it", body: "Our pipeline generates each sequence, then we art-direct light, pacing and transitions until every move feels physical." },
  { day: 7, title: "You get the film", body: "A graded, scored walkthrough plus vertical cuts for social, ready for your listing." },
];
export const processSpanDays = 7;

export const shotOptions = ["Generative FPV", "Image-to-video", "Synthetic rendering", "Golden hour"];
