import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ApplicationCrate({ openAppName, handleCloseApp }) {
  const [dashName, setDashName] = useState("");

  const handleCreateDashboard = () => {
    // Call the dashboard creation logic here
    console.log("Dashboard Name:", dashName);
    handleCloseApp(); // Close dialog after creation
  };

  return (
    <Dialog
      open={openAppName}
      onClose={handleCloseApp}
      fullScreen
      sx={{
        "& .MuiDialog-paper": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f7f8fc",
        },
      }}
    >
      <DialogTitle sx={{ position: "absolute", top: 0, right: 0 }}>
        <IconButton
          aria-label="close"
          onClick={handleCloseApp}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Container for both rows */}
      <Box
        sx={{
          width: 602,
          height: 451,
          backgroundColor: "#fafafc",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Row 1 */}
        <Box
          sx={{
            width: 600,
            height: 163,
            backgroundColor: "white",
            padding: 2,
          }}
        >
          <RadioGroup
            row
            sx={{ justifyContent: "center" }}
            aria-label="options"
            name="row-radio-buttons-group"
          >
            {[...Array(13)].map((_, index) => (
              <FormControlLabel
                key={index}
                value={`option-${index + 1}`}
                control={<Radio />}
                label={`Option ${index + 1}`}
              />
            ))}
          </RadioGroup>
        </Box>

        <Divider sx={{ width: 600 }} />

        {/* Row 2 */}
        <Box
          sx={{
            width: 600,
            height: 286,
            backgroundColor: "#fafafc",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* TextField for Application Name */}
          <TextField
            label="Application Name"
            variant="outlined"
            value={dashName}
            onChange={(e) => setDashName(e.target.value)}
            sx={{ width: 500, height: 37 }}
          />

          {/* Button to create dashboard */}
          <Button
            variant="contained"
            onClick={handleCreateDashboard}
            sx={{
              width: 500,
              height: 48,
              backgroundColor: "#3f51b5",
              color: "white",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
            }}
          >
            Create Dashboard
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
