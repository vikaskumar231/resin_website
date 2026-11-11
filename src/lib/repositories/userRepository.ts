import fs from "fs";
import path from "path";
import crypto from "crypto";

export type UserRole = "CUSTOMER" | "ARTISAN_ADMIN" | "WORKSHOP_MAKER";

export interface UserRecord {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  try {
    const testHash = hashPassword(password, salt);
    const testBuffer = Buffer.from(testHash, "hex");
    const hashBuffer = Buffer.from(hash, "hex");
    if (testBuffer.length !== hashBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(testBuffer, hashBuffer);
  } catch {
    return false;
  }
}

export interface UserRepository {
  getAll(): Promise<UserRecord[]>;
  findByIdentifier(identifier: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
  create(data: {
    name: string;
    username: string;
    email?: string;
    phone?: string;
    password: string;
    role?: UserRole;
  }): Promise<{ user?: UserRecord; error?: string }>;
}

export class FileUserRepository implements UserRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), "src", "data", "users.json");
    this.ensureFileExists();
  }

  private getDefaultUsers(): UserRecord[] {
    const adminUser = (process.env.ADMIN_USERNAME || "Vikas").trim();
    const adminPass = (process.env.ADMIN_PASSWORD || "Vikas").trim();

    const adminSalt = crypto.randomBytes(16).toString("hex");
    const adminHash = hashPassword(adminPass, adminSalt);

    const custSalt = crypto.randomBytes(16).toString("hex");
    const custHash = hashPassword("Customer123", custSalt);

    const rahulSalt = crypto.randomBytes(16).toString("hex");
    const rahulHash = hashPassword("Rahul123", rahulSalt);

    return [
      {
        id: "user_admin_vikas_01",
        username: adminUser,
        name: `${adminUser} Kumar`,
        email: `${adminUser.toLowerCase()}@artaalay.com`,
        phone: "+91 98765 43210",
        role: "ARTISAN_ADMIN",
        passwordHash: adminHash,
        salt: adminSalt,
        createdAt: "2026-10-25T10:00:00.000Z",
      },
      {
        id: "user_cust_priya_01",
        username: "Customer",
        name: "Priya Sharma",
        email: "priya@example.com",
        phone: "+91 98111 22334",
        role: "CUSTOMER",
        passwordHash: custHash,
        salt: custSalt,
        createdAt: "2026-10-26T12:00:00.000Z",
      },
      {
        id: "user_cust_rahul_02",
        username: "rahul_patel",
        name: "Rahul Patel",
        email: "rahul@example.com",
        phone: "+91 98222 33445",
        role: "CUSTOMER",
        passwordHash: rahulHash,
        salt: rahulSalt,
        createdAt: "2026-10-27T14:30:00.000Z",
      },
    ];
  }

  private ensureFileExists(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.getDefaultUsers(), null, 2),
        "utf-8"
      );
      return;
    }

    try {
      const raw = fs.readFileSync(this.filePath, "utf-8").trim();
      if (!raw) {
        fs.writeFileSync(
          this.filePath,
          JSON.stringify(this.getDefaultUsers(), null, 2),
          "utf-8"
        );
      }
    } catch {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.getDefaultUsers(), null, 2),
        "utf-8"
      );
    }
  }

  private readFromDisk(): UserRecord[] {
    try {
      this.ensureFileExists();
      const raw = fs.readFileSync(this.filePath, "utf-8");
      return JSON.parse(raw);
    } catch (err) {
      console.error("[FileUserRepository] Error reading users from disk:", err);
      return this.getDefaultUsers();
    }
  }

  private writeToDisk(users: UserRecord[]): void {
    try {
      this.ensureFileExists();
      fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2), "utf-8");
    } catch (err) {
      console.error("[FileUserRepository] Error writing users to disk:", err);
      throw new Error("Failed to write users to disk storage.");
    }
  }

  async getAll(): Promise<UserRecord[]> {
    return this.readFromDisk();
  }

  async findByIdentifier(identifier: string): Promise<UserRecord | null> {
    const list = this.readFromDisk();
    const clean = identifier.trim().toLowerCase();
    const found = list.find(
      (u) =>
        u.username.toLowerCase() === clean ||
        u.email.toLowerCase() === clean ||
        (u.phone && u.phone.replace(/[^0-9]/g, "") === clean.replace(/[^0-9]/g, ""))
    );
    return found || null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    const list = this.readFromDisk();
    return list.find((u) => u.id === id) || null;
  }

  async create(data: {
    name: string;
    username: string;
    email?: string;
    phone?: string;
    password: string;
    role?: UserRole;
  }): Promise<{ user?: UserRecord; error?: string }> {
    const list = this.readFromDisk();
    const cleanUsername = data.username.trim();
    const cleanEmail = (data.email || "").trim().toLowerCase();

    // Check for existing username
    if (list.some((u) => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      return { error: `Username "${cleanUsername}" is already taken. Please choose another or sign in.` };
    }

    // Check for existing email if provided
    if (cleanEmail && list.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { error: `An account with email "${cleanEmail}" already exists. Please sign in instead.` };
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = hashPassword(data.password, salt);

    const newUser: UserRecord = {
      id: `user_cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      username: cleanUsername,
      name: data.name.trim(),
      email: cleanEmail || `${cleanUsername.toLowerCase()}@artaalay.com`,
      phone: data.phone?.trim(),
      role: data.role || "CUSTOMER",
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
    };

    const updated = [...list, newUser];
    this.writeToDisk(updated);
    return { user: newUser };
  }
}

// Pluggable Singleton Instance
export const userRepository: UserRepository = new FileUserRepository();

