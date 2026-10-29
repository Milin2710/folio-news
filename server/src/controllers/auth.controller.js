import bcrypt from "bcryptjs";
import { signToken } from "../middleware/auth.js";
import { createUser, findUserByEmail, findUserById } from "../models/user.model.js";
import { badRequest, unauthorized } from "../utils/httpError.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(req, res) {
  const { name, email, password } = req.body;
  const cleanEmail = String(email || "").trim().toLowerCase();

  if (!EMAIL_PATTERN.test(cleanEmail)) throw badRequest("Enter a valid email address");
  if (!password || password.length < 8) throw badRequest("Password must be at least 8 characters");
  if (await findUserByEmail(cleanEmail)) throw badRequest("An account with this email already exists");

  const user = await createUser({
    name: String(name || "").trim() || cleanEmail.split("@")[0],
    email: cleanEmail,
    passwordHash: await bcrypt.hash(password, 10),
  });

  res.status(201).json({ token: signToken(user.id), user });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const found = await findUserByEmail(String(email || "").trim().toLowerCase());

  const valid = found && (await bcrypt.compare(String(password || ""), found.password_hash));
  if (!valid) throw unauthorized("Incorrect email or password");

  const user = { id: found.id, name: found.name, email: found.email };
  res.json({ token: signToken(user.id), user });
}

export async function me(req, res) {
  const user = await findUserById(req.userId);
  if (!user) throw unauthorized();
  res.json({ user });
}
