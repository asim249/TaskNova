"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Eye, Trash2, Pencil, LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logout as logoutAction } from "@/store/authSlice";

interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const TodoCard: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  // Update

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(
    "medium",
  );
  const [editDueDate, setEditDueDate] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();
  const logout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        dispatch(logoutAction());
        router.push("/login");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // Fetch all todos
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/todos/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data = await response.json();
      console.log(data);
      setTodos(data && Array.isArray(data.todos) ? data.todos : []);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single todo
  const fetchSingleTodo = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/todos/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch todo");
      const data = await response.json();
      if (data && data.todo) {
        setSelectedTodo(data.todo);
      } else {
        setSelectedTodo(null);
      }
    } catch (err) {
      console.error("Error fetching todo:", err);
      setError("Failed to load todo details");
    }
  };

  // Create new todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          dueDate: dueDate || undefined,
          completed: false,
        }),
      });

      if (!response.ok) throw new Error("Failed to create todo");

      // Clear form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setError("");

      // Refresh todos
      await fetchTodos();
    } catch (err) {
      console.error("Error creating todo:", err);
      setError("Failed to create todo");
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete todo");

      // Clear selected todo if it was deleted
      if (selectedTodo?._id === id) {
        setSelectedTodo(null);
      }

      // Refresh todos
      await fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete todo");
    }
  };

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate || "");
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;
    const id = editingTodo._id;
    if (!editTitle.trim()) {
      setError("Title is required");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim() || undefined,
          priority: editPriority,
          dueDate: editDueDate || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to update todo");

      setEditingTodo(null);
      await fetchTodos(); // Refresh list
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("Failed to update todo");
    }
  };

  // Handle view todo
  const handleViewTodo = (id: string) => {
    fetchSingleTodo(id);
  };

  // Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0B0F1A",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            pb: 2,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: "#FFFFFF",
              fontWeight: 600,
            }}
          >
            Todo Manager
          </Typography>

          <Button
            variant="outlined"
            color="error"
            onClick={logout} // Aapka logout function yahan chalega
            startIcon={<LogOut size={16} />} // Lucide-react ka icon (Agar use kar rahe hain)
            sx={{
              textTransform: "none",
              borderColor: "rgba(255, 68, 68, 0.5)",
              color: "#FF4444",
              "&:hover": {
                borderColor: "#FF4444",
                backgroundColor: "rgba(255, 68, 68, 0.05)",
              },
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Add Todo Form */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 2,
            p: 3,
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#FFFFFF",
              mb: 2,
              fontWeight: 600,
            }}
          >
            Add New Todo
          </Typography>

          <Box component="form" onSubmit={handleAddTodo}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#FFFFFF",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                    "&:hover fieldset": { borderColor: "#FFD600" },
                  },
                  "& .MuiInputLabel-root": { color: "#A0A0A0" },
                }}
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#FFFFFF",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                    "&:hover fieldset": { borderColor: "#FFD600" },
                  },
                  "& .MuiInputLabel-root": { color: "#A0A0A0" },
                }}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#A0A0A0" }}>Priority</InputLabel>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    label="Priority"
                    sx={{
                      color: "#FFFFFF",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.08)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFD600",
                      },
                    }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  type="date"
                  // label="Due Date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  // InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#FFFFFF",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                      "&:hover fieldset": { borderColor: "#FFD600" },
                    },
                    "& .MuiInputLabel-root": { color: "#A0A0A0" },
                  }}
                />
              </Stack>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#FFD600",
                  color: "#0B0F1A",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#FFE44D" },
                }}
              >
                Add Todo
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Todo Table */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 2,
            overflow: "hidden",
            mb: 4,
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(0,0,0,0.2)" }}>
                  <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                    Priority
                  </TableCell>
                  <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                    Due Date
                  </TableCell>
                  <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && todos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <CircularProgress sx={{ color: "#FFD600" }} />
                    </TableCell>
                  </TableRow>
                ) : todos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ color: "#A0A0A0", py: 4 }}
                    >
                      No todos found. Add one above!
                    </TableCell>
                  </TableRow>
                ) : (
                  todos.map((todo) => (
                    <TableRow
                      key={todo._id}
                      sx={{
                        "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                      }}
                    >
                      <TableCell sx={{ color: "#FFFFFF" }}>
                        {todo.title}
                      </TableCell>
                      <TableCell sx={{ color: "#A0A0A0" }}>
                        {todo.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={todo.priority}
                          size="small"
                          color={getPriorityColor(todo.priority)}
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "#A0A0A0" }}>
                        {todo.dueDate
                          ? new Date(todo.dueDate).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewTodo(todo._id)}
                          sx={{ color: "#FFD600", mr: 1 }}
                        >
                          <Eye />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteTodo(todo._id)}
                          sx={{ color: "#FF4444" }}
                        >
                          <Trash2 />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(todo)}
                          sx={{ color: "#00E676", mr: 1 }}
                        >
                          <Pencil size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Edit Todo Modal/Dialog */}
        {editingTodo && (
          <Paper
            elevation={0}
            sx={{
              bgcolor: "rgba(255,255,255,0.05)",
              border: "1px solid #FFD600",
              borderRadius: 2,
              p: 3,
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ color: "#FFD600", mb: 2 }}>
              Edit Todo
            </Typography>

            <Box component="form" onSubmit={handleUpdateTodo}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Title *"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#FFFFFF",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                      "&:hover fieldset": { borderColor: "#FFD600" },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#FFFFFF",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                    },
                  }}
                />

                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as any)}
                      label="Priority"
                      sx={{ color: "#FFFFFF" }}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    type="date"
                    label="Due Date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ bgcolor: "#FFD600", color: "#0B0F1A" }}
                  >
                    Update Todo
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditingTodo(null)}
                    sx={{ color: "#A0A0A0" }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        )}

        {/* View Single Todo Details */}
        {/* View Single Todo Details */}
        {selectedTodo && (
          <Box
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 1000,
              maxWidth: "400px",
              width: "calc(100% - 48px)",
              animation: "slideIn 0.3s ease-out",
              "@keyframes slideIn": {
                from: {
                  transform: "translateX(100%)",
                  opacity: 0,
                },
                to: {
                  transform: "translateX(0)",
                  opacity: 1,
                },
              },
            }}
          >
            <Paper
              elevation={8}
              sx={{
                bgcolor: "rgba(11, 15, 26, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 214, 0, 0.3)",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 214, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#FFD600",
                  boxShadow:
                    "0 12px 48px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 214, 0, 0.2)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              {/* Gradient Header Bar */}
              <Box
                sx={{
                  height: "4px",
                  background:
                    "linear-gradient(90deg, #FFD600 0%, #FF7A00 50%, #6A00F4 100%)",
                }}
              />

              <Card sx={{ bgcolor: "transparent" }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Header with Icon */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2.5}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "8px",
                          bgcolor: "rgba(255, 214, 0, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid rgba(255, 214, 0, 0.2)",
                        }}
                      >
                        <Eye size={18} style={{ color: "#FFD600" }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#FFD600",
                          fontWeight: 700,
                          fontFamily: '"Space Grotesk", sans-serif',
                          letterSpacing: "-0.02em",
                        }}
                      >
                        Todo Details
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      onClick={() => setSelectedTodo(null)}
                      sx={{
                        color: "#A0A0A0",
                        minWidth: "auto",
                        borderRadius: "8px",
                        "&:hover": {
                          color: "#FFD600",
                          bgcolor: "rgba(255, 214, 0, 0.1)",
                          transform: "scale(1.05)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </Box>

                  <Stack spacing={2.5}>
                    {/* Title Section */}
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#A0A0A0",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          fontWeight: 600,
                          fontSize: "0.65rem",
                        }}
                      >
                        Title
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 500,
                          mt: 0.5,
                          wordBreak: "break-word",
                        }}
                      >
                        {selectedTodo.title}
                      </Typography>
                    </Box>

                    {/* Description Section */}
                    {selectedTodo.description && (
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#A0A0A0",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            fontWeight: 600,
                            fontSize: "0.65rem",
                          }}
                        >
                          Description
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#A0A0A0",
                            mt: 0.5,
                            lineHeight: 1.6,
                            wordBreak: "break-word",
                          }}
                        >
                          {selectedTodo.description}
                        </Typography>
                      </Box>
                    )}

                    {/* Priority & Due Date Row */}
                    <Stack direction="row" spacing={2}>
                      <Box
                        sx={{
                          flex: 1,
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#A0A0A0",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            fontWeight: 600,
                            fontSize: "0.65rem",
                          }}
                        >
                          Priority
                        </Typography>
                        <Box sx={{mt: 0.5}}>
                          <Chip
                            label={selectedTodo.priority}
                            size="small"
                            color={getPriorityColor(selectedTodo.priority)}
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 600,
                              "& .MuiChip-label": { px: 1.5 },
                            }}
                          />
                        </Box>
                      </Box>

                      {selectedTodo.dueDate && (
                        <Box
                          sx={{
                            flex: 1,
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#A0A0A0",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              fontWeight: 600,
                              fontSize: "0.65rem",
                            }}
                          >
                            Due Date
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#FFFFFF",
                              fontWeight: 500,
                              mt: 0.5,
                            }}
                          >
                            {selectedTodo.dueDate
                              ? new Date(
                                  selectedTodo.dueDate,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "-"}
                          </Typography>
                        </Box>
                      )}
                    </Stack>

                    {/* Status Section */}
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#A0A0A0",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          fontWeight: 600,
                          fontSize: "0.65rem",
                        }}
                      >
                        Status
                      </Typography>
                      <Box sx={{mt: 0.5}}>
                        <Chip
                          label={
                            selectedTodo.completed ? "Completed ✓" : "Pending"
                          }
                          size="small"
                          color={selectedTodo.completed ? "success" : "warning"}
                          sx={{
                            fontWeight: 600,
                            "& .MuiChip-label": { px: 1.5 },
                          }}
                        />
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
};
