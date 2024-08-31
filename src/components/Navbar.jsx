import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Drawer, List, ListItem, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <List>
        <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>Home</ListItem>
        <ListItem button component={Link} to="/goals" onClick={handleDrawerToggle}>Goals</ListItem>
        <ListItem button component={Link} to="/workouts" onClick={handleDrawerToggle}>Workouts</ListItem>
        <ListItem button component={Link} to="/nutrition" onClick={handleDrawerToggle}>Nutrition</ListItem>
        <ListItem button component={Link} to="/insights" onClick={handleDrawerToggle}>Insights</ListItem>
        <ListItem button component={Link} to="/profile" onClick={handleDrawerToggle}>Profile</ListItem>
        <ListItem button component={Link} to="/login" onClick={handleDrawerToggle}>Login</ListItem>
        <ListItem button component={Link} to="/register" onClick={handleDrawerToggle}>Register</ListItem>
        <ListItem button component={Link} to="/dashboard" onClick={handleDrawerToggle}>Dashboard</ListItem>
      </List>
    </div>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Fitness Tracker
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              style={{ marginRight: 16 }}
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
          <Container>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/goals">Goals</Button>
            <Button color="inherit" component={Link} to="/workouts">Workouts</Button>
            <Button color="inherit" component={Link} to="/nutrition">Nutrition</Button>
            <Button color="inherit" component={Link} to="/insights">Insights</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          </Container>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
