import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { validationResult } from "express-validator";

export const adminLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const [rows] = await pool.query("SELECT id, username, password FROM users WHERE username = ?", [
      req.body.username
    ]);

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(req.body.password, rows[0].password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: rows[0].id, username: rows[0].username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      admin: {
        id: rows[0].id,
        username: rows[0].username
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};
