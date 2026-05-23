'use client'; 

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useAppSelector } from "@/store/hooks"; 
import { TodoCard } from "@/components/TodoCard";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Agar user logged in nahi hai aur loading khatam ho chuki hai, toh login page par bhejein
    if (!isAuthenticated && !loading) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Jab tak auth state check ho rahi hai, loader dikhayenge
  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
        <CircularProgress sx={{ color: "#FFD600" }} />
        <Typography sx={{ color: "#A0A0A0", fontSize: "0.9rem" }}>Loading your list...</Typography>
      </Box>
    );
  }

  // Agar user authenticated nahi hai toh redirect hone tak kuch render nahi karenge
  if (!isAuthenticated) {
    return null;
  }

  // Agar user logged in hai, toh asli Todo List (`TodoCard`) dikhegi
  return <TodoCard />;
}