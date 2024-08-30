import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Grid,
  Box,
  TextField,
  Button,
  ButtonGroup,
  Checkbox,
  Rating,
  Autocomplete,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import "../App.css";

const initialTasks = [
  {
    id: "task1",
    content: <TextField placeholder="Input for Task 1" variant="outlined" />,
  },
  {
    id: "task2",
    content: (
      <Button variant="contained" startIcon={<AddIcon />}>
        Button 1
      </Button>
    ),
  },
  {
    id: "task3",
    content: (
      <Autocomplete
        options={["Option 1", "Option 2", "Option 3"]}
        renderInput={(params) => (
          <TextField {...params} label="Select an option" />
        )}
      />
    ),
  },
];

const ItemType = {
  TASK: "TASK",
};

const DraggableTask = ({ task, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { content: task.content },
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

const DropArea = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TASK,
    drop: (item) => onDrop(item.content),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        background: isOver ? "lightgreen" : "lightgray",
        padding: "20px",
        margin: "10px 0",
        minHeight: "100px",
        border: "1px dashed #000",
        width: "70%",
        boxSizing: "border-box",
      }}
    >
      {isOver ? "Drop here to add input field" : "Drag and drop a task here"}
    </div>
  );
};

function App() {
  const [tasks] = useState(initialTasks);
  const [droppedInputs, setDroppedInputs] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [placeholder, setPlaceholder] = useState("");

  const handleDrop = (content) => {
    setDroppedInputs((prev) => [...prev, content]);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    if (task.id === "task1") {
      setPlaceholder("Input for Task 1");
    } else {
      setPlaceholder(""); // Reset for other tasks
    }
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handlePlaceholderChange = (event) => {
    setPlaceholder(event.target.value);
  };

  const handleSave = () => {
    // Here you can implement the logic to save the changes
    console.log(`New Placeholder: ${placeholder}`);
    handleDrawerClose();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid container spacing={2}>
        {/* First Column - 25% */}
        <Grid item xs={3}>
          <div className="task-list">
            {tasks.map((task) => (
              <DraggableTask key={task.id} task={task} />
            ))}
          </div>
        </Grid>

        {/* Second Column - 75% */}
        <Grid item xs={9}>
          <Box sx={{ padding: "10px" }}>
            <DropArea onDrop={handleDrop} />
            {droppedInputs.map((input, index) => (
              <div
                style={{ background: "lightgreen" }}
                key={index}
                style={{ margin: "10px 0", width: "100%", height: "100%" }}
                onClick={handleTaskClick}
              >
                {input}
              </div>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Drawer for modifying task properties */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6">Edit Task</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ padding: 2, width: 250 }}>
          {selectedTask && (
            <div>
              <TextField
                label="Placeholder"
                value={placeholder}
                onChange={handlePlaceholderChange}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ marginTop: 2 }}
              >
                Save
              </Button>
            </div>
          )}
        </Box>
      </Drawer>
    </DndProvider>
  );
}

export default App;
