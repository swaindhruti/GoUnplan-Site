import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    
    if (!q) return NextResponse.json({ results: [] });
console.log("Query:", q);
console.log("hiiii")
    const token = process.env.LOCATIONIQ_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "LOCATIONIQ_ACCESS_TOKEN environment variable not set" },
        { status: 500 }
      );
    }

    const apiUrl = `https://api.locationiq.com/v1/autocomplete?q=${encodeURIComponent(
      q
    )}&key=${token}&limit=6&tag=place:*,boundary:administrative&format=json`;

    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      console.error("LocationIQ error:", res.status);
      return NextResponse.json({ results: [] }, { status: res.status });
    }

    const data = await res.json();

    // Define a minimal type for LocationIQ results and extract place names
    type LocationIQResult = { display_name?: string };
    const places = (Array.isArray(data) ? data : [])
      .map((place: LocationIQResult) => place.display_name)
      .filter(Boolean) as string[];

    return NextResponse.json({ results: places });
    
  } catch (err) {
    console.error("LocationIQ API error:", err);
    return NextResponse.json({ results: [] });
  }
}