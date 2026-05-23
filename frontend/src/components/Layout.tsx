'use client'
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { store } from "@/store/store";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0B0F1A",
      paper: "rgba(255, 255, 255, 0.08)",
    },
    primary: {
      main: "#FFD600", // Yellow
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A0A0A0",
    },
    divider: "rgba(255, 214, 0, 0.4)",
  },
  typography: {
    fontFamily: '"Inter", "Space Grotesk", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0B0F1A",
          color: "#FFFFFF",
        },
      },
    },
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#0B0F1A",
            position: "relative",
            overflow: "hidden", // Kept overflow hidden to contain the large blurred glow blobs
            px: 2,
            py: 4,
          }}
          id="app-root-layout"
        >
          {/* BACKGROUND GLOW BLOB 1 (Purple) */}
          <Box
            sx={{
              position: "absolute",
              width: { xs: "280px", md: "450px" },
              height: { xs: "280px", md: "450px" },
              borderRadius: "50%",
              background: "radial-gradient(circle, #6A00F4 0%, rgba(106, 0, 244, 0) 70%)",
              bottom: "-10%",
              left: "15%",
              filter: "blur(100px)",
              opacity: 0.35,
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* BACKGROUND GLOW BLOB 2 (Orange) */}
          <Box
            sx={{
              position: "absolute",
              width: { xs: "280px", md: "450px" },
              height: { xs: "280px", md: "450px" },
              borderRadius: "50%",
              background: "radial-gradient(circle, #FF7A00 0%, rgba(255, 122, 0, 0) 70%)",
              bottom: "-10%",
              right: "15%",
              filter: "blur(100px)",
              opacity: 0.35,
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* Centered content wrapper */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            {children}
          </Box>
        </Box>
      </ThemeProvider>
    </Provider>
  );
};

export default Layout;