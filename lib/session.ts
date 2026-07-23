import { unsealData } from "iron-session";

const SESSION_PASSWORD = process.env.SESSION_SECRET || "token-secret-at-least-32-chars-long!!";

export async function verifyToken(authHeader: string | null): Promise<boolean> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  try {
    const token = authHeader.slice(7);
    const data = await unsealData<{ isLoggedIn: boolean }>(token, { password: SESSION_PASSWORD });
    return data.isLoggedIn === true;
  } catch {
    return false;
  }
}