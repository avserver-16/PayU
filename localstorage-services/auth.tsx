/**
 * auth.tsx
 *
 * Uses expo-secure-store for persistent auth storage.
 * Falls back to in-memory storage if SecureStore is unavailable (simulators, web).
 *
 * Setup — run ONE of these:
 *   expo install expo-secure-store          ← Expo managed workflow
 *   npx expo install expo-secure-store      ← same thing
 *
 * No extra pod-install or linking needed in Expo Go / managed workflow.
 */

import * as SecureStore from "expo-secure-store";
import { clearFinances } from "./finances";

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  USERS: "auth_users",        // SecureStore keys cannot contain ":"
  CURRENT_USER: "auth_current",
  TOKEN: "auth_token",
} as const;

// ─── In-memory fallback (web / test environments) ─────────────────────────────

const memStore: Record<string, string> = {};

async function storageGet(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return memStore[key] ?? null;
  }
}

async function storageSet(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    memStore[key] = value;
  }
}

async function storageDelete(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    delete memStore[key];
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthSession {
  user: Omit<User, "passwordHash">;
  token: string;
  loginAt: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  session?: AuthSession;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(36)}_${password.length}`;
}

function generateToken(): string {
  return (
    Math.random().toString(36).substring(2) +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2)
  );
}

function generateId(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
}

async function getUsers(): Promise<User[]> {
  try {
    const raw = await storageGet(KEYS.USERS);
    if (!raw) return [];
    return JSON.parse(raw) as User[];
  } catch (e) {
    console.warn("[auth] getUsers parse error:", e);
    return [];
  }
}

async function saveUsers(users: User[]): Promise<boolean> {
  try {
    await storageSet(KEYS.USERS, JSON.stringify(users));
    return true;
  } catch (e) {
    console.warn("[auth] saveUsers error:", e);
    return false;
  }
}

async function createSession(user: User): Promise<AuthSession> {
  const { passwordHash, ...safeUser } = user;
  const token = generateToken();
  const loginAt = new Date().toISOString();

  try {
    await storageSet(KEYS.CURRENT_USER, JSON.stringify(safeUser));
    await storageSet(KEYS.TOKEN, token);
  } catch (e) {
    console.warn("[auth] createSession write error:", e);
  }

  return { user: safeUser, token, loginAt };
}

// ─── Get User Data ────────────────────────────────────────────────────────────

/**
 * Returns the currently logged-in user's public data (no passwordHash).
 * Returns null if no session exists.
 */
export async function getCurrentUser(): Promise<Omit<User, "passwordHash"> | null> {
  try {
    const userJson = await storageGet(KEYS.CURRENT_USER);
    if (!userJson) return null;
    return JSON.parse(userJson) as Omit<User, "passwordHash">;
  } catch (e) {
    console.warn("[auth] getCurrentUser error:", e);
    return null;
  }
}

/**
 * Looks up any user by email.
 * Returns their public data (no passwordHash), or null if not found.
 */
export async function getUserByEmail(
  email: string
): Promise<Omit<User, "passwordHash"> | null> {
  try {
    const users = await getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  } catch (e) {
    console.warn("[auth] getUserByEmail error:", e);
    return null;
  }
}

/**
 * Looks up any user by their id.
 * Returns their public data (no passwordHash), or null if not found.
 */
export async function getUserById(
  id: string
): Promise<Omit<User, "passwordHash"> | null> {
  try {
    const users = await getUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  } catch (e) {
    console.warn("[auth] getUserById error:", e);
    return null;
  }
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signUp(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<AuthResult> {
  try {
    if (!fullName.trim())
      return { success: false, message: "Full name is required." };

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return { success: false, message: "Please enter a valid email address." };

    if (password.length < 6)
      return { success: false, message: "Password must be at least 6 characters." };

    if (password !== confirmPassword)
      return { success: false, message: "Passwords do not match." };

    const users = await getUsers();
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (exists)
      return { success: false, message: "An account with this email already exists." };

    const newUser: User = {
      id: generateId(),
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    const saved = await saveUsers([...users, newUser]);
    if (!saved)
      return { success: false, message: "Storage error. Please try again." };

    const session = await createSession(newUser);
    return { success: true, message: "Account created successfully.", session };
  } catch (e) {
    console.error("[auth] signUp error:", e);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    if (!email.trim())
      return { success: false, message: "Email is required." };
    if (!password)
      return { success: false, message: "Password is required." };

    const users = await getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user)
      return { success: false, message: "No account found with this email." };

    if (user.passwordHash !== hashPassword(password))
      return { success: false, message: "Incorrect password." };

    const session = await createSession(user);
    return { success: true, message: "Logged in successfully.", session };
  } catch (e) {
    console.error("[auth] signIn error:", e);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  try {
    await storageDelete(KEYS.CURRENT_USER);
    await storageDelete(KEYS.TOKEN);
  } catch (e) {
    console.warn("[auth] signOut error:", e);
  }
}

// ─── Get Current Session ──────────────────────────────────────────────────────

export async function getCurrentSession(): Promise<AuthSession | null> {
  try {
    const userJson = await storageGet(KEYS.CURRENT_USER);
    const token = await storageGet(KEYS.TOKEN);
    if (!userJson || !token) return null;
    const user = JSON.parse(userJson) as Omit<User, "passwordHash">;
    return { user, token, loginAt: new Date().toISOString() };
  } catch (e) {
    console.warn("[auth] getCurrentSession error:", e);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await storageGet(KEYS.TOKEN);
    return !!token;
  } catch {
    return false;
  }
}

// ─── Update Password ──────────────────────────────────────────────────────────

export async function updatePassword(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<AuthResult> {
  try {
    if (newPassword.length < 6)
      return { success: false, message: "New password must be at least 6 characters." };

    const users = await getUsers();
    const index = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (index === -1)
      return { success: false, message: "User not found." };
    if (users[index].passwordHash !== hashPassword(currentPassword))
      return { success: false, message: "Current password is incorrect." };

    users[index].passwordHash = hashPassword(newPassword);
    await saveUsers(users);
    return { success: true, message: "Password updated successfully." };
  } catch (e) {
    console.error("[auth] updatePassword error:", e);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

// ─── Delete Account ───────────────────────────────────────────────────────────

export async function deleteAccount(
  email: string,
  // password: string
): Promise<AuthResult> {
  try {
    const users = await getUsers();
    const index = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (index === -1)
      return { success: false, message: "User not found." };
    // if (users[index].passwordHash !== hashPassword(password))
      // return { success: false, message: "Incorrect password." };

    users.splice(index, 1);
    await clearFinances();
    await Promise.all([
      storageDelete(KEYS.TOKEN),
      storageDelete(KEYS.CURRENT_USER),
    ]);
    await saveUsers(users);
    await signOut();
    return { success: true, message: "Account deleted." };
  } catch (e) {
    console.error("[auth] deleteAccount error:", e);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

export async function updateUserDetails(
  userId: string,
  updates: { fullName?: string; email?: string }
): Promise<AuthResult> {
  try {
    const users = await getUsers();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      return { success: false, message: "User not found." };
    }

    // Validate name
    // if (updates.fullName !== undefined) {
    //   if (!updates.fullName.trim()) {
    //     return { success: false, message: "Full name cannot be empty." };
    //   }
    //   users[index].fullName = updates.fullName.trim();
    // }

    // Validate email
    if (updates.email !== undefined) {
      const email = updates.email.toLowerCase().trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, message: "Invalid email format." };
      }

      const emailExists = users.some(
        (u, i) => i !== index && u.email === email
      );

      if (emailExists) {
        return { success: false, message: "Email already in use." };
      }

      users[index].email = email;
    }

    // Save updated users
    await saveUsers(users);

    // Update current session if this user is logged in
    const currentUserJson = await storageGet(KEYS.CURRENT_USER);
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);

      if (currentUser.id === userId) {
        const updatedUser = {
          ...currentUser,
          ...updates,
        };

        await storageSet(KEYS.CURRENT_USER, JSON.stringify(updatedUser));
      }
    }

    const updatedUser = users[index];
    const { passwordHash, ...safeUser } = updatedUser;

    return {
      success: true,
      message: "User details updated successfully.",
      session: {
        user: safeUser,
        token: (await storageGet(KEYS.TOKEN)) || "",
        loginAt: new Date().toISOString(),
      },
    };
  } catch (e) {
    console.error("[auth] updateUserDetails error:", e);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}