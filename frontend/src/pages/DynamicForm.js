// src/DynamicForm.js
import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { auth } from "../components/firebase";
import axios from "axios";
import Grid from "@mui/material/Grid";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import DescriptionIcon from "@mui/icons-material/Description"; // Example icon for formName
import ReportIcon from "@mui/icons-material/Report"; // Example icon for report
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

const DynamicForm = ({ formData, appname, formname, formLists }) => {
  const [formState, setFormState] = useState(() => {
    const initialState = {};
    if (Array.isArray(formData)) {
      formData.forEach((field) => {
        if (field.properties && field.properties.name) {
          const fieldName = field.properties.name;
          const fieldType = typeof field.type === "string" ? field.type : "";
          initialState[fieldName] =
            field.value ||
            (fieldType === "Checkbox"
              ? false
              : fieldType === "Multi Select"
              ? []
              : "");
        } else {
          console.warn(
            "Field is missing 'properties' or 'properties.name':",
            field
          );
        }
      });
    } else {
      console.error("formData is not an array:", formData);
    }
    return initialState;
  });
  const [activeButton, setActiveButton] = useState(null);

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode

  // Handle change for input fields
  const handleChange = (e, field) => {
    const { name, value, type, checked } = e.target;
    let fieldValue = value;

    if (type === "checkbox") {
      fieldValue = checked;
    }

    setFormState((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Generate form fields based on data type
  const renderFormFields = () => {
    if (!Array.isArray(formData)) {
      return (
        <Typography color="error">
          Invalid form data. Expected an array of fields.
        </Typography>
      );
    }

    return formData.map((field) => {
      const { type, properties, uniqueId } = field;

      if (!properties || !properties.name) {
        // Skip fields without necessary properties
        return (
          <Typography key={uniqueId} color="error">
            Invalid field configuration: Missing 'properties.name'.
          </Typography>
        );
      }

      const { label, placeholder, name, options, mandatory } = properties;
      const value = formState[name];

      const commonProps = {
        id: properties.id,
        name: name,
        value: value,
        onChange: (e) => handleChange(e, field),
        placeholder: placeholder,
        required: mandatory,
        fullWidth: true,
        variant: "outlined",
        margin: "normal",
        disabled: !isEditing, // Disable inputs when not editing
      };

      switch (type) {
        case "Email":
        case "Address":
        case "Phone":
        case "Single Line":
        case "Number":
        case "Date":
        case "Time":
          return (
            <FormControl key={uniqueId} fullWidth margin="normal">
              <TextField
                type={
                  type === "Email"
                    ? "email"
                    : type === "Phone"
                    ? "tel"
                    : type === "Number"
                    ? "number"
                    : type === "Date"
                    ? "date"
                    : type === "Time"
                    ? "time"
                    : "text"
                }
                label={
                  mandatory ? (
                    <span>
                      {label} <span style={{ color: "red" }}>*</span>
                    </span>
                  ) : (
                    label
                  )
                }
                {...commonProps}
                InputLabelProps={
                  type === "Date" || type === "Time"
                    ? { shrink: true }
                    : undefined
                }
                error={Boolean(errors[name])}
                helperText={errors[name]}
              />
            </FormControl>
          );
        case "Multi Line":
          return (
            <FormControl key={uniqueId} fullWidth margin="normal">
              <TextField
                label={
                  mandatory ? (
                    <span>
                      {label} <span style={{ color: "red" }}>*</span>
                    </span>
                  ) : (
                    label
                  )
                }
                {...commonProps}
                multiline
                rows={4}
                error={Boolean(errors[name])}
                helperText={errors[name]}
              />
            </FormControl>
          );
        case "Radio":
          return (
            <FormControl
              component="fieldset"
              key={uniqueId}
              margin="normal"
              error={Boolean(errors[name])}
            >
              <FormLabel component="legend">
                {label}
                {mandatory && <span style={{ color: "red" }}> *</span>}
              </FormLabel>
              <RadioGroup
                aria-label={name}
                name={name}
                value={value}
                onChange={(e) => handleChange(e, field)}
              >
                {options.map((option, index) => (
                  <FormControlLabel
                    key={`${uniqueId}_option_${index}`}
                    value={option}
                    control={<Radio />}
                    label={option}
                    disabled={!isEditing} // Disable radios when not editing
                  />
                ))}
              </RadioGroup>
              {errors[name] && (
                <Typography variant="caption" color="error">
                  {errors[name]}
                </Typography>
              )}
            </FormControl>
          );
        case "Multi Select":
          return (
            <FormControl
              key={uniqueId}
              fullWidth
              margin="normal"
              error={Boolean(errors[name])}
            >
              <InputLabel id={`${uniqueId}-label`}>
                {label}
                {mandatory && <span style={{ color: "red" }}> *</span>}
              </InputLabel>
              <Select
                labelId={`${uniqueId}-label`}
                id={properties.id}
                multiple
                value={formState[name] || []}
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setFormState((prev) => ({
                    ...prev,
                    [name]: selectedOptions,
                  }));
                  // Clear error if any
                  if (errors[name]) {
                    setErrors((prev) => ({
                      ...prev,
                      [name]: "",
                    }));
                  }
                }}
                label={label}
                renderValue={(selected) => selected.join(", ")}
                disabled={!isEditing} // Disable select when not editing
              >
                {options.map((option, index) => (
                  <MenuItem key={`${uniqueId}_option_${index}`} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {errors[name] && (
                <Typography variant="caption" color="error">
                  {errors[name]}
                </Typography>
              )}
            </FormControl>
          );
        case "Checkbox":
          return (
            <FormControlLabel
              key={uniqueId}
              control={
                <Checkbox
                  checked={formState[name]}
                  onChange={(e) => handleChange(e, field)}
                  name={name}
                  color="primary"
                  required={mandatory}
                  disabled={!isEditing} // Disable checkbox when not editing
                />
              }
              label={
                <span>
                  {label}
                  {mandatory && <span style={{ color: "red" }}> *</span>}
                </span>
              }
            />
          );
        default:
          return (
            <Typography key={uniqueId} color="error">
              Unsupported field type: {type}
            </Typography>
          );
      }
    });
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    if (!Array.isArray(formData)) {
      newErrors.form = "Invalid form data.";
      setErrors(newErrors);
      return false;
    }

    formData.forEach((field) => {
      const { properties, type } = field;
      if (!properties || !properties.name) {
        // Skip fields without necessary properties
        return;
      }
      const { name, mandatory, label } = properties;
      const value = formState[name];

      if (mandatory) {
        if (type === "Checkbox" && !value) {
          newErrors[name] = `${label} is required.`;
        } else if (
          (type !== "Checkbox" && !value) ||
          (Array.isArray(value) && value.length === 0)
        ) {
          newErrors[name] = `${label} is required.`;
        }
      }

      // Additional validation based on type
      if (value) {
        if (type === "Email") {
          const emailRegex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
          if (!emailRegex.test(value)) {
            newErrors[name] = "Please enter a valid email address.";
          }
        }

        if (type === "Phone") {
          const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Simple international phone validation
          if (!phoneRegex.test(value)) {
            newErrors[name] = "Please enter a valid phone number.";
          }
        }

        if (type === "Number") {
          if (isNaN(value)) {
            newErrors[name] = "Please enter a valid number.";
          }
        }

        // Add more type-specific validations as needed
      }
    });

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Validation failed
      return;
    }

    try {
      // Replace with your API endpoint
      const apiEndpoint = "https://your-api-endpoint.com/submit";

      // Prepare data for submission
      const submissionData = { ...formState };

      // If multi-select fields return arrays, handle them as needed by your API
      // For example, convert arrays to comma-separated strings or send as-is if API accepts arrays

      const response = await axios.post(apiEndpoint, submissionData);

      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");

      // Optionally, reset the form
      setFormState(() => {
        const initialState = {};
        formData.forEach((field) => {
          if (field.properties && field.properties.name) {
            initialState[field.properties.name] =
              field.type === "Checkbox"
                ? false
                : field.type === "Multi Select"
                ? []
                : "";
          }
        });
        return initialState;
      });
      setErrors({});
      setIsEditing(false); // Exit edit mode after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form.");
    }
  };

  // Handle Edit Button Click
  const handleEdit = () => {
    setIsEditing(true); // Enter edit mode
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setIsEditing(false); // Exit edit mode
    // Optionally, reset the form or revert changes
    // For simplicity, we'll just clear errors
    setErrors({});
  };
  const groupedForms = formLists?.reduce((acc, form) => {
    acc[form.dashid] = acc[form.dashid] || [];
    acc[form.dashid].push(form);
    return acc;
  }, {});
  const seenDashids = new Set();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={4}
            sx={{
              position: "relative",
              width: 600,
              margin: "50px auto",
              padding: 4,
              border: "1px solid #ccc",
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "white",
              overflow: "hidden",
              "&:hover .edit-overlay": {
                opacity: 1,
              },
              transition: "box-shadow 0.3s ease-in-out",
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            <div>
              {groupedForms &&
                Object.keys(groupedForms).map((dashid) => (
                  <Accordion
                    key={dashid}
                    style={{ backgroundColor: "#1c1c40", color: "white" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
                      aria-controls={`${dashid}-content`}
                      id={`${dashid}-header`}
                    >
                      <Typography style={{ textAlign: "left", width: "100%" }}>
                        {dashid}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {groupedForms[dashid].map((form) => (
                        <div key={form._id}>
                          <Button
                            startIcon={<DescriptionIcon />}
                            style={{
                              textTransform: "none",
                              color: "white",
                              backgroundColor:
                                activeButton === form._id
                                  ? "#5051f9"
                                  : "transparent",
                              justifyContent: "flex-start",
                              width: "100%",
                            }}
                            component={Link}
                            to={`/appbuilder/${auth.currentUser?.displayName}/${form.dashid}/form/${form.formName}/edit`}
                            onClick={() => setActiveButton(form._id)}
                          >
                            {form.formName}
                          </Button>
                          <br />
                          <Button
                            startIcon={<ReportIcon />}
                            style={{
                              textTransform: "none",
                              color: "white",
                              backgroundColor:
                                activeButton === `${form._id}-report`
                                  ? "#5051f9"
                                  : "transparent",
                              justifyContent: "flex-start",
                              width: "100%",
                            }}
                            component={Link}
                            to={`/appbuilder/${auth.currentUser?.displayName}/${form.dashid}/form/${form.formName}/edit`}
                            onClick={() =>
                              setActiveButton(`${form._id}-report`)
                            }
                          >
                            Report {form.formName}
                          </Button>
                          <br />
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
            </div>
            <Divider style={{ color: "gray" }} />
            <Typography style={{ marginTop: "100%" }}>
              {auth?.currentUser?.displayName}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Box
              sx={{
                position: "relative",
                Width: 600,
                margin: "50px auto",
                padding: 4,
                border: "1px solid #ccc",
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "white",
                overflow: "hidden",
                "&:hover .edit-overlay": {
                  opacity: 1,
                },
                transition: "box-shadow 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              {/* Overlay for Blur Effect and Edit Button */}

              {!isEditing && (
                <Box
                  className="edit-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    zIndex: 1,
                    cursor: "pointer",
                  }}
                  onClick={handleEdit}
                >
                  <Tooltip title="Edit Form">
                    <Button
                      color="primary"
                      size="large"
                      component={Link}
                      to={`/appbuilder/${auth.currentUser?.displayName}/${appname}/formbuilder/${formname}/edit`}
                      sx={{
                        backgroundColor: "white",
                        boxShadow: 1,
                        "&:hover": {
                          backgroundColor: "grey.100",
                        },
                      }}
                    >
                      Open Form Builder
                    </Button>
                  </Tooltip>
                </Box>
              )}

              {/* Form Title */}
              <Typography variant="h5" component="h2" align="left" gutterBottom>
                {formname}
              </Typography>

              {/* The Form */}
              <form onSubmit={handleSubmit}>
                {renderFormFields()}

                {/* Action Buttons */}
                {isEditing && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button variant="contained" color="primary" type="submit">
                      Submit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelEdit}
                      startIcon={<CloseIcon />}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}

                {/* Display General Form Errors */}
                {errors.form && (
                  <Typography color="error" align="center" sx={{ mt: 2 }}>
                    {errors.form}
                  </Typography>
                )}
              </form>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

// Define PropTypes for better type checking
DynamicForm.propTypes = {
  formData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      design: PropTypes.object,
      position: PropTypes.string,
      properties: PropTypes.shape({
        label: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        mandatory: PropTypes.bool,
        options: PropTypes.arrayOf(PropTypes.string),
      }),
      uniqueId: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  ).isRequired,
};

export default DynamicForm;
