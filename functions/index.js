export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const id = url.searchParams.get("id") || "unknown";
  const threadId = url.searchParams.get("thread") || "unknown";
  const sentTimestamp = parseInt(url.searchParams.get("sent") || "0", 10);
  const userAgent = request.headers.get("user-agent") || "unknown";
  const ip = request.headers.get("cf-connecting-ip") || "unknown";

  const now = Date.now();
  const timeSinceSent = now - sentTimestamp;

  // ⏳ Skip logging if pixel was loaded too early (e.g., within first 15s)
  if (timeSinceSent < 15000) {
    console.log(`⏸️ Pixel ignored (too early): ${id}, ${timeSinceSent}ms`);
  } else {
    // 🔗 Send to Apps Script
    const logUrl = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
    const fullTrackUrl = `${logUrl}?id=${encodeURIComponent(id)}&thread=${encodeURIComponent(threadId)}&ip=${encodeURIComponent(ip)}&ua=${encodeURIComponent(userAgent)}`;

    try {
      await fetch(fullTrackUrl);
      console.log(`✅ Tracked: ${id} after ${Math.round(timeSinceSent / 1000)}s`);
    } catch (err) {
      console.error("❌ Logging failed:", err);
    }
  }

  // 🖼️ Return transparent 1×1 GIF
  const gif = Uint8Array.from(
    atob("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="),
    c => c.charCodeAt(0)
  );

  return new Response(gif, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
    }
  });
}
