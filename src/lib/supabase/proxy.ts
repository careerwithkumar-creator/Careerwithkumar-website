import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

const SESSION_COOKIE = "cwk_sid";

export async function updateSession(request: NextRequest, event: NextFetchEvent) {
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);
  const sessionId = hasSessionCookie
    ? request.cookies.get(SESSION_COOKIE)!.value
    : crypto.randomUUID();
  if (!hasSessionCookie) {
    request.cookies.set(SESSION_COOKIE, sessionId);
  }

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");

  let response = NextResponse.next({ request });

  // Auth only matters on /admin routes — skip the Supabase round trip on
  // every public page load, and never let a missing/misconfigured project
  // take down the public site (fail closed on /admin, open elsewhere).
  if (isAdminRoute) {
    response = await handleAdminAuth(request, path);
  }

  if (!hasSessionCookie) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      path: "/",
    });
  }

  recordJobViewOnce(event, request, response, path, sessionId);

  return response;
}

async function handleAdminAuth(request: NextRequest, path: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set — admin routes are locked out until Supabase is configured.",
    );
    if (path === "/admin/login") return NextResponse.next({ request });
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Supabase auth check failed in proxy:", error);
  }

  // Being logged in isn't enough — public signup uses the same Supabase Auth
  // as the admin panel, so any signed-up job seeker would otherwise pass a
  // plain "is there a user" check. Only the configured admin email may in.
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = !!user && !!adminEmail && user.email === adminEmail;

  if (path !== "/admin/login" && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (path === "/admin/login" && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

// Server-side view counting, done here (rather than in the page component)
// because only middleware/route handlers can set a cookie ahead of the
// response — this keeps the increment on the initial page load, with no
// client-side round trip, and de-dupes refreshes for 24h via a per-slug cookie.
//
// The actual write is handed to `event.waitUntil` so it runs in the
// background instead of blocking the response: the DB call has nothing to do
// with what the visitor is waiting to see, so it must not sit in front of it.
function recordJobViewOnce(
  event: NextFetchEvent,
  request: NextRequest,
  response: NextResponse,
  path: string,
  sessionId: string,
) {
  if (request.method !== "GET") return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return;

  const match = path.match(/^\/jobs\/([^/]+)\/?$/);
  if (!match) return;

  const slug = match[1];
  const viewedCookie = `cwk_viewed_${slug}`;
  if (request.cookies.has(viewedCookie)) return;

  event.waitUntil(
    fetch(`${supabaseUrl}/rest/v1/rpc/record_post_view_by_slug`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_slug: slug, p_session_id: sessionId }),
    }).catch(() => {
      // View counting is best-effort; never fail the request over it.
    }),
  );

  response.cookies.set(viewedCookie, "1", {
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    path: "/",
  });
}
