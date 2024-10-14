// DropArea.jsx
import React, { useState } from "react";
import {
  Paper,
  IconButton,
  InputBase,
  Divider,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const DropArea = ({
  droppedInputs,
  onDrop,
  onTaskClick,
  onDeleteTask,
  onUpdateInput,
  appName,
  formName,
  isDone,
}) => {
  const [hoveredTask, setHoveredTask] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const handleTaskClick = (task) => {
    setActiveTaskId(task.uniqueId);
  };

  const handleMouseEnter = (taskId) => {
    setHoveredTask(taskId);
  };

  const handleMouseLeave = () => {
    setHoveredTask(null);
  };

  const handleInputChange = (id, value) => {
    onUpdateInput(id, value);
  };

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        margin: "10px 0",
        boxSizing: "border-box",
        minHeight: "300px",
        border: "2px dashed #ccc",
        borderRadius: "8px",
      }}
    >
      {droppedInputs.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
          }}
        >
          <Typography variant="body1" color="textSecondary">
            Drag a field here
          </Typography>
        </div>
      )}

      {droppedInputs.map((task) => (
        <Paper
          key={task.uniqueId}
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: isDone ? 300 : 660,
            border: !isDone ? "1px dashed #3987d9" : null,
            marginTop: "12px",
            cursor: "pointer",
            backgroundColor:
              activeTaskId === task.uniqueId ? "#e0f7fa" : "white",
          }}
          onClick={() => {
            if (!isDone) {
              onTaskClick(task);
            }
            setActiveTaskId(task.uniqueId);
          }}
          onMouseEnter={() => handleMouseEnter(task.uniqueId)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Icon based on field type */}
          <IconButton sx={{ p: "4px" }} aria-label="menu" size="small">
            {/* You can replace this with actual icons based on field type */}
            {task.design.icon || (
              <Typography>{task.type.charAt(0).toUpperCase()}</Typography>
            )}
          </IconButton>

          {/* Render different input types based on field type */}
          {task.type === "text" && (
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder={task.properties.label}
              inputProps={{ "aria-label": task.properties.label }}
              value={task.value || ""}
              onChange={(e) => handleInputChange(task.uniqueId, e.target.value)}
              disabled={isDone}
            />
          )}
          {task.type === "email" && (
            <InputBase
              type="email"
              sx={{ ml: 1, flex: 1 }}
              placeholder={task.properties.label}
              inputProps={{ "aria-label": task.properties.label }}
              value={task.value || ""}
              onChange={(e) => handleInputChange(task.uniqueId, e.target.value)}
              disabled={isDone}
            />
          )}
          {task.type === "address" && (
            <InputBase
              multiline
              rows={3}
              sx={{ ml: 1, flex: 1 }}
              placeholder={task.properties.label}
              inputProps={{ "aria-label": task.properties.label }}
              value={task.value || ""}
              onChange={(e) => handleInputChange(task.uniqueId, e.target.value)}
              disabled={isDone}
            />
          )}
          {/* Add more field types as needed */}

          {isDone ? null : (
            <>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <InputAdornment position="end">
                <IconButton
                  onClick={() => onDeleteTask(task.uniqueId)}
                  sx={{
                    color: "default",
                    "&:hover": {
                      color: "red",
                    },
                  }}
                  disabled={task.disabled || false}
                >
                  <DeleteIcon />
                </IconButton>
              </InputAdornment>
            </>
          )}
        </Paper>
      ))}
    </div>
  );
};

export default DropArea;
