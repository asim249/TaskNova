'use client';

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Trash2, CheckCircle, Circle } from "lucide-react";
import { motion } from "motion/react";
import { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, currentStatus: boolean) => void; // Hamare naye fetch call ke liye current status pass karna behtar hai
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2.22,
          px: 1,
          borderBottom: "1px solid rgba(255, 214, 0, 0.25)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            borderBottomColor: "rgba(255, 214, 0, 0.5)",
          },
        }}
        id={`todo-item-${todo.id}`}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
          {/* Left number badge */}
          <Box
            onClick={() => onToggle(todo.id, todo.completed)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#FFD600",
              color: "#0B0F1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.875rem",
              fontFamily: '"Space Grotesk", sans-serif',
              cursor: "pointer",
              boxShadow: todo.completed ? "none" : "0 0 10px rgba(255, 214, 0, 0.4)",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              flexShrink: 0,
              opacity: todo.completed ? 0.4 : 1,
              transform: todo.completed ? "scale(0.9)" : "scale(1)",
              "&:hover": {
                transform: "scale(1.08)",
                boxShadow: "0 0 15px rgba(255, 214, 0, 0.7)",
              },
            }}
            id={`badge-${todo.id}`}
          >
            {todo.completed ? "" : todo.order}
          </Box>

          {/* Left checkbox status indicator before the text */}
          <IconButton
            onClick={() => onToggle(todo.id, todo.completed)}
            sx={{
              color: todo.completed ? "#FFD600" : "rgba(255, 255, 255, 0.3)",
              p: 0.5,
              "&:hover": {
                color: "#FFD600",
                backgroundColor: "rgba(255, 214, 0, 0.08)",
              },
              mr: -1,
            }}
          >
            {todo.completed ? (
              <CheckCircle size={18} className="text-brand-yellow" />
            ) : (
              <Circle size={18} />
            )}
          </IconButton>

          {/* Center text */}
          <Typography
            onClick={() => onToggle(todo.id, todo.completed)}
            sx={{
              color: todo.completed ? "#A0A0A0" : "#FFFFFF",
              textDecoration: todo.completed ? "line-through" : "none",
              fontFamily: '"Inter", sans-serif',
              fontSize: "1rem",
              fontWeight: todo.completed ? 400 : 500,
              cursor: "pointer",
              userSelect: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              transition: "all 0.25s ease",
              flex: 1,
              opacity: todo.completed ? 0.6 : 1,
              "&:hover": {
                color: todo.completed ? "#FFFFFF" : "#FFD600",
              },
            }}
            id={`task-text-${todo.id}`}
          >
            {todo.text}
          </Typography>
        </Box>

        {/* Right delete icon */}
        <IconButton
          onClick={() => onDelete(todo.id)}
          sx={{
            color: "rgba(255, 255, 255, 0.4)",
            p: 1,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              color: "#FF4D4D",
              backgroundColor: "rgba(255, 77, 77, 0.08)",
              transform: "scale(1.1)",
            },
          }}
          id={`delete-btn-${todo.id}`}
        >
          <Trash2 size={18} />
        </IconButton>
      </Box>
    </motion.div>
  );
};