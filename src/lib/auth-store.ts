import bcrypt from "bcryptjs";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  image?: string | null;
  role: "student" | "recruiter";
  college?: string | null;
  branch?: string | null;
  batch?: string | null;
  graduationYear?: number | null;
  targetRole?: string | null;
  targetCompany?: string | null;
  lastLoginAt?: Date | null;
  createdAt?: Date;
};

type GlobalWithUsers = typeof globalThis & {
  __placementMentorUsers?: Map<string, StoredUser>;
};

const globalWithUsers = globalThis as GlobalWithUsers;

function ensureSeeded() {
  if (!globalWithUsers.__placementMentorUsers) {
    globalWithUsers.__placementMentorUsers = new Map<string, StoredUser>();
  }

  const defaultPasswordHash = bcrypt.hashSync("password123", 10);

  // 1. Authorized Recruiter Accounts
  if (!globalWithUsers.__placementMentorUsers.has("recruiter@placementmentor.com")) {
    globalWithUsers.__placementMentorUsers.set("recruiter@placementmentor.com", {
      id: "recruiter_001",
      name: "Talent Partner",
      email: "recruiter@placementmentor.com",
      password: defaultPasswordHash,
      image: null,
      role: "recruiter",
      college: null,
      branch: null,
      batch: null,
      lastLoginAt: new Date(),
      createdAt: new Date(),
    });
  }

  if (!globalWithUsers.__placementMentorUsers.has("recruiter@mentor.com")) {
    globalWithUsers.__placementMentorUsers.set("recruiter@mentor.com", {
      id: "recruiter_002",
      name: "Global Recruiter",
      email: "recruiter@mentor.com",
      password: defaultPasswordHash,
      image: null,
      role: "recruiter",
      college: null,
      branch: null,
      batch: null,
      lastLoginAt: new Date(),
      createdAt: new Date(),
    });
  }

  // 2. Demo Student Account (Starts clean)
  if (!globalWithUsers.__placementMentorUsers.has("demo@placementmentor.com")) {
    globalWithUsers.__placementMentorUsers.set("demo@placementmentor.com", {
      id: "demo_001",
      name: "Demo Student",
      email: "demo@placementmentor.com",
      password: defaultPasswordHash,
      image: null,
      role: "student",
      college: "Apex Institute of Technology",
      branch: "CSE",
      batch: "2025-A",
      graduationYear: 2025,
      targetRole: "Full Stack Engineer",
      targetCompany: "Google",
      lastLoginAt: new Date(),
      createdAt: new Date(),
    });
  }
}

ensureSeeded();

export async function createUserFallback(input: {
  name: string;
  email: string;
  password?: string;
  image?: string | null;
  role?: "student" | "recruiter";
  college?: string | null;
  branch?: string | null;
  batch?: string | null;
}) {
  ensureSeeded();
  const email = input.email.toLowerCase().trim();
  const existing = globalWithUsers.__placementMentorUsers?.get(email);

  if (existing) {
    throw new Error("User already exists");
  }

  const passwordHash = input.password ? await bcrypt.hash(input.password, 10) : "";
  // Unconditionally default new user signups to "student" unless explicitly passed
  const userRole = input.role || "student";

  const user: StoredUser = {
    id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name: input.name.trim(),
    email,
    password: passwordHash,
    image: input.image ?? null,
    role: userRole,
    college: input.college ?? null,
    branch: input.branch ?? null,
    batch: input.batch ?? null,
    lastLoginAt: new Date(),
    createdAt: new Date(),
  };

  globalWithUsers.__placementMentorUsers?.set(email, user);
  return user;
}

export async function findUserByEmailFallback(email: string) {
  ensureSeeded();
  const normalized = email.toLowerCase().trim();
  const user = globalWithUsers.__placementMentorUsers?.get(normalized);
  return user ?? null;
}

export async function findUserByIdFallback(id: string) {
  ensureSeeded();
  if (!globalWithUsers.__placementMentorUsers) return null;
  for (const user of globalWithUsers.__placementMentorUsers.values()) {
    if (user.id === id) return user;
  }
  return null;
}

export async function updateUserLastLoginFallback(email: string, extra?: { name?: string; image?: string | null }) {
  ensureSeeded();
  const user = globalWithUsers.__placementMentorUsers?.get(email.toLowerCase().trim());
  if (user) {
    user.lastLoginAt = new Date();
    if (extra?.name) user.name = extra.name;
    if (extra?.image) user.image = extra.image;
    globalWithUsers.__placementMentorUsers?.set(email.toLowerCase().trim(), user);
  }
}

export async function getAllRegisteredStudentsFallback(): Promise<StoredUser[]> {
  ensureSeeded();
  if (!globalWithUsers.__placementMentorUsers) return [];
  const students: StoredUser[] = [];
  for (const user of globalWithUsers.__placementMentorUsers.values()) {
    if (user.role === "student") {
      students.push(user);
    }
  }
  return students;
}
