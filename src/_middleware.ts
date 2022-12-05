import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { supabase } from "./utils/supabaseClient";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  alert("hola");

  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }

  if (req.nextUrl.locale === "default") {
    const locale = req.cookies.get("NEXT_LOCALE") || "es";

    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    );
  }

  //The line below isn't working as expected, see README.tx
  //let authResult = await supabase.auth.api.getUserByCookie(req)

  let authResult = await getUser(req);

  if (authResult.error) {
    console.log(
      "Authorization error, redirecting to login page",
      authResult.error
    );
    return NextResponse.redirect(
      `/?ret=${encodeURIComponent(req.nextUrl.pathname)}`
    );
  } else if (!authResult.user) {
    console.log("No auth user, redirecting");
    return NextResponse.redirect(
      `/?ret=${encodeURIComponent(req.nextUrl.pathname)}`
    );
  } else {
    console.log("User is found", authResult.user);
    return NextResponse.next();
  }
}

async function getUser(req: NextRequest): Promise<any> {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  alert(user);

  if (!user) {
    return {
      user: null,
      data: null,
      error: "There is no supabase token in request cookies",
    };
  }

  console.log(user);

  return {
    user: user,
    data: user,
    error: null,
  };

  /*

  let authRequestResult = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        APIKey: process.env.NEXT_PUBLIC_SUPABASE_KEY || "",
      },
    }
  );

  let result = await authRequestResult.json();
  console.log("Supabase auth result", result);
  if (authRequestResult.status != 200) {
    return {
      user: null,
      data: null,
      error: `Supabase auth returned ${authRequestResult.status}. See logs for details`,
    };
  } else if (result.aud === "authenticated") {
    return {
      user: result,
      data: result,
      error: null,
    };
  }
  */

  /*
  let token = req.cookies["sb:token"];
  if (!token) {
    return {
      user: null,
      data: null,
      error: "There is no supabase token in request cookies",
    };
  }
  */
}
