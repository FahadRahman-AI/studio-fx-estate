/**
 * All site copy lives here. Anything marked PLACEHOLDER needs real data
 * before launch — nothing below is a claim about real clients or results.
 */

export const brand = {
  name: "Studio FX Estate",
  email: "hello@example.com", // PLACEHOLDER
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
];

export const disciplines = ["Interior FPV", "Aerial", "Twilight"];

/** Hero walkthrough chapters. `from`/`to` are scroll progress (0–1). */
export const chapters = [
  { word: "Arrival", from: 0.12, to: 0.34 },
  { word: "Threshold", from: 0.34, to: 0.56 },
  { word: "Light", from: 0.56, to: 0.78 },
  { word: "View", from: 0.78, to: 1.01 },
] as const;

/** Length of the placeholder walkthrough, used for the HUD timecode. */
export const heroDurationSeconds = 48;

export const intro = {
  title: "Spaces defined by movement",
  body: "Every film starts by walking the house. We find the line through it that buyers will remember, then fly it in one unbroken take.",
};

// PLACEHOLDER
export const featured = {
  name: "Wannsee Residence",
  specs: [
    { label: "Location", value: "Surrey Hills" },
    { label: "Runtime", value: "2:50" },
    { label: "Format", value: "FPV + aerial" },
    { label: "Year", value: "2026" },
  ],
};

// PLACEHOLDER — these read as real results; replace before launch.
export const stats = [
  { value: "96%", label: "Booked a viewing" },
  { value: "48+", label: "Homes filmed" },
  { value: "7", label: "Days to delivery" },
];

// PLACEHOLDER counts
export const services = [
  { name: "Interior FPV", count: "48+ homes", body: "One continuous flight from the front door through every room that sells the house." },
  { name: "Aerial", count: "62+ estates", body: "Grounds, boundaries and setting, shot high and wide so buyers understand the plot." },
  { name: "Twilight", count: "30+ exteriors", body: "The house lit from inside at blue hour, when the architecture reads clearest." },
];

// PLACEHOLDER — replace with real tours.
export const tours = [
  { name: "The Orchard House", place: "Cotswolds", length: "2:40" },
  { name: "Harbour Lofts", place: "Bristol", length: "1:55" },
  { name: "Westcombe Farm", place: "Somerset", length: "3:10" },
  { name: "No. 9 Chalk Lane", place: "Lewes", length: "2:05" },
];

export const steps = [
  { day: 0, title: "You send the address", body: "Tell us about the property and the rooms that sell it. We plan the flight path and send it back for sign-off." },
  { day: 3, title: "We fly it", body: "One crew, half a day on site. Interior FPV first, aerials and twilight if booked." },
  { day: 7, title: "You get the film", body: "A graded, scored walkthrough plus vertical cuts for social, ready for your listing." },
];
export const processSpanDays = 7;

export const shotOptions = ["Interior FPV", "Aerial", "Twilight", "Grounds"];
