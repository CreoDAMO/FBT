import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import * as nodemailer from "nodemailer";
import { storage } from "./storage";
import { User as SelectUser, insertUserSchema } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-here-change-in-production';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-super-secure-session-secret-key-here-change-in-production';

// Email configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// JWT utilities
export function generateJWT(user: SelectUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role,
      walletAddress: user.walletAddress,
      authProvider: user.authProvider 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyJWT(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Password reset utilities
const passwordResetTokens = new Map<string, { email: string; expires: Date }>();

export function generatePasswordResetToken(email: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour from now
  passwordResetTokens.set(token, { email, expires });
  return token;
}

export function validatePasswordResetToken(token: string): string | null {
  const tokenData = passwordResetTokens.get(token);
  if (!tokenData) return null;
  
  if (new Date() > tokenData.expires) {
    passwordResetTokens.delete(token);
    return null;
  }
  
  return tokenData.email;
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
    
    await emailTransporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@fastbitepro.com',
      to: email,
      subject: 'FastBite Pro - Password Reset',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>We received a request to reset your password for your FastBite Pro account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            If the button doesn't work, copy and paste this URL into your browser:<br>
            ${resetUrl}
          </p>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
            
            if (!user) {
              // Create new user
              const userData = {
                username: profile.emails?.[0]?.value || profile.id,
                email: profile.emails?.[0]?.value || '',
                password: await hashPassword(crypto.randomBytes(32).toString('hex')), // Random password
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
                role: 'customer',
                authProvider: 'google' as const,
              };
              
              user = await storage.createUser(userData);
            } else if (!user.authProvider || user.authProvider === 'email') {
              // Link existing email account with Google
              await storage.updateUser(user.id, { authProvider: 'google' });
              user = await storage.getUser(user.id);
            }

            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // Facebook Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: "/api/auth/facebook/callback",
          profileFields: ['id', 'emails', 'name'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
            
            if (!user) {
              // Create new user
              const userData = {
                username: profile.emails?.[0]?.value || profile.id,
                email: profile.emails?.[0]?.value || '',
                password: await hashPassword(crypto.randomBytes(32).toString('hex')), // Random password
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
                role: 'customer',
                authProvider: 'facebook' as const,
              };
              
              user = await storage.createUser(userData);
            } else if (!user.authProvider || user.authProvider === 'email') {
              // Link existing email account with Facebook
              await storage.updateUser(user.id, { authProvider: 'facebook' });
              user = await storage.getUser(user.id);
            }

            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication middleware
  const authenticateJWT = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyJWT(token);
      if (decoded) {
        req.user = decoded;
        return next();
      }
    }

    return res.status(401).json({ message: 'Access token required' });
  };

  // Routes
  
  // Traditional login
  app.post("/api/auth/login", async (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }

      req.login(user, (err) => {
        if (err) {
          console.error("Session error:", err);
          return res.status(500).json({ message: "Session error" });
        }

        const token = generateJWT(user);
        res.json({ 
          user: { 
            id: user.id, 
            username: user.username, 
            email: user.email, 
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            walletAddress: user.walletAddress,
            authProvider: user.authProvider
          },
          token 
        });
      });
    })(req, res, next);
  });

  // Registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username) || 
                          await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        authProvider: 'email'
      });

      req.login(user, (err) => {
        if (err) {
          console.error("Session error:", err);
          return res.status(500).json({ message: "Session error" });
        }

        const token = generateJWT(user);
        res.status(201).json({ 
          user: { 
            id: user.id, 
            username: user.username, 
            email: user.email, 
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            walletAddress: user.walletAddress,
            authProvider: user.authProvider
          },
          token 
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Web3 wallet login
  app.post("/api/auth/wallet-login", async (req, res) => {
    try {
      const { walletAddress, provider } = req.body;
      
      if (!walletAddress || !provider) {
        return res.status(400).json({ message: "Wallet address and provider required" });
      }

      let user = await storage.getUserByWalletAddress?.(walletAddress);
      
      if (!user) {
        // Create new user for this wallet
        const userData = {
          username: `${provider}_${walletAddress.slice(0, 8)}`,
          email: `${walletAddress}@${provider}.wallet`,
          password: await hashPassword(crypto.randomBytes(32).toString('hex')), // Random password
          role: 'customer',
          walletAddress,
          authProvider: provider as 'metamask' | 'coinbase',
        };
        
        user = await storage.createUser(userData);
      }

      req.login(user, (err) => {
        if (err) {
          console.error("Session error:", err);
          return res.status(500).json({ message: "Session error" });
        }

        const token = generateJWT(user);
        res.json({ 
          user: { 
            id: user.id, 
            username: user.username, 
            email: user.email, 
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            walletAddress: user.walletAddress,
            authProvider: user.authProvider
          },
          token 
        });
      });
    } catch (error) {
      console.error("Wallet login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Google OAuth routes
  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get("/api/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/auth?error=google" }),
    (req, res) => {
      const token = generateJWT(req.user as SelectUser);
      res.redirect(`/auth?token=${token}&success=true`);
    }
  );

  // Facebook OAuth routes
  app.get("/api/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
  app.get("/api/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/auth?error=facebook" }),
    (req, res) => {
      const token = generateJWT(req.user as SelectUser);
      res.redirect(`/auth?token=${token}&success=true`);
    }
  );

  // Forgot password
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not
        return res.json({ message: "If the email exists, a reset link has been sent" });
      }

      const resetToken = generatePasswordResetToken(email);
      const emailSent = await sendPasswordResetEmail(email, resetToken);
      
      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send reset email" });
      }

      res.json({ message: "If the email exists, a reset link has been sent" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reset password
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      const email = validatePasswordResetToken(token);
      if (!email) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(user.id, { password: hashedPassword });
      
      // Remove the used token
      passwordResetTokens.delete(token);

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.sendStatus(200);
      });
    });
  });

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = req.user as SelectUser;
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      walletAddress: user.walletAddress,
      authProvider: user.authProvider
    });
  });

  return authenticateJWT;
}