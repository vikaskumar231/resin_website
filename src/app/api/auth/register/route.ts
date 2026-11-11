import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/lib/repositories/userRepository";
import { signSessionToken, SESSION_COOKIE_NAME, ROLE_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, username, email, phone, password } = body;

    const nameTrim = (name || "").trim();
    const userTrim = (username || "").trim();
    const pwdTrim = (password || "").trim();
    const emailTrim = (email || "").trim();
    const phoneTrim = (phone || "").trim();

    if (!nameTrim || !userTrim || !pwdTrim) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (Full Name, Username, and Password)." },
        { status: 400 }
      );
    }

    if (userTrim.length < 3) {
      return NextResponse.json(
        { success: false, error: "Username must be at least 3 characters long." },
        { status: 400 }
      );
    }

    if (pwdTrim.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Attempt creation in registered user database
    const result = await userRepository.create({
      name: nameTrim,
      username: userTrim,
      email: emailTrim,
      phone: phoneTrim,
      password: pwdTrim,
      role: "CUSTOMER",
    });

    if (result.error || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to register account." },
        { status: 409 }
      );
    }

    const newUser = result.user;

    // Secure HttpOnly signed session token
    const signedToken = await signSessionToken({
      userId: newUser.id,
      role: newUser.role,
    });

    const sanitizedUser = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    };

    const res = NextResponse.json({ success: true, user: sanitizedUser }, { status: 201 });

    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: signedToken,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60,
    });

    res.cookies.set({
      name: ROLE_COOKIE_NAME,
      value: newUser.role,
      httpOnly: false,
      path: "/",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });

    return res;
  } catch (error: any) {
    console.error("[POST /api/auth/register] Error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}

