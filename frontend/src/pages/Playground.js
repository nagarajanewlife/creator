import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import InputBase from "@mui/material/InputBase";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  InputAdornment,
  Divider,
  Paper,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  MoreVert as MoreVertIcon,
  DeleteOutlined as DeleteIcon,
  ElectricBoltOutlined as ElectricBoltOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  HelpOutline as HelpOutlineIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  TextFields as TextFieldsIcon,
  Numbers as NumbersIcon,
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  CheckBox as CheckBoxIcon,
  List as ListIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../App.css";

// Initial tasks for dragging
const initialTasks = [
  {
    id: "email",
    type: "Email",
    design: { icon: <EmailIcon />, label: "Email" },
    position: "basic",
    properties: {
      label: "Email",
      placeholder: "Enter your email",
      name: "Email_name",
      id: "Email_id",
      mandatory: true, // Mandatory flag
    },
  },
  {
    id: "address",
    type: "Address",
    design: { icon: <HomeIcon />, label: "Address" },
    position: "Special",
    properties: {
      label: "Address",
      placeholder: "Enter your address",
      name: "Address_name",
      id: "Address_id",
      mandatory: false, // Mandatory flag
    },
  },
  {
    id: "phone",
    type: "Phone",
    design: { icon: <PhoneIcon />, label: "Phone" },
    position: "Advanced",
    properties: {
      label: "Phone",
      placeholder: "Enter your phone",
      name: "Phone_name",
      id: "Phone_id",
      mandatory: false, // Mandatory flag
    },
  },
  {
    id: "singleLine",
    type: "Single Line",
    design: { icon: <TextFieldsIcon />, label: "Single Line" },
    position: "Advanced",
    properties: {
      label: "Single Line",
      placeholder: "Enter text",
      name: "Single_Line_name",
      id: "Single_Line_id",
      mandatory: false, // Mandatory flag
    },
  },
  {
    id: "multiLine",
    type: "Multi Line",
    design: { icon: <TextFieldsIcon />, label: "Multi Line" },
    position: "Advanced",
    properties: {
      label: "Multi Line",
      placeholder: "Enter multiple lines",
      name: "multiLine_name",
      id: "multiLine_id",
      mandatory: false, // Mandatory flag
    },
  },
  {
    id: "number",
    type: "Number",
    design: { icon: <NumbersIcon />, label: "Number" },
    position: "basic",
    properties: {
      label: "Number",
      placeholder: "Enter a number",
      name: "Number_name",
      id: "Number_id",
      mandatory: false, // Mandatory flag
    },
  },
  {
    id: "date",
    type: "Date",
    design: { icon: <DateRangeIcon />, label: "Date" },
    position: "basic",
    properties: {
      label: "Date",
      placeholder: "",
      name: "date_name",
      id: "date_id",
      mandatory: false, // Mandatory flag
    },
  },
  {
    id: "time",
    type: "Time",
    design: { icon: <AccessTimeIcon />, label: "Time" },
    position: "basic",
    properties: {
      label: "Time",
      placeholder: "",
      name: "time_name",
      id: "time_id",
      mandatory: false, // Mandatory flag
    },
  },
  {
    id: "radio",
    type: "Radio",
    design: { icon: <RadioButtonCheckedIcon />, label: "Radio" },
    position: "basic",
    properties: {
      label: "Radio",
      options: ["Option 1", "Option 2"],
      name: "radio_name",
      id: "radio_id",
      mandatory: false, // Mandatory flag
    },
  },
  {
    id: "multiSelect",
    type: "Multi Select",
    design: { icon: <ListIcon />, label: "Multi Select" },
    position: "basic",
    properties: {
      label: "Multi Select",
      name: "multiselect_name",
      id: "multiselect_id",
      options: ["Option 1", "Option 2", "Option 3"],
      mandatory: false, // Mandatory flag
    },
  },
  {
    id: "checkbox",
    type: "Checkbox",
    design: { icon: <CheckBoxIcon />, label: "Checkbox" },
    position: "basic",
    properties: {
      label: "Checkbox",
      name: "checkbox_name",
      id: "checkbox_id",
      mandatory: false, // Mandatory flag
    },
  },
];

