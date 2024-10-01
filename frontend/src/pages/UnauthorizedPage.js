// frontend/src/pages/UnauthorizedPage.js

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        p: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        403 - Unauthorized
      </Typography>
      <Typography variant="body1" gutterBottom>
        You do not have permission to access this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/login")}
      >
        Go to Login
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;
