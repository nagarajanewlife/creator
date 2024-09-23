import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Grid,
  Box,
  TextField,
  Autocomplete,
  Drawer,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import "../App.css";
import bg from "./bg/dd.png";

// Initial tasks for dragging
const initialTasks = [
  {
    id: "email",
    type: "Email",
    content: <TextField type="email" label="Email" variant="outlined" />,
    properties: {
      label: "Email",
      placeholder: "Enter your email",
      name: "",
      id: "",
    },
  },
  {
    id: "address",
    type: "Address",
    content: <TextField label="Address" variant="outlined" />,
    properties: {
      label: "Address",
      placeholder: "Enter your address",
      name: "",
      id: "",
    },
  },
  {
    id: "phone",
    type: "Phone",
    content: <TextField type="tel" label="Phone" variant="outlined" />,
    properties: {
      label: "Phone",
      placeholder: "Enter your phone",
      name: "",
      id: "",
    },
  },
  {
    id: "singleLine",
    type: "Single Line",
    content: <TextField label="Single Line" variant="outlined" />,
    properties: {
      label: "Single Line",
      placeholder: "Enter text",
      name: "",
      id: "",
    },
  },
  {
    id: "multiLine",
    type: "Multi Line",
    content: (
      <TextField label="Multi Line" variant="outlined" multiline rows={4} />
    ),
    properties: {
      label: "Multi Line",
      placeholder: "Enter multiple lines",
      name: "",
      id: "",
    },
  },
  {
    id: "number",
    type: "Number",
    content: <TextField type="number" label="Number" variant="outlined" />,
    properties: {
      label: "Number",
      placeholder: "Enter a number",
      name: "",
      id: "",
    },
  },
  {
    id: "date",
    type: "Date",
    content: (
      <TextField
        type="date"
        label="Date"
        InputLabelProps={{ shrink: true }}
        variant="outlined"
      />
    ),
    properties: { label: "Date", placeholder: "", name: "", id: "" },
  },
  {
    id: "time",
    type: "Time",
    content: (
      <TextField
        type="time"
        label="Time"
        InputLabelProps={{ shrink: true }}
        variant="outlined"
      />
    ),
    properties: { label: "Time", placeholder: "", name: "", id: "" },
  },
  {
    id: "radio",
    type: "Radio",
    content: (
      <FormControl>
        <RadioGroup>
          <FormControlLabel
            value="option1"
            control={<Radio />}
            label="Option 1"
          />
          <FormControlLabel
            value="option2"
            control={<Radio />}
            label="Option 2"
          />
        </RadioGroup>
      </FormControl>
    ),
    properties: { label: "Radio", options: ["Option 1", "Option 2"] },
  },
  {
    id: "multiSelect",
    type: "Multi Select",
    content: (
      <Autocomplete
        multiple
        options={["Option 1", "Option 2", "Option 3"]}
        renderInput={(params) => (
          <TextField {...params} label="Select options" />
        )}
      />
    ),
    properties: {
      label: "Multi Select",
      options: ["Option 1", "Option 2", "Option 3"],
    },
  },
  {
    id: "checkbox",
    type: "Checkbox",
    content: <FormControlLabel control={<Checkbox />} label="Checkbox" />,
    properties: { label: "Checkbox" },
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

const DropArea = ({
  droppedInputs,
  onDrop,
  onTaskClick,
  onDeleteTask,
  onUpdateInput,
  isDone,
}) => {
  const [hoveredTask, setHoveredTask] = useState(null); // Track hovered task

  const handleMouseEnter = (taskId) => {
    setHoveredTask(taskId); // Set the task ID when mouse enters
  };

  const handleMouseLeave = () => {
    setHoveredTask(null); // Clear the hovered task when mouse leaves
  };

  const handleInputChange = (id, value) => {
    onUpdateInput(id, value); // Update input value via parent
  };

  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
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
          style={{ margin: "10px 0", width: "25%", position: "relative" }}
          onClick={() => !isDone && onTaskClick(task)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          {React.cloneElement(task.content, {
            value: task.value || "", // Display current value
            onChange: (e) => handleInputChange(task.id, e.target.value), // Capture user input
          })}

          {hoveredTask === index && (
            <IconButton
              onClick={() => onDeleteTask(task.id)}
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                color: "red",
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
        }}
      >
        <p style={{ color: "lightgray" }}>
          {isOver ? "Drop here to add input field" : "Drag a field here"}
        </p>
      </div>
    </div>
  );
};

function App() {
  const [tasks] = useState(initialTasks);
  const [droppedInputs, setDroppedInputs] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isDone, setIsDone] = useState(false);
  const [isAccessed, setIsAccessed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(true);
  const [btnchnge, setBtnChnage] = useState("");

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false); // Tracks if submit/reset buttons should be enabled
  const [inputValues, setInputValues] = useState(
    droppedInputs.reduce((acc, input) => ({ ...acc, [input.id]: "" }), {})
  ); // Track field values
  const handleInputChange = (id, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };
  const handleDrop = (task) => {
    setDroppedInputs((prev) => [...prev, task]);
    setIsDone(false);
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dashName = queryParams.get("dashName");
  const handleDoneClick = () => {
    console.log("Done button clicked");

    setIsSubmitEnabled(true);
    setIsDone(true); // Change the state to indicate the button has been clicked
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

  const handleSubmit = () => {
    const payload = droppedInputs.map((input) => ({
      id: input.id,
      label: input.properties.label,
      value: input.value, // Send the user-entered value
    }));
    console.log("payload", payload);
    axios
      .post("https://your-api-endpoint.com/submit", payload)
      .then((response) => {
        console.log("Data submitted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };
  const handleDeleteTask = (id) => {
    setDroppedInputs((prev) => prev.filter((task) => task.id !== id)); // Remove task by id
  };
  const handleReset = () => {
    setIsDone(false); // Reset the state
    setIsSubmitEnabled(false); // Disable the submit/reset buttons again
    setInputValues(
      droppedInputs.reduce((acc, input) => ({ ...acc, [input.id]: "" }), {})
    ); // Reset field values
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
      case "Email":
        return (
          <TextField
            type="email"
            label={properties.label}
            placeholder={properties.placeholder}
            variant="outlined"
            name={properties.name}
            id={properties.id}
          />
        );
      case "Address":
        return (
          <TextField
            label={properties.label}
            placeholder={properties.placeholder}
            variant="outlined"
            name={properties.name}
            id={properties.id}
          />
        );
      case "Phone":
        return (
          <TextField
            type="tel"
            label={properties.label}
            placeholder={properties.placeholder}
            variant="outlined"
            name={properties.name}
            id={properties.id}
          />
        );
      case "Single Line":
        return (
          <TextField
            label={properties.label}
            placeholder={properties.placeholder}
            variant="outlined"
            name={properties.name}
            id={properties.id}
          />
        );
      case "Multi Line":
        return (
          <TextField
            label={properties.label}
            placeholder={properties.placeholder}
            variant="outlined"
            multiline
            rows={4}
            name={properties.name}
            id={properties.id}
          />
        );
      case "Number":
        return (
          <TextField
            type="number"
            label={properties.label}
            placeholder={properties.placeholder}
            variant="outlined"
            name={properties.name}
            id={properties.id}
          />
        );
      case "Date":
        return (
          <TextField
            type="date"
            label={properties.label}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            name={properties.name}
            id={properties.id}
          />
        );
      case "Time":
        return (
          <TextField
            type="time"
            label={properties.label}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            name={properties.name}
            id={properties.id}
          />
        );
      case "Radio":
        return (
          <FormControl>
            <RadioGroup>
              {properties.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      case "Multi Select":
        return (
          <Autocomplete
            multiple
            options={properties.options}
            renderInput={(params) => (
              <TextField {...params} label="Select options" />
            )}
          />
        );
      case "Checkbox":
        return (
          <FormControlLabel control={<Checkbox />} label={properties.label} />
        );
      default:
        return null;
    }
  };

  const renderPropertyFields = () => {
    if (!selectedTask) return null;

    const { type, properties } = selectedTask;

    switch (type) {
      case "Email":
      case "Address":
      case "Phone":
      case "Single Line":
      case "Multi Line":
      case "Number":
        return (
          <>
            <TextField
              label="Label"
              name="label"
              value={properties.label}
              onChange={handlePropertyChange}
              fullWidth
            />
            <TextField
              label="Placeholder"
              name="placeholder"
              value={properties.placeholder}
              onChange={handlePropertyChange}
              fullWidth
              sx={{ marginTop: 2 }}
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
      case "Date":
      case "Time":
        return (
          <>
            <TextField
              label="Label"
              name="label"
              value={properties.label}
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
      case "Radio":
        return (
          <>
            <TextField
              label="Label"
              name="label"
              value={properties.label}
              onChange={handlePropertyChange}
              fullWidth
            />
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
              sx={{ marginTop: 2 }}
            />
          </>
        );
      case "Multi Select":
        return (
          <>
            <TextField
              label="Label"
              name="label"
              value={properties.label}
              onChange={handlePropertyChange}
              fullWidth
            />
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
              sx={{ marginTop: 2 }}
            />
          </>
        );
      case "Checkbox":
        return (
          <>
            <TextField
              label="Label"
              name="label"
              value={properties.label}
              onChange={handlePropertyChange}
              fullWidth
            />
          </>
        );
      default:
        return null;
    }
  };
  const handleUpdateInput = (id, value) => {
    // Update the droppedInputs array when input values change
    const updatedInputs = droppedInputs.map((input) =>
      input.id === id ? { ...input, value } : input
    );
    setDroppedInputs(updatedInputs); // Update state with new input values
  };
  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#293040", boxShadow: "none" }}
      >
        <Toolbar>
          {/* Left side: Show dashName */}
          <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>
            {dashName}
          </Typography>

          {/* Right side: Done button, Settings icon, and MoreVert icon */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit">
              <SettingsIcon sx={{ color: "white" }} />
            </IconButton>
            <IconButton color="inherit">
              <MoreVertIcon sx={{ color: "white" }} />
            </IconButton>

            <Button
              variant="contained"
              color="primary"
              onClick={handleDoneClick}
              sx={{ marginRight: 1 }}
              disabled={droppedInputs.length === 0} // Disable when droppedInputs is empty
            >
              {isDone ? (
                <>
                  <ElectricBoltOutlinedIcon /> Access the application
                </>
              ) : (
                "Done"
              )}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
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
                onDeleteTask={handleDeleteTask}
                onUpdateInput={handleUpdateInput} // Pass the function here
                isDone={isDone}
              />
              {/* "Submit" button */}
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                sx={{ marginRight: 1 }}
                disabled={!isSubmitEnabled} // Enable only when "Access the application" is clicked
              >
                Submit
              </Button>

              {/* "Reset" button */}
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
                disabled={!isSubmitEnabled} // Enable only when "Access the application" is clicked
              >
                Reset
              </Button>
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
    </>
  );
}

export default App;
