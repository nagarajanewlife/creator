// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { AppBar, Toolbar, Typography, Button, Grid, Box } from "@mui/material";
// import { DndProvider, HTML5Backend } from "react-dnd";
// // import DropArea from "./DropArea"; // Assuming DropArea is exported for reuse

// const Edit = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const navigate = useNavigate();
//   const data = queryParams.get("data");
//   const [droppedInputs, setDroppedInputs] = useState(
//     JSON.parse(decodeURIComponent(data))
//   );

//   const handleSaveClick = () => {
//     const serializedData = encodeURIComponent(JSON.stringify(droppedInputs));
//     navigate(`/publish?data=${serializedData}`);
//   };

//   return (
//     <>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Edit Form
//           </Typography>
//           <Button variant="contained" color="primary" onClick={handleSaveClick}>
//             Save
//           </Button>
//         </Toolbar>
//       </AppBar>
//       <DndProvider backend={HTML5Backend}>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <Box sx={{ padding: "10px" }}>
//               <DropArea
//                 droppedInputs={droppedInputs}
//                 onDrop={(task) => setDroppedInputs((prev) => [...prev, task])}
//               />
//             </Box>
//           </Grid>
//         </Grid>
//       </DndProvider>
//     </>
//   );
// };

// export default Edit;
