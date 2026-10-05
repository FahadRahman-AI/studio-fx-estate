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

/** AI pipeline phases for the pinned process timeline under the intro. */
export const pipeline = [
  {
    title: "Motion Extraction",
    meta: "Stage 01 — Input: Listing photography",
    body: "We read depth, scale and sightlines from your photos, renders or plans, then plot one continuous camera path through the home.",
  },
  {
    title: "Aesthetic Mapping",
    meta: "Stage 02 — Reference: Light and material",
    body: "Each room is matched to a look: time of day, palette, lens and pace, so the whole film grades as one piece.",
  },
  {
    title: "Generative Synthesis",
    meta: "Stage 03 — Process: Image-to-video",
    body: "The pipeline generates every sequence along the path, then we art-direct the transitions until each move feels physical.",
  },
  {
    title: "Cinematic Render",
    meta: "Stage 04 — Output: Graded film",
    body: "Final frames are upscaled, graded and scored, with vertical cuts for social delivered alongside the master.",
  },
];

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

// PLACEHOLDER — replace with real tours. Add `video: "/videos/<file>.mp4"` once footage exists.
export const tours: { name: string; place: string; length: string; pipeline: string; video?: string }[] = [
  { name: "The glass house", place: "Beverley Hills", length: "2:40", pipeline: "Generative FPV", video: "/videos/the-glass-house.mp4" },
  { name: "Harbour Lofts", place: "Bristol", length: "1:55", pipeline: "Image-to-video" },
  { name: "Westcombe Farm", place: "Somerset", length: "3:10", pipeline: "Synthetic rendering" },
  { name: "102 Siena Drive", place: "Beverley Hills", length: "2:05", pipeline: "Image-to-video", video: "/videos/102-siena-drive.mp4" },
];

export const steps = [
  { day: 0, title: "You send the assets", body: "Share listing photos, renders or floor plans and tell us which spaces sell the home. We storyboard the camera path for your sign-off." },
  { day: 3, title: "We generate it", body: "Our pipeline generates each sequence, then we art-direct light, pacing and transitions until every move feels physical." },
  { day: 7, title: "You get the film", body: "A graded, scored walkthrough plus vertical cuts for social, ready for your listing." },
];
export const processSpanDays = 7;

export const shotOptions = ["Generative FPV", "Image-to-video", "Synthetic rendering", "Golden hour"];
