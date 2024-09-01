import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button, 
  Drawer,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  IconButton,
  Avatar,
  Tooltip,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { Logout as LogoutIcon } from "@mui/icons-material";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    setSnackbar({
      open: true,
      message: "Are you sure you want to log out?",
      severity: "warning",
    });
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSnackbar({
      open: true,
      message: "Logged out successfully.",
      severity: "success",
    });
      navigate("/login");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const drawer = (
    <div>
      {token && user ? (
        <List>
          <ListItem
            button
            component={Link}
            to="/profile"
            onClick={handleDrawerToggle}
          >
            <Tooltip title={user.name} arrow>
              <Avatar
                sx={{ bgcolor: "blueviolet", marginRight: 1 }}
                alt={user.name}
                src={user.profilePic}
              >
                {user.name.charAt(0)}
              </Avatar>
            </Tooltip>
          </ListItem>
          <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
            Home
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/goals"
            onClick={handleDrawerToggle}
          >
            Goals
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/workouts"
            onClick={handleDrawerToggle}
          >
            Workouts
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/nutrition"
            onClick={handleDrawerToggle}
          >
            Nutrition
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <LogoutIcon />
            <Typography variant="button">Logout</Typography>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem
            button
            component={Link}
            to="/login"
            onClick={handleDrawerToggle}
          >
            Login
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/register"
            onClick={handleDrawerToggle}
          >
            Register
          </ListItem>
        </List>
      )}
    </div>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box display="flex" alignItems="center" width="100%">
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Fitness Tracker
            </Typography>
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                >
                  {drawer}
                </Drawer>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/goals">
                  Goals
                </Button>
                <Button color="inherit" component={Link} to="/workouts">
                  Workouts
                </Button>
                <Button color="inherit" component={Link} to="/nutrition">
                  Nutrition
                </Button>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                <LogoutIcon />
                  Logout
                </Button>
                <Tooltip title={user.name} arrow>
                  <Avatar
                    sx={{ bgcolor: "blueviolet", marginLeft: 2 }}
                    alt={user.name}
                    src={user.profilePic}
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                </Tooltip>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Snackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          action={
            snackbar.severity === "warning" ? (
              <Button color="inherit" size="small" onClick={confirmLogout}>
                Confirm
              </Button>
            ) : null
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
