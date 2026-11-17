const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const saltRounds = 12;

function createToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || "1h"
  });
}

function publicUser(user) {
  return { id: user.id, email: user.email };
}

router.post("/register", async (req, res) => {
  const { email, password } = req.body || {};
  if (
    typeof email !== "string" ||
    !emailPattern.test(email.trim()) ||
    email.trim().length > 254 ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 128
  ) {
    return res.status(400).json({
      error: "Provide a valid email and a password between 8 and 128 characters"
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ error: "Email is already registered" });
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);
  try {
    const user = await User.create({ email: normalizedEmail, passwordHash });
    return res.status(201).json({
      user: publicUser(user),
      token: createToken(user.id)
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email is already registered" });
    }
    throw err;
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (
    typeof email !== "string" ||
    !emailPattern.test(email.trim()) ||
    typeof password !== "string" ||
    password.length === 0
  ) {
    return res.status(400).json({ error: "Provide a valid email and password" });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+passwordHash"
  );
  const passwordMatches =
    user && (await bcrypt.compare(password, user.passwordHash));

  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  return res.json({
    user: publicUser(user),
    token: createToken(user.id)
  });
});

module.exports = router;
