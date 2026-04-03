import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { validationResult } from "express-validator";

const signToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

export const adminLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const [rows] = await pool.query("SELECT id, username, full_name, email, password, role FROM users WHERE username = ?", [
      req.body.username
    ]);

    if (!rows.length || rows[0].role !== "admin") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(req.body.password, rows[0].password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(rows[0]);

    return res.json({
      token,
      admin: {
        id: rows[0].id,
        username: rows[0].username,
        fullName: rows[0].full_name,
        email: rows[0].email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

export const customerRegister = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, username, email, password } = req.body;

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existing.length) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (username, full_name, email, password, role) VALUES (?, ?, ?, ?, 'customer')",
      [username, fullName, email, hashedPassword]
    );

    const user = {
      id: result.insertId,
      username,
      role: "customer"
    };

    return res.status(201).json({
      token: signToken(user),
      customer: {
        id: result.insertId,
        username,
        fullName,
        email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const customerLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      "SELECT id, username, full_name, email, password, role FROM users WHERE email = ? AND role = 'customer'",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, rows[0].password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: signToken(rows[0]),
      customer: {
        id: rows[0].id,
        username: rows[0].username,
        fullName: rows[0].full_name,
        email: rows[0].email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};