// Define the item type for React DnD
const ItemType = {
  TASK: "TASK",
};

// DraggableTask Component
const DraggableTask = ({ task, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <Grid item xs={6} sm={3}>
      <Box
        ref={drag}
        className="draggable"
        sx={{
          opacity: isDragging ? 0.5 : 1,
          margin: "5px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontSize: "11px",
          lineHeight: "21px",
          boxSizing: "border-box",
          border: "none",
          width: "135px",
          minHeight: "105px",
          backgroundColor: "#fcfcfd",
          marginBottom: "10px",
          color: "#2f3439",
          position: "relative",
          transition: "background-color 0.3s",
          "&:hover": {
            color: "#115293",
            border: "1px dashed blue", // Change border on hover
          },
        }}
        onClick={() => onClick(task)} // Call onClick when clicked
      >
        {/* Render the icon and label */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Render the icon */}
          <div style={{ marginBottom: "4px" }}>{task.design.icon}</div>
          {/* Render the label */}
          <div>{task.design.label}</div>
        </div>
      </Box>
    </Grid>
  );
};

// DropArea Component
const DropArea = ({
  droppedInputs,
  onDrop,
  onTaskClick,
  onDeleteTask,
  onUpdateInput,
  isDone,
}) => {
  const [hoveredTask, setHoveredTask] = useState(null); // Track hovered task
  const [activeTaskId, setActiveTaskId] = useState(null); // Track active task

  const handleTaskClick = (task) => {
    setActiveTaskId(task.id); // Set the clicked task as active
  };
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
        minHeight: "300px", // Ensure there's enough space
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

      {droppedInputs.map((task, index) => (
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
              activeTaskId === task.uniqueId ? "#e0f7fa" : "white", // Highlight if active
          }}
          onClick={() => {
            // Set the active task and call onTaskClick only if not done
            if (!isDone) {
              onTaskClick(task);
            }
            setActiveTaskId(task.uniqueId); // Set active task
          }}
          onMouseEnter={() => handleMouseEnter(task.uniqueId)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Left side IconButton (Menu Icon) */}
          <IconButton sx={{ p: "4px" }} aria-label="menu" size="small">
            {task.design.icon}
          </IconButton>
          {/* InputBase as task input */}
          {!isDone ? (
            <InputBase
              sx={{ ml: 1, flex: 1, cursor: "pointer" }}
              placeholder={task.properties.label}
              inputProps={{ "aria-label": task.properties.label }}
              value={task.value || ""}
              onChange={(e) => {
                if (isDone) {
                  handleInputChange(task.uniqueId, e.target.value);
                } else {
                  onTaskClick(task);
                }
              }}
            />
          ) : (
            <InputBase
              sx={{ ml: 1, flex: 1, cursor: "pointer" }}
              placeholder={task.properties.label}
              inputProps={{ "aria-label": task.properties.label }}
              value={task.value || ""}
              onChange={(e) => {
                if (!isDone) {
                  onTaskClick(task);
                }
                handleInputChange(task.uniqueId, e.target.value);
              }}
              disabled={!isDone} // Disable if not allowed
            />
          )}
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
                  disabled={task.disabled || false} // Disable if task is disabled
                >
                  <DeleteIcon />
                </IconButton>
              </InputAdornment>
            </>
          )}
        </Paper>
      ))}

      {/* Show additional properties when task is active */}
    </div>
  );
};

