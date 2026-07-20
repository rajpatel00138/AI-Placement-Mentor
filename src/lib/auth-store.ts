import bcrypt from "bcryptjs";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

type GlobalWithUsers = typeof globalThis & {
  __placementMentorUsers?: Map<string, StoredUser>;
};

const globalWithUsers = globalThis as GlobalWithUsers;

if (!globalWithUsers.__placementMentorUsers) {
  globalWithUsers.__placementMentorUsers = new Map<string, StoredUser>();
}

export async function createUserFallback(input: { name: string; email: string; password: string; role?: string }) {
  const email = input.email.toLowerCase().trim();
  const existing = globalWithUsers.__placementMentorUsers?.get(email);

  if (existing) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user: StoredUser = {
    id: `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    email,
    password: passwordHash,
    role: input.role ?? "student",
  };

  globalWithUsers.__placementMentorUsers?.set(email, user);
  return user;
}

export async function findUserByEmailFallback(email: string) {
  return globalWithUsers.__placementMentorUsers?.get(email.toLowerCase().trim()) ?? null;
}
