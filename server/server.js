const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const { PrismaClient } = require("@prisma/client")

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Middleware
app.use(cors())
app.use(express.json())

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Email transporter setup (configure with your email service)
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" })
})

// Auth Routes

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    })

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Failed to register user" })
  }
})

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid email or password" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    })

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Failed to login" })
  }
})

// Get user profile
app.get("/api/auth/profile", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Profile error:", error)
    res.status(500).json({ error: "Failed to get profile" })
  }
})

// Update user profile
app.put("/api/auth/profile", authenticateToken, async (req, res) => {
  try {
    const { name } = req.body

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    res.json(user)
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({ error: "Failed to update profile" })
  }
})

// Forgot password
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // For development, just return success without sending email
    res.json({ message: "Password reset email sent" })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({ error: "Failed to send reset email" })
  }
})

// Reset password
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    res.json({ message: "Password reset successful" })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({ error: "Failed to reset password" })
  }
})

// Donation Routes

// Get all donations
app.get("/api/donations", async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
    })
    res.json(donations)
  } catch (error) {
    console.error("Error fetching donations:", error)
    res.status(500).json({ error: "Failed to fetch donations" })
  }
})

// Get donations by user
app.get("/api/donations/user/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params
    const donations = await prisma.donation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
    res.json(donations)
  } catch (error) {
    console.error("Error fetching user donations:", error)
    res.status(500).json({ error: "Failed to fetch user donations" })
  }
})

// Get assigned donations for delivery
app.get("/api/donations/assigned", async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      where: {
        status: {
          in: ["assigned", "picked-up"],
        },
      },
      orderBy: { createdAt: "desc" },
    })
    res.json(donations)
  } catch (error) {
    console.error("Error fetching assigned donations:", error)
    res.status(500).json({ error: "Failed to fetch assigned donations" })
  }
})

// Get donation count
app.get("/api/donations/count", async (req, res) => {
  try {
    const count = await prisma.donation.count()
    res.json({ count })
  } catch (error) {
    console.error("Error fetching donation count:", error)
    res.status(500).json({ error: "Failed to fetch donation count" })
  }
})

// Get comprehensive statistics
app.get("/api/donations/stats", async (req, res) => {
  try {
    const donations = await prisma.donation.findMany()

    const stats = {
      total: donations.length,
      pending: donations.filter((d) => d.status === "pending").length,
      assigned: donations.filter((d) => d.status === "assigned").length,
      pickedUp: donations.filter((d) => d.status === "picked-up").length,
      completed: donations.filter((d) => d.status === "donated").length,
      totalItems: donations.reduce((sum, d) => sum + (d.quantity || 1), 0),
      totalUsers: [...new Set(donations.map((d) => d.userId))].length,
      foodDonations: donations.filter((d) => d.type === "food").length,
      clothesDonations: donations.filter((d) => d.type === "clothes").length,
      completionRate:
        donations.length > 0
          ? Math.round((donations.filter((d) => d.status === "donated").length / donations.length) * 100)
          : 0,
    }

    res.json(stats)
  } catch (error) {
    console.error("Error fetching donation stats:", error)
    res.status(500).json({ error: "Failed to fetch donation stats" })
  }
})

// Get user-specific statistics
app.get("/api/donations/user/:userId/stats", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params
    const donations = await prisma.donation.findMany({
      where: { userId },
    })

    const stats = {
      total: donations.length,
      pending: donations.filter((d) => d.status === "pending").length,
      assigned: donations.filter((d) => d.status === "assigned").length,
      pickedUp: donations.filter((d) => d.status === "picked-up").length,
      completed: donations.filter((d) => d.status === "donated").length,
      totalItems: donations.reduce((sum, d) => sum + (d.quantity || 1), 0),
      impactScore: donations.reduce((score, d) => {
        const baseScore = d.quantity * 10
        const multiplier = { pending: 0.25, assigned: 0.5, "picked-up": 0.75, donated: 1.0 }
        return score + baseScore * (multiplier[d.status] || 0)
      }, 0),
      completionRate:
        donations.length > 0
          ? Math.round((donations.filter((d) => d.status === "donated").length / donations.length) * 100)
          : 0,
    }

    res.json(stats)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    res.status(500).json({ error: "Failed to fetch user stats" })
  }
})

// Create donation
app.post("/api/donations", authenticateToken, async (req, res) => {
  try {
    const donation = await prisma.donation.create({
      data: req.body,
    })
    res.status(201).json(donation)
  } catch (error) {
    console.error("Error creating donation:", error)
    res.status(500).json({ error: "Failed to create donation" })
  }
})

// Update donation
app.put("/api/donations/:id", async (req, res) => {
  try {
    const { id } = req.params
    const donation = await prisma.donation.update({
      where: { id },
      data: req.body,
    })
    res.json(donation)
  } catch (error) {
    console.error("Error updating donation:", error)
    res.status(500).json({ error: "Failed to update donation" })
  }
})

// Delete donation
app.delete("/api/donations/:id", async (req, res) => {
  try {
    const { id } = req.params
    await prisma.donation.delete({
      where: { id },
    })
    res.json({ message: "Donation deleted successfully" })
  } catch (error) {
    console.error("Error deleting donation:", error)
    res.status(500).json({ error: "Failed to delete donation" })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ error: "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