// Main App Component
function App() {
  const [tasks] = useState(initialTasks);
  const [droppedInputs, setDroppedInputs] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const [isDone, setIsDone] = useState(false);
  const [isAccessed, setIsAccessed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(true);
  const [btnchnge, setBtnChnage] = useState("");

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false); // Tracks if submit/reset buttons should be enabled
  const [inputValues, setInputValues] = useState({}); // Track field values

  // Function to handle input changes
  const handleInputChange = (id, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  // Function to handle dropping a task
  const handleDrop = (task) => {
    // Count existing instances of the task type
    const existingCount = droppedInputs.filter(
      (input) => input.type === task.type
    ).length;

    // Create unique id and name
    const uniqueId = `${task.id}_${existingCount}`;
    const uniqueName = `${task.properties.name}_${existingCount}`;

    // Create a new task with unique id and name
    const newTask = {
      ...task,
      uniqueId, // Assign unique id
      properties: {
        ...task.properties,
        id: uniqueId, // Update id
        name: uniqueName, // Update name
      },
      value: "", // Initialize value
    };

    setDroppedInputs((prev) => [...prev, newTask]);
    setIsDone(false);
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dashName = queryParams.get("dashName") || "Dashboard";

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
      id: input.uniqueId,
      label: input.properties.label,
      value: inputValues[input.uniqueId] || "", // Send the user-entered value
    }));
    console.log("payload", payload);
    axios
      .post("https://your-api-endpoint.com/submit", payload)
      .then((response) => {
        console.log("Data submitted successfully:", response.data);
        // Optionally reset the form after successful submission
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  const handleDeleteTask = (uniqueId) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      setDroppedInputs((prev) =>
        prev.filter((task) => task.uniqueId !== uniqueId)
      );
      setInputValues((prev) => {
        const newValues = { ...prev };
        delete newValues[uniqueId];
        return newValues;
      });
    }
  };

  const handleReset = () => {
    setIsDone(false); // Reset the state
    setIsSubmitEnabled(false); // Disable the submit/reset buttons again
    setInputValues({}); // Reset field values
    setDroppedInputs([]); // Optionally clear all dropped inputs
  };

  const handleSave = () => {
    setDroppedInputs((prevInputs) =>
      prevInputs.map((task) =>
        task.uniqueId === selectedTask.uniqueId
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
            value={inputValues[task.uniqueId] || ""}
            onChange={(e) => handleInputChange(task.uniqueId, e.target.value)}
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
            value={inputValues[task.uniqueId] || ""}
            onChange={(e) => handleInputChange(task.uniqueId, e.target.value)}
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
            value={inputValues[task.uniqueId] || ""}
            onChange={(e) => handleInputChange(task.uniqueId, e.target.value)}
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
            value={inputValues[task.uniqueId] || ""}
            onChange={(e) => handleInputChange(task.uniqueId, e.target.value)}
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
            value={inputValues[task.uniqueId] || ""}
            onChange={(e) => handleInputChange(task.uniqueId, e.target.value)}
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
            value={inputValues[task.uniqueId] || ""}
            onChange={(e) => handleInputChange(task.uniqueId, e.target.value)}
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
            value={inputValues[task.uniqueId] || ""}
            onChange={(e) => handleInputChange(task.uniqueId, e.target.value)}
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
            value={inputValues[task.uniqueId] || ""}
            onChange={(e) => handleInputChange(task.uniqueId, e.target.value)}
          />
        );
      case "Radio":
        return (
          <FormControl>
            <RadioGroup
              name={properties.name}
              value={inputValues[task.uniqueId] || ""}
              onChange={(e) => handleInputChange(task.uniqueId, e.target.value)}
            >
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
            value={inputValues[task.uniqueId] || []}
            onChange={(event, newValue) =>
              handleInputChange(task.uniqueId, newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={properties.label}
                placeholder={properties.placeholder}
              />
            )}
          />
        );
      case "Checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={inputValues[task.uniqueId] || false}
                onChange={(e) =>
                  handleInputChange(task.uniqueId, e.target.checked)
                }
                name={properties.name}
                id={properties.id}
              />
            }
            label={properties.label}
          />
        );
      default:
        return null;
    }
  };

  const renderPropertyFields = () => {
    if (!selectedTask) return null;

    const { type, properties } = selectedTask;

    const handlePropertyChange = (e) => {
      const { name, value } = e.target;
      setSelectedTask((prevTask) => ({
        ...prevTask,
        properties: {
          ...prevTask.properties,
          [name]: value,
        },
      }));
    };

    const handleMandatoryChange = (e) => {
      setSelectedTask((prevTask) => ({
        ...prevTask,
        properties: {
          ...prevTask.properties,
          mandatory: e.target.checked,
        },
      }));
    };

    switch (type) {
      case "Email":
      case "Address":
      case "Phone":
      case "Single Line":
      case "Multi Line":
      case "Number":
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
            {type !== "Date" && type !== "Time" && (
              <TextField
                label="Placeholder"
                name="placeholder"
                value={properties.placeholder}
                onChange={handlePropertyChange}
                fullWidth
                sx={{ marginTop: 2 }}
              />
            )}
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={properties.mandatory}
                  onChange={handleMandatoryChange}
                />
              }
              label="Mandatory"
              sx={{ marginTop: 2 }}
            />
          </>
        );
      case "Radio":
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={properties.mandatory}
                  onChange={handleMandatoryChange}
                />
              }
              label="Mandatory"
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={properties.mandatory}
                  onChange={handleMandatoryChange}
                />
              }
              label="Mandatory"
              sx={{ marginTop: 2 }}
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
      input.uniqueId === id ? { ...input, value } : input
    );
    setDroppedInputs(updatedInputs); // Update state with new input values
    setInputValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {/* AppBar */}
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

      {/* DnD Provider */}
      <DndProvider backend={HTML5Backend}>
        <Grid container spacing={0}>
          {/* Sidebar for Draggable Tasks */}
          <Grid item xs={3} style={{ backgroundColor: "white" }}>
            <Accordion
              expanded={expanded}
              onChange={handleToggle}
              style={{
                backgroundColor: "#f4f6fa",
                boxShadow: "none",
                height: "800px",
                width: "330px",
                overflowY: "auto", // Enable vertical scrolling
                overflowX: "hidden", // Disable horizontal scrolling
                "&::-webkit-scrollbar": {
                  width: "4px", // Scrollbar width
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f0f0f0", // Track color
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888", // Scrollbar thumb color
                  borderRadius: "4px", // Make the scrollbar rounded
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555", // Scrollbar thumb hover color
                },
                // For Firefox:
                scrollbarColor: "#888 #f0f0f0", // thumb color, track color
                scrollbarWidth: "thin", // Set scrollbar width
              }}
            >
              <AccordionSummary
                expandIcon={expanded ? <RemoveIcon /> : <AddIcon />} // Toggle icons
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{
                  "& .MuiAccordionSummary-expandIconWrapper": {
                    color: "#333", // Custom color for the icon
                  },
                }}
              >
                <Typography>Basic Fields</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid
                  container
                  spacing={1}
                  style={{
                    width: "333px",
                    height: "105px",
                  }}
                >
                  <Grid container spacing={1}>
                    {tasks.map((task, index) => (
                      <Grid item xs={6} key={task.id}>
                        <DraggableTask task={task} onClick={handleTaskClick} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Main Drop Area */}
          <Grid item xs={6}>
            <Box sx={{ padding: "10px" }}>
              <DropArea
                droppedInputs={droppedInputs}
                onDrop={handleDrop}
                onTaskClick={handleTaskClick}
                onDeleteTask={handleDeleteTask}
                onUpdateInput={handleUpdateInput} // Pass the function here
                isDone={isDone}
              />
              {/* "Submit" and "Reset" buttons */}
              {droppedInputs.length === 0 ? null : (
                <div style={{ marginTop: "20px" }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                    sx={{ marginRight: 1 }}
                    disabled={!isSubmitEnabled} // Enable only when "Done" is clicked
                  >
                    Submit
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleReset}
                    disabled={!isSubmitEnabled} // Enable only when "Done" is clicked
                  >
                    Reset
                  </Button>
                </div>
              )}
            </Box>
          </Grid>

          {/* Sidebar for Field Properties */}
          {droppedInputs.length === 0 ? null : (
            <Grid item xs={3}>
              <AppBar
                position="relative"
                style={{
                  backgroundColor: "#fcfcfd",
                  color: "#333333",
                  boxShadow: "none",
                  borderLeft: "2px solid #f0f2f6", // Add left border
                  borderBottom: "2px solid #f0f2f6", // Add bottom border
                }}
              >
                <Toolbar>
                  <Typography variant="h6">Field Properties</Typography>
                </Toolbar>
              </AppBar>
              <Box
                sx={{
                  padding: 2,
                  width: 300,
                  backgroundColor: "#fcfcfd",
                  color: "#333333",
                  borderLeft: "2px solid #f0f2f6",
                  height: "800px",
                  overflowY: "auto",
                }}
              >
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
            </Grid>
          )}
        </Grid>
      </DndProvider>
    </>
  );
}

export default App;
