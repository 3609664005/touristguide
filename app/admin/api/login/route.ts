import { NextRequest, NextResponse } from "next/server";
import { sealData } from "iron-session";

const SESSION_PASSWORD = process.env.SESSION_SECRET || "token-secret-at-least-32-chars-long!!";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "未配置管理员密码" }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    const token = await sealData({ isLoggedIn: true }, { password: SESSION_PASSWORD });

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}