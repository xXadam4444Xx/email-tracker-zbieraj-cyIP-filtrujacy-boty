export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "unknown";
  const thread = url.searchParams.get("thread") || "unknown";
  const sent = parseInt(url.searchParams.get("sent")) || 0;

  // Wait at least 15 seconds before logging
  const now = Date.now();
  if (sent && now - sent < 15000) {
    return new Response("", {
      status: 204, // no content
    });
  }

  // Log to Google Apps Script endpoint
  const logUrl = "https://script.google.com/macros/s/AKfycbxynag-DhqvrnZ0n61NPCL2nzyMqVMIH7tZ6jyLC9Nt3P2JlY1nmh_zAwNBqks1OiaB/exec";
  const clientIp = request.headers.get("cf-connecting-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  await fetch(`${logUrl}?id=${encodeURIComponent(id)}&thread=${encodeURIComponent(thread)}&ip=${clientIp}&ua=${encodeURIComponent(userAgent)}`);

  // Return 1x1 pixel
  const gif = Uint8Array.from(
    atob("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="),
    c => c.charCodeAt(0)
  );

  return new Response(gif, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    }
  });
}
