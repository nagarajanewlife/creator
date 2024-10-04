import React, { useState } from "react";
import {
  auth,
  provider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "../components/firebase";
import { sendPasswordResetEmail, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For confirm password
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For success messages
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
    useState(false);
  const [resetEmail, setResetEmail] = useState(""); // For password reset email
  const navigate = useNavigate();

  const handleSwitchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(""); // Reset error
    setMessage(""); // Reset message

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Sign-up user
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User signed up:", user);

          // Send verification email
          sendEmailVerification(user).then(() => {
            setMessage(
              "A verification email has been sent to your email address. Please verify it before logging in."
            );
          });

          axios
            .post("http://localhost:6969/addUser", {
              uid: user.uid,
              email: user.email,
              role: "user",
            })
            .then(() => {
              setMessage("User registered successfully.");
            })
            .catch((error) => {
              console.error("Error sending data:", error);
              setError(error.message);
            });
        })
        .catch((error) => {
          console.error("Error signing up:", error);
          setError(error.message);
        });
    } else {
      // Log-in user
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User logged in:", user);

          // Check if the email is verified
          if (user.emailVerified) {
            navigate(`/userhome/${user.displayName}/admindashboard`);
          } else {
            setError(
              "Your email is not verified. Please check your inbox for the verification link."
            );
          }
        })
        .catch((error) => {
          console.error("Error logging in:", error);
          setError(error.message);
        });
    }
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Google sign-in successful:", user);

        // If signing in with Google, assume email is already verified
        axios
          .post("http://localhost:6969/addUser", {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: "user",
          })
          .then(() => {
            alert("User added successfully");
            navigate(`/userhome/${user.displayName}/admindashboard`);
          })
          .catch((error) => {
            console.error("Error sending data:", error);
            setError(error.message);
          });
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
        setError(error.message);
      });
  };

  const handleForgotPassword = () => {
    // Open forgot password dialog
    setForgotPasswordDialogOpen(true);
  };

  const handleSendResetEmail = () => {
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setMessage("Password reset email sent. Check your inbox.");
        setForgotPasswordDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        setError(error.message);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success">{message}</Alert>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isSignUp && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={handleForgotPassword}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={handleSwitchMode}>
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </Button>
          </Box>
        </Box>

        {/* Forgot Password Dialog */}
        <Dialog
          open={forgotPasswordDialogOpen}
          onClose={() => setForgotPasswordDialogOpen(false)}
        >
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter your email address and we'll send you a link to reset your
              password.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="resetEmail"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setForgotPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendResetEmail}>Send Reset Link</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default AuthPage;
