import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Grid,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppsIcon from "@mui/icons-material/Apps";
import BarChartIcon from "@mui/icons-material/BarChart";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import { useSpring, animated } from "@react-spring/web";

// Custom Hook for handling the hover animation of each card
const useCardHoverAnimation = (hoveredCard, cardName) => {
  const cardSpring = useSpring({
    transform: hoveredCard === cardName ? "scale(1.05)" : "scale(1)", // Scale on hover
    border:
      hoveredCard === cardName ? "2px solid #295bf9" : "2px solid transparent", // Border color on hover
    config: { tension: 200, friction: 10 },
  });

  const iconSpring = useSpring({
    transform: hoveredCard === cardName ? "scale(0.85)" : "scale(1)", // Icon size on hover
    config: { tension: 250, friction: 15 },
  });

  return { cardSpring, iconSpring };
};

export default function FullScreenDialog() {
  const [open, setOpen] = React.useState(true);
  const [hoveredCard, setHoveredCard] = useState(null); // Track the hovered card

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (label) => {
    console.log(`${label} selected`);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "84px" }}>
          What kind of solution are you looking for?
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Applications Card */}
          <Grid item xs={12} sm={4}>
            <CardWithHover
              cardName="Applications"
              paragraph="Create mobile and web apps to handle simple tasks and complex automations"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              icon={<AppsIcon sx={{ color: "white", fontSize: "32px" }} />}
              onSelect={() => handleSelect("Applications")}
            />
          </Grid>

          {/* BI & Analytics Card */}
          <Grid item xs={12} sm={4}>
            <CardWithHover
              cardName="BI & Analytics"
              paragraph=" Unify data from multiple sources to create interactive and insightful reports"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              icon={<BarChartIcon sx={{ color: "white", fontSize: "32px" }} />}
              onSelect={() => handleSelect("BI & Analytics")}
            />
          </Grid>

          {/* Integration Flow Card */}
          <Grid item xs={12} sm={4}>
            <CardWithHover
              cardName="Integration Flow"
              paragraph=" Create efficient workflow automation that connects to hundreds of popular cloud apps"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              icon={
                <IntegrationInstructionsIcon
                  sx={{ color: "white", fontSize: "32px" }}
                />
              }
              onSelect={() => handleSelect("Integration Flow")}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

// CardWithHover Component
const CardWithHover = ({
  cardName,
  paragraph,
  hoveredCard,
  setHoveredCard,
  icon,
  onSelect,
}) => {
  const { cardSpring, iconSpring } = useCardHoverAnimation(
    hoveredCard,
    cardName
  );

  return (
    <animated.div
      style={cardSpring}
      onMouseEnter={() => setHoveredCard(cardName)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <Box
        sx={{
          width: "380px",
          height: "274px",
          textAlign: "center",
          borderRadius: "16px",
          backgroundColor: "#fff",
          cursor: "pointer",
          padding: "16px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <animated.div
          style={{
            position: "absolute",
            top: "-32px",
            left: "45%",
            transform: "translateX(-50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#295bf9",
            borderRadius: "50%",
            padding: "16px",
            border: "2px solid #295bf9",
            width: "30px",
            height: "30px",
            transform: "rotate(45deg)",
          }}
        >
          <animated.div style={iconSpring}>
            {React.cloneElement(icon, {
              sx: { ...icon.props.sx, transform: "rotate(-45deg)" },
            })}
          </animated.div>
        </animated.div>

        <Typography variant="h6" sx={{ marginTop: "40px", fontSize: "18px" }}>
          {cardName}
          <br></br>
          <p style={{ fontSize: "16px" }}>{paragraph}</p>
        </Typography>

        <Button
          variant="contained"
          onClick={onSelect}
          startIcon={<SelectAllIcon sx={{ fontSize: "58px" }} />}
          sx={{
            marginTop: "16px",
            backgroundColor: "#295bf9",
            "&:hover": {
              backgroundColor: "#1a46d0",
            },
          }}
        >
          Select
        </Button>
      </Box>
    </animated.div>
  );
};
