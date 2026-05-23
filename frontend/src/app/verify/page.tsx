'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:2000";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  //  2 min timer
  const [timeLeft, setTimeLeft] = useState(120);
  const [isExpired, setIsExpired] = useState(false);

  //  Timer countdown
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

  //  Format timer — 2:00 format
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  //  OTP Verify
  const handleVerify = async () => {
    if (!otp) {
      setError("OTP daalo");
      return;
    }

    if (isExpired) {
      setError("OTP expired");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.message || "Invalid OTP");

      setSuccess("Email verified successfully");
      setTimeout(() => router.push("/login"), 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  //  Resend OTP
//   const handleResend = async () => {
//     setIsResending(true);
//     setError("");
//     setSuccess("");
//     setOtp("");

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/auth/resend-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Resend failed");

//       // ✅ Timer reset karo
//       setTimeLeft(120);
//       setIsExpired(false);
//       setSuccess("new otp sent");

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsResending(false);
//     }
//   };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Box sx={{
        bgcolor: "#1E1E1E",
        borderRadius: 3,
        p: 4,
        width: "100%",
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}>
        {/* Heading */}
        <Typography variant="h5" sx={{ color: "#FFD600", fontWeight: 700, textAlign: "center" }}>
          Email Verify Karo
        </Typography>

        <Typography sx={{ color: "#A0A0A0", textAlign: "center", fontSize: "0.9rem" }}>
          OTP Send: <strong style={{ color: "#fff" }}>{email}</strong>
        </Typography>

        {/* Timer */}
        <Box sx={{ textAlign: "center" }}>
          {!isExpired ? (
            <Typography sx={{
              color: timeLeft <= 30 ? "#FF5252" : "#FFD600", // ✅ 30 sec mein red ho jaye
              fontWeight: 700,
              fontSize: "1.5rem",
            }}>
              ⏱ {formatTime(timeLeft)}
            </Typography>
          ) : (
            <Typography sx={{ color: "#FF5252", fontWeight: 700 }}>
              ❌ OTP expired
            </Typography>
          )}
        </Box>

        {/* OTP Input */}
        <TextField
          label="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          fullWidth
          disabled={isExpired}
          slotProps={{ htmlInput: { maxLength: 6 } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#FFD600" },
              "&.Mui-focused fieldset": { borderColor: "#FFD600" },
            },
            "& .MuiInputLabel-root": { color: "#A0A0A0" },
          }}
        />

        {/* Error / Success */}
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {/* Verify Button */}
        {!isExpired && (
          <Button
            onClick={handleVerify}
            disabled={isSubmitting}
            fullWidth
            variant="contained"
            sx={{ bgcolor: "#FFD600", color: "#000", fontWeight: 700, "&:hover": { bgcolor: "#e6c200" } }}
          >
            {isSubmitting ? <CircularProgress size={22} sx={{ color: "#000" }} /> : "Verify Karo"}
          </Button>
        )}

        {/* Resend Button — sirf tab dikhao jab expire ho ya 30 sec bache */}
        {(isExpired || timeLeft <= 30) && (
          <Button
            // onClick={handleResend}
            disabled={isResending}
            fullWidth
            variant="outlined"
            sx={{ borderColor: "#FFD600", color: "#FFD600", "&:hover": { borderColor: "#e6c200" } }}
          >
            {isResending ? <CircularProgress size={22} sx={{ color: "#FFD600" }} /> : "Naya OTP Bhejo"}
          </Button>
        )}

        {/* Back to login */}
        {/* <Typography
          onClick={() => router.push("/login")}
          sx={{ color: "#A0A0A0", textAlign: "center", cursor: "pointer", fontSize: "0.85rem", "&:hover": { color: "#FFD600" } }}
        >
          Go to login
        </Typography> */}
      </Box>
    </Box>
  );
}