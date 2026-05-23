"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Collapse,
  InputAdornment,
  IconButton
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";

import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupFailure,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
} from "@/store/authSlice";

// Icons
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  UserIcon,
} from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup" | "forgot-password";
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(""); 
  
  // UI Flow States
  const [isOtpStep, setIsOtpStep] = useState(false); 
  const [successMsg, setSuccessMsg] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    // Basic Validations
    if (!email) {
      setFormError("Email address is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (mode !== "forgot-password" && !password) {
      setFormError("Password is required.");
      return;
    }
    if (mode === "signup" && !name) {
      setFormError("Name is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. LOGIN FLOW
      if (mode === "login") {
        dispatch(loginStart());

        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Invalid credentials");
        }

        dispatch(loginSuccess(data.user)); 
        router.push("/");
      } 
      
      // 2. SIGNUP FLOW (With OTP Requirement)
      else if (mode === "signup") {
        if (!isOtpStep) {
          dispatch(signupStart());
          const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Signup failed");

          // setIsOtpStep(true);
          setSuccessMsg("An OTP has been sent to your email. Please verify.");
          router.push(`/verify?email=${encodeURIComponent(email)}`);
        } else {
          const res = await fetch(`${BACKEND_URL}/api/auth/verify-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Invalid OTP");

          setSuccessMsg("Verification successful! You can now log in.");
          setIsOtpStep(false);
          router.push("/login");
        }
      } 
      
      // 3. FORGOT PASSWORD FLOW
      else if (mode === "forgot-password") {
        if (!isOtpStep) {
          dispatch(forgotPasswordStart());

          // Step i: User enters email, backend sends OTP [cite: 22]
          const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Email not found");

          setIsOtpStep(true);
          setSuccessMsg("OTP sent to your email registry.");
          router.push('/reset-password')
        } else {
          //User enters OTP and changes password if correct [cite: 23]
          const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otp, newPassword: password }), // Yahan password field ko hi new password maan rahe hain
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Invalid OTP or Reset action failed");

          dispatch(forgotPasswordSuccess());
          setSuccessMsg("Password successfully reset! Moving to login...");
          setTimeout(() => router.push("/login"), 2000);
        }
      }

    } catch (err: any) {
      console.error("Fetch API Error:", err.message);
      setFormError(err.message || "Server connectivity issue. Try again.");
      
      // Dispatching standard redux actions on failure
      if (mode === "login") dispatch(loginFailure(err.message));
      if (mode === "signup") dispatch(signupFailure(err.message));
      if (mode === "forgot-password") dispatch(forgotPasswordFailure(err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "420px",
        borderRadius: "24px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        p: 4,
        position: "relative",
        zIndex: 10,
        "&:hover": {
          borderColor: "rgba(255, 214, 0, 0.15)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
        },
        transition: "all 0.3s ease",
      }}
      id={`auth-card-${mode}`}
    >
      {/* Upper absolute glow helper */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #6A00F4 0%, #FFD600 50%, #FF7A00 100%)",
          borderRadius: "24px 24px 0 0",
        }}
      />

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontFamily: '"Space Grotesk", sans-serif',
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            mb: 1,
          }}
          id="auth-title"
        >
          {mode === "login" && "Welcome Back"}
          {mode === "signup" && "Create Account"}
          {mode === "forgot-password" && "Reset Password"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#A0A0A0", fontFamily: '"Inter", sans-serif' }}>
          {mode === "login" && "Access your premium shopping todo list"}
          {mode === "signup" && "Join us to manage checklists effortlessly"}
          {mode === "forgot-password" && "Enter your email to receive a recovery link"}
        </Typography>
      </Box>

      {/* Form Error / Success Alerts */}
      <Collapse in={!!formError || !!successMsg}>
        <Box sx={{ mb: 3 }}>
          {formError ? (
            <Alert
              severity="error"
              variant="outlined"
              onClose={() => setFormError("")}
              sx={{
                color: "#FF4D4D",
                borderColor: "rgba(255, 77, 77, 0.3)",
                backgroundColor: "rgba(255, 77, 77, 0.05)",
                borderRadius: "12px",
                "& .MuiAlert-icon": { color: "#FF4D4D" },
              }}
            >
              {formError}
            </Alert>
          ) : (
            <Alert
              severity="success"
              variant="outlined"
              onClose={() => setSuccessMsg("")}
              sx={{
                color: "#4CAF50",
                borderColor: "rgba(76, 175, 80, 0.3)",
                backgroundColor: "rgba(76, 175, 80, 0.05)",
                borderRadius: "12px",
                "& .MuiAlert-icon": { color: "#4CAF50" },
              }}
            >
              {successMsg}
            </Alert>
          )}
        </Box>
      </Collapse>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Name (Signup only) */}
        {mode === "signup" && (
          <Box>
            <Typography variant="caption" sx={{ color: "#A0A0A0", mb: 1, display: "block", fontWeight: 600 }}>
              YOUR NAME
            </Typography>
            <TextField
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setFormError("");
              }}
              fullWidth
              variant="outlined"
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <UserIcon size={18} className="text-[#A0A0A0]" />
                    </InputAdornment>
                  ),
                  sx: {
                    color: "#FFFFFF",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "rgba(255, 214, 0, 0.3)",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                    },
                    "&.Mui-focused": {
                      borderColor: "#FFD600",
                      boxShadow: "0 0 0 3px rgba(255, 214, 0, 0.15)",
                    },
                    fieldset: { display: "none" },
                  },
                },
              }}
              id="auth-name-input"
            />
          </Box>
        )}

        {/* Email Address */}
        <Box>
          <Typography variant="caption" sx={{ color: "#A0A0A0", mb: 1, display: "block", fontWeight: 600 }}>
            EMAIL ADDRESS
          </Typography>
          <TextField
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value.trim()) setFormError("");
            }}
            fullWidth
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} className="text-[#A0A0A0]" />
                  </InputAdornment>
                ),
                sx: {
                  color: "#FFFFFF",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "rgba(255, 214, 0, 0.3)",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                  },
                  "&.Mui-focused": {
                    borderColor: "#FFD600",
                    boxShadow: "0 0 0 3px rgba(255, 214, 0, 0.15)",
                  },
                  fieldset: { display: "none" },
                },
              },
            }}
            id="auth-email-input"
          />
        </Box>

        {/* Password (Login and Signup only) */}
        {mode !== "forgot-password" && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="caption" sx={{ color: "#A0A0A0", fontWeight: 600 }}>
                PASSWORD
              </Typography>
              {mode === "login" && (
                <Typography
                  onClick={() => router.push("/forgot-password")}
                  sx={{
                    fontSize: "0.75rem",
                    color: "#A0A0A0",
                    fontWeight: 500,
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": { color: "#FFD600" },
                    transition: "color 0.15s ease",
                  }}
                  id="link-forgot"
                >
                  Forgot Password?
                </Typography>
              )}
            </Box>
            <TextField
              // type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.trim()) setFormError("");
              }}
              fullWidth
              variant="outlined"
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} className="text-[#A0A0A0]" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton  size="small" tabIndex={-1} sx={{ color: "#A0A0A0" }}>
                        {/* {showPassword ? <EyeOff size={16} /> : <Eye size={16} />} */}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    color: "#FFFFFF",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "rgba(255, 214, 0, 0.3)",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                    },
                    "&.Mui-focused": {
                      borderColor: "#FFD600",
                      boxShadow: "0 0 0 3px rgba(255, 214, 0, 0.15)",
                    },
                    fieldset: { display: "none" },
                  },
                },
              }}
              id="auth-password-input"
            />
          </Box>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#FFD600",
            color: "#0B0F1A",
            borderRadius: "14px",
            py: 1.5,
            fontWeight: 700,
            fontSize: "0.95rem",
            fontFamily: '"Space Grotesk", sans-serif',
            textTransform: "none",
            boxShadow: "0 4px 20px rgba(255, 214, 0, 0.25)",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              backgroundColor: "#FFE040",
              boxShadow: "0 6px 25px rgba(255, 214, 0, 0.4)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(1px)",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(255, 214, 0, 0.4)",
              color: "rgba(11, 15, 26, 0.5)",
            },
          }}
          id="auth-submit-btn"
        >
          {isSubmitting ? (
            <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              {mode === "login" && "Sign In"}
              {mode === "signup" && "Register"}
              {mode === "forgot-password" && "Send Reset Link"}
            </>
          )}
        </Button>
      </Box>

      {/* Footer Links */}
      <Box sx={{ mt: 4, textAlign: "center", borderTop: "1px solid rgba(255, 255, 255, 0.06)", pt: 3 }}>
        {mode === "login" && (
          <Typography variant="body2" sx={{ color: "#A0A0A0" }}>
            Don't have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              style={{ color: "#FFD600", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              id="link-signup"
            >
              Sign Up
            </span>
          </Typography>
        )}

        {mode === "signup" && (
          <Typography variant="body2" sx={{ color: "#A0A0A0" }}>
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              style={{ color: "#FFD600", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              id="link-login"
            >
              Sign In
            </span>
          </Typography>
        )}

        {mode === "forgot-password" && (
          <Button
            onClick={() => router.push("/login")}
            startIcon={<ArrowLeft size={16} />}
            sx={{
              color: "#A0A0A0",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.85rem",
              "&:hover": { color: "#FFD600", backgroundColor: "transparent" },
            }}
            id="link-back-login"
          >
            Back to Sign In
          </Button>
        )}
      </Box>
    </Box>
  );
};


