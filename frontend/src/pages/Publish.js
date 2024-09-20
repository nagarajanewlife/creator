import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Grid, Box } from "@mui/material";

// Component to read the URL and render the form
const Publish = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const data = queryParams.get("data");
  const droppedInputs = JSON.parse(decodeURIComponent(data));

  const handleEditClick = () => {
    navigate(`/edit?data=${encodeURIComponent(data)}`);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Publish
          </Typography>
          <Button variant="contained" color="primary" onClick={handleEditClick}>
            Edit
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ padding: "20px" }}>
            {droppedInputs.map((task, index) => (
              <div key={index}>{task.content}</div>
            ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Publish;
