import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Grid,
  Box,
  TextField,
  Button,
  Autocomplete,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import "../App.css";
import bg from "./bg/dd.png";

const initialTasks = [
  {
    id: "task1",
    type: "TextField",
    content: <TextField placeholder="Input" variant="outlined" />,
    properties: { placeholder: "Input", name: "", id: "" },
  },

  {
    id: "task2",
    type: "Button",
    content: <Button variant="contained">Button</Button>,
    properties: { name: "Button", color: "primary", size: "medium" },
  },
  {
    id: "task3",
    type: "Autocomplete",
    content: (
      <Autocomplete
        options={["Option 1", "Option 2", "Option 3"]}
        renderInput={(params) => (
          <TextField {...params} label="Select an option" />
        )}
      />
    ),
    properties: { options: ["Option 1", "Option 2", "Option 3"] },
  },
];

const ItemType = {
  TASK: "TASK",
};

const DraggableTask = ({ task, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="draggable"
      style={{ opacity: isDragging ? 0.5 : 1, margin: "5px 0" }}
      onClick={() => onClick(task)} // Call onClick when clicked
    >
      {task.content}
    </div>
  );
};

const DropArea = ({ droppedInputs, onDrop, onTaskClick }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TASK,
    drop: (item) => onDrop(item.task),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        background: isOver ? "lightgreen" : "white",
        padding: "20px",
        margin: "10px 0",
        boxSizing: "border-box",
      }}
    >
      {droppedInputs.map((task, index) => (
        <div
          key={index}
          style={{ margin: "10px 0", width: "100%" }}
          onClick={() => onTaskClick(task)}
        >
          {task.content}
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {isOver ? "Drop here to add input field" : "Drag a field here "}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img src={bg} alt="bg" width="80px" height="80px" />
      </div>
    </div>
  );
};

function App() {
  const [tasks] = useState(initialTasks);
  const [droppedInputs, setDroppedInputs] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleDrop = (task) => {
    setDroppedInputs((prev) => [...prev, task]);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handlePropertyChange = (event) => {
    const { name, value } = event.target;
    setSelectedTask((prevTask) => ({
      ...prevTask,
      properties: {
        ...prevTask.properties,
        [name]: value,
      },
    }));
  };

  const handleSave = () => {
    setDroppedInputs((prevInputs) =>
      prevInputs.map((task) =>
        task.id === selectedTask.id
          ? {
              ...selectedTask,
              content: renderUpdatedContent(selectedTask),
            }
          : task
      )
    );
    setDrawerOpen(false);
  };

  const renderUpdatedContent = (task) => {
    const { type, properties } = task;

    switch (type) {
      case "TextField":
        return (
          <TextField
            placeholder={properties.placeholder}
            variant="outlined"
            name={properties.name}
            id={properties.id}
          />
        );
      case "Button":
        return (
          <Button
            variant="contained"
            color={properties.color}
            size={properties.size}
          >
            {properties.name}
          </Button>
        );
      case "Autocomplete":
        return (
          <Autocomplete
            options={properties.options}
            renderInput={(params) => (
              <TextField {...params} label="Select an option" />
            )}
          />
        );
      default:
        return null;
    }
  };

  const renderPropertyFields = () => {
    if (!selectedTask) return null;

    const { type, properties } = selectedTask;

    switch (type) {
      case "TextField":
        return (
          <>
            <TextField
              label="Placeholder"
              name="placeholder"
              value={properties.placeholder}
              onChange={handlePropertyChange}
              fullWidth
            />
            <TextField
              label="Name"
              name="name"
              value={properties.name}
              onChange={handlePropertyChange}
              fullWidth
              sx={{ marginTop: 2 }}
            />
            <TextField
              label="ID"
              name="id"
              value={properties.id}
              onChange={handlePropertyChange}
              fullWidth
              sx={{ marginTop: 2 }}
            />
          </>
        );
      case "Button":
        return (
          <>
            <TextField
              label="Button Name"
              name="name"
              value={properties.name}
              onChange={handlePropertyChange}
              fullWidth
            />
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>Color</InputLabel>
              <Select
                name="color"
                value={properties.color}
                onChange={handlePropertyChange}
              >
                <MenuItem value="primary">Primary</MenuItem>
                <MenuItem value="secondary">Secondary</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>Size</InputLabel>
              <Select
                name="size"
                value={properties.size}
                onChange={handlePropertyChange}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case "Autocomplete":
        return (
          <>
            <TextField
              label="Options (comma separated)"
              name="options"
              value={properties.options.join(", ")}
              onChange={(e) =>
                handlePropertyChange({
                  target: {
                    name: "options",
                    value: e.target.value.split(",").map((opt) => opt.trim()),
                  },
                })
              }
              fullWidth
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <div className="task-list">
            {tasks.map((task) => (
              <DraggableTask
                key={task.id}
                task={task}
                onClick={handleTaskClick}
              />
            ))}
          </div>
        </Grid>
        <Grid item xs={9}>
          <Box sx={{ padding: "10px" }}>
            <DropArea
              droppedInputs={droppedInputs}
              onDrop={handleDrop}
              onTaskClick={handleTaskClick}
            />
          </Box>
        </Grid>
      </Grid>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6">Edit Task</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ padding: 2, width: 300 }}>
          {renderPropertyFields()}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ marginTop: 2 }}
          >
            Save
          </Button>
        </Box>
      </Drawer>
    </DndProvider>
  );
}

export default App;
