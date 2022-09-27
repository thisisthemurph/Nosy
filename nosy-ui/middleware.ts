import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	console.log("middleware");

	const authed = await isAuthenticated(request);

	if (authed) {
		console.log("middleware - authenticated");
		return NextResponse.next();
	}

	console.log("middleware - not authenticated");
	return NextResponse.redirect(new URL("/auth/login", request.url));
}

async function isAuthenticated(req: NextRequest): Promise<boolean> {
	let token = req.cookies.get("sb-access-token");

	if (!token) {
		console.log("Return a");
		return false;
	}

	let authResult = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
		headers: {
			Authorization: `Bearer ${token}`,
			APIKey: process.env.NEXT_PUBLIC_SUPABASE_API_KEY || "",
		},
	});

	if (authResult.status != 200) {
		console.log("Return b");
		return false;
	}

	const result = await authResult.json();
	if (authResult.status == 200 && result.aud === "authenticated") {
		console.log("Return c");
		return true;
	}

	console.log("Return d");
	return false;
}

export const config = {
	matcher: "/admin/:path*",
};
