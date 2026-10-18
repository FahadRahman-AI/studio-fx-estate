/**
 * The visitor's country as detected by Vercel's edge from their IP
 * (`x-vercel-ip-country`, ISO 3166-1 alpha-2). Null when not deployed on Vercel,
 * e.g. in local development. Not cached: every visitor gets their own answer.
 */
export function GET(request: Request) {
  const country = request.headers.get("x-vercel-ip-country");
  return Response.json({ country }, { headers: { "Cache-Control": "private, no-store" } });
}
