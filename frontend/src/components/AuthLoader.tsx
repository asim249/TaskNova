"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { loginSuccess, logout } from "../store/authSlice";
import { CircularProgress, Box } from "@mui/material";

export default function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:2000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(loginSuccess(data.user)); // ✅ isAuthenticated = true
        } else {
          dispatch(logout()); // ✅ isAuthenticated = false
        }
      } catch (error) {
        console.error("Auth sync error:", error);
        dispatch(logout());
      } finally {
        setChecking(false);
      }
    };

    checkSession(); // ✅ Sirf ek baar chalega
  }, [dispatch]); // ✅ pathname dependency hatao

  if (checking) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#121212" }}>
        <CircularProgress sx={{ color: "#FFD600" }} />
      </Box>
    );
  }

  return <>{children}</>;
}