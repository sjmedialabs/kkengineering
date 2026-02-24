import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
const SESSION_COOKIE = "admin_session"
const SESSION_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-production"

export interface AdminUser {
  username: string
  role: "admin"
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export async function createSession(user: AdminUser): Promise<string> {
  // In production, use proper JWT or encrypted session tokens
  const sessionData = JSON.stringify({ ...user, timestamp: Date.now() })
  return Buffer.from(sessionData).toString("base64")
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false, // Allow HTTP for local development/testing
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function getSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value

    if (!token) return null

    const sessionData = JSON.parse(Buffer.from(token, "base64").toString())

    // Check if session is expired (7 days)
    const sessionAge = Date.now() - sessionData.timestamp
    if (sessionAge > 60 * 60 * 24 * 7 * 1000) {
      return null
    }

    return { username: sessionData.username, role: sessionData.role }
  } catch {
    return null
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function requireAuth(request: NextRequest) {
  const session = await getSession()

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return null
}
