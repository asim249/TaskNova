'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert, 
  Paper,
  IconButton,
  InputAdornment,
  Fade
} from "@mui/material";
import { KeyRound, Eye, EyeOff, Mail } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:2000";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // Form state
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(120);
  const [isExpired, setIsExpired] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format timer
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthText = ["Very Weak", "Weak", "Medium", "Strong"][passwordStrength];
  const strengthColor = ["#FF4444", "#FFA500", "#FFD600", "#4CAF50"][passwordStrength];

  // Reset Password (Single step - OTP + New Password together)
  const handleResetPassword = async () => {
    // Validations
    if (!otp) {
      setError("Please enter OTP code");
      return;
    }

    if (isExpired) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    if (!newPassword) {
      setError("Please enter new password");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          code: otp,
          newPassword: newPassword
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.message || "Password reset failed");

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setIsResending(true);
    setError("");
    setSuccess("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Resend failed");

      setTimeLeft(120);
      setIsExpired(false);
      setSuccess("New OTP sent to your email!");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0B0F1A",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-20%',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(106,0,244,0.3) 0%, rgba(255,122,0,0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-30%',
          right: '-10%',
          width: '70%',
          height: '70%',
          background: 'radial-gradient(circle, rgba(255,122,0.25) 0%, rgba(106,0,244,0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
        },
      }}
    >
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            p: { xs: 3, sm: 4 },
            width: "100%",
            maxWidth: 500,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Gradient Header Bar */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #6A00F4 0%, #FFD600 50%, #FF7A00 100%)",
              borderRadius: "4px 4px 0 0",
            }}
          />

          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "16px",
                background: "rgba(255, 214, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                border: "1px solid rgba(255, 214, 0, 0.2)",
              }}
            >
              <KeyRound size={32} color="#FFD600" />
            </Box>
            <Typography
              variant="h4"
              sx={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontFamily: '"Space Grotesk", sans-serif',
                letterSpacing: "-0.02em",
                mb: 1,
              }}
            >
              Reset Password
            </Typography>
            <Typography sx={{ color: "#A0A0A0", fontSize: "0.9rem" }}>
              Enter OTP and create new password
            </Typography>
          </Box>

          {/* Email Display */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(255, 214, 0, 0.05)",
              border: "1px solid rgba(255, 214, 0, 0.1)",
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Mail size={18} color="#FFD600" />
            <Typography sx={{ color: "#FFFFFF" }}>
              <span style={{ color: "#A0A0A0" }}>Resetting password for: </span>
              {email}
            </Typography>
          </Box>

          {/* Timer */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            {!isExpired ? (
              <Box>
                <Typography
                  sx={{
                    color: timeLeft <= 30 ? "#FF5252" : "#FFD600",
                    fontWeight: 700,
                    fontSize: "2rem",
                    fontFamily: "monospace",
                  }}
                >
                  {formatTime(timeLeft)}
                </Typography>
                <Typography sx={{ color: "#A0A0A0", fontSize: "0.75rem" }}>
                  Time remaining to verify OTP
                </Typography>
              </Box>
            ) : (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                OTP has expired. Please request a new one.
              </Alert>
            )}
          </Box>

          {/* OTP Input */}
          <TextField
            label="OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            disabled={isExpired}
            inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px' } }}
            placeholder="000000"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                '&:hover fieldset': { borderColor: '#FFD600' },
                '&.Mui-focused fieldset': { borderColor: '#FFD600' },
              },
              '& .MuiInputLabel-root': { color: '#A0A0A0' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFD600' },
            }}
          />

          {/* Password Strength Indicator */}
          {newPassword && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ color: '#A0A0A0', fontSize: '0.75rem' }}>
                  Password Strength
                </Typography>
                <Typography sx={{ color: strengthColor, fontSize: '0.75rem', fontWeight: 600 }}>
                  {strengthText}
                </Typography>
              </Box>
              <Box sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: `${(passwordStrength / 4) * 100}%`,
                    height: '100%',
                    bgcolor: strengthColor,
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
            </Box>
          )}

          {/* New Password Field */}
          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            disabled={isExpired}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                '&:hover fieldset': { borderColor: '#FFD600' },
                '&.Mui-focused fieldset': { borderColor: '#FFD600' },
              },
              '& .MuiInputLabel-root': { color: '#A0A0A0' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFD600' },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#A0A0A0' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirm Password Field */}
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            disabled={isExpired}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                '&:hover fieldset': { borderColor: '#FFD600' },
                '&.Mui-focused fieldset': { borderColor: '#FFD600' },
              },
              '& .MuiInputLabel-root': { color: '#A0A0A0' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFD600' },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: '#A0A0A0' }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password Requirements */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              mb: 3,
            }}
          >
            <Typography sx={{ color: '#A0A0A0', fontSize: '0.75rem', mb: 1 }}>
              Password must contain:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <Typography component="li" sx={{ color: newPassword.length >= 8 ? '#4CAF50' : '#A0A0A0', fontSize: '0.75rem' }}>
                ✓ At least 8 characters
              </Typography>
              <Typography component="li" sx={{ color: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? '#4CAF50' : '#A0A0A0', fontSize: '0.75rem' }}>
                ✓ Uppercase & lowercase letters
              </Typography>
              <Typography component="li" sx={{ color: /[0-9]/.test(newPassword) ? '#4CAF50' : '#A0A0A0', fontSize: '0.75rem' }}>
                ✓ At least one number
              </Typography>
            </Box>
          </Box>

          {/* Error / Success */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          {/* Reset Password Button */}
          <Button
            onClick={handleResetPassword}
            disabled={isSubmitting || isExpired}
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#FFD600",
              color: "#0B0F1A",
              fontWeight: 700,
              py: 1.5,
              mb: 2,
              '&:hover': { bgcolor: "#FFE44D", transform: 'translateY(-2px)' },
              '&:disabled': { bgcolor: 'rgba(255,214,0,0.3)' },
              transition: 'all 0.3s ease',
            }}
          >
            {isSubmitting ? <CircularProgress size={24} sx={{ color: "#0B0F1A" }} /> : "Reset Password"}
          </Button>

          {/* Resend Button */}
          {(isExpired || timeLeft <= 30) && (
            <Button
              onClick={handleResend}
              disabled={isResending}
              fullWidth
              variant="outlined"
              sx={{
                borderColor: "#FFD600",
                color: "#FFD600",
                py: 1.5,
                '&:hover': { borderColor: "#FFE44D", bgcolor: 'rgba(255,214,0,0.05)' },
              }}
            >
              {isResending ? <CircularProgress size={24} sx={{ color: "#FFD600" }} /> : "Resend New OTP"}
            </Button>
          )}
        </Paper>
      </Fade>
    </Box>
  );
}