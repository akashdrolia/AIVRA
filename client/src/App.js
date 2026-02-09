import { useState } from "react";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Advice from "./pages/Advice";
import History from "./pages/History";
import Profile from "./pages/Profile";
import { logout } from "./api/api";
import "./App.css";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import HelpIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

export default function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("token")));
  const [view, setView] = useState("home"); // home | login | signup
  const [selectedPage, setSelectedPage] = useState('chats'); // chats | history | advice | profile

  if (!loggedIn) {
    return (
      <div style={{ paddingTop: 40 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>AIVRA</Typography>
        </Box>
        <Auth
          onAuth={() => setLoggedIn(true)}
          initialMode={view === "signup" ? "signup" : "login"}
          onSwitchMode={(m) => setView(m === "signup" ? "signup" : "login")}
        />
      </div>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(90deg,#5b1892,#6b21a8)' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            AIVRA
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={() => { logout(); setLoggedIn(false); }}>
              <LogoutIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => setSelectedPage('profile') }>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>A</Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
            <Box>
              <Typography variant="subtitle1">Akash</Typography>
              <Typography variant="caption" color="text.secondary">Student • SDE aspirant</Typography>
            </Box>
          </Box>
          <Divider />
          <List>
            <ListItem button selected={selectedPage === 'chats'} onClick={() => setSelectedPage('chats')}>
              <ListItemIcon><ChatIcon /></ListItemIcon>
              <ListItemText primary="Chats" />
            </ListItem>
            <ListItem button selected={selectedPage === 'history'} onClick={() => setSelectedPage('history')}>
              <ListItemIcon><HistoryIcon /></ListItemIcon>
              <ListItemText primary="History" />
            </ListItem>
            <ListItem button selected={selectedPage === 'advice'} onClick={() => setSelectedPage('advice')}>
              <ListItemIcon><HelpIcon /></ListItemIcon>
              <ListItemText primary="Advice" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {selectedPage === 'chats' && <Home />}
        {selectedPage === 'history' && <div><History /></div>}
        {selectedPage === 'advice' && <div><Advice onNewAdvice={() => { /* no-op for now */ }} /></div>}
        {selectedPage === 'profile' && <div><Profile /></div>}
      </Box>
    </Box>
  );
}
