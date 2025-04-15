export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const id = url.searchParams.get("id") || "unknown";
  const threadId = url.searchParams.get("thread") || "unknown";
  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.headers.get("cf-connecting-ip") || "unknown";

  // 🛡️ Block common bots and preloaders
  const blockedAgents = [
    "GoogleImageProxy",
    "Googlebot",
    "curl",
    "wget",
    "python-requests",
    "Go-http-client",
    "Java/",
    "GmailProxy",
    "fetch"
  ];

  const isBot = blockedAgents.some(bot =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );

  if (isBot) {
    console.log(`🚫 Blocked bot/preloader: ${userAgent}`);
    return new Response("Ignored bot", { status: 204 });
  }

  // ⏱️ Wait 20 seconds before logging (to avoid preloading hits)
  await new Promise(resolve => setTimeout(resolve, 20000));

  // 🔗 Send tracking data to Apps Script
  const logUrl = "https://script.google.com/macros/s/PASTE_YOUR_SCRIPT_DEPLOYMENT_URL_HERE/exec";
  const fullTrackUrl = `${logUrl}?id=${encodeURIComponent(id)}&thread=${encodeURIComponent(threadId)}&ip=${encodeURIComponent(ip)}&ua=${encodeURIComponent(userAgent)}`;

  try {
    await fetch(fullTrackUrl);
    console.log(`✅ Logged: ${id}, IP: ${ip}`);
  } catch (err) {
    console.error("❌ Logging error:", err);
  }

  // 🖼️ 1×1 transparent GIF
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