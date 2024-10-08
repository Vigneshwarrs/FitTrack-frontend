import * as React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  Slide,
  Snackbar,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useFormik } from "formik";
import * as yup from "yup";
import { login } from "../services/authService";
import { useTheme } from "@mui/material/styles";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function LogIn() {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();
  const theme = useTheme(); // Access theme for consistent styling
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is small

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const authForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await login(values.email, values.password)
          .then((res) => {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setSnackbar({
              open: true,
              message: "Login successful! Redirecting to your dashboard...",
              severity: "success",
            });
            setTimeout(() => {
              navigate("/dashboard");
              authForm.resetForm();
            }, 3000);
          });
      } catch (error) {
        console.error("Login error:", error);
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message || "Invalid email or password. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        width={isSmallScreen ? "100%" : 450} // Adjust width for small screens
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ color: theme.palette.text.primary }}>
          Sign In
        </Typography>
        <Box component="form" onSubmit={authForm.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={authForm.values.email}
            onChange={authForm.handleChange}
            onBlur={authForm.handleBlur}
            error={authForm.touched.email && Boolean(authForm.errors.email)}
            helperText={authForm.touched.email && authForm.errors.email}
            autoFocus
            sx={{ input: { color: theme.palette.text.primary } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={authForm.values.password}
            onChange={authForm.handleChange}
            onBlur={authForm.handleBlur}
            error={authForm.touched.password && Boolean(authForm.errors.password)}
            helperText={authForm.touched.password && authForm.errors.password}
            sx={{ input: { color: theme.palette.text.primary } }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size="1rem" /> : null}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Link to="/forgot-password" style={{ color: theme.palette.primary.main }}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" style={{ color: theme.palette.primary.main }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
