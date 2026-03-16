import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Box,
  Typography
} from "@mui/material";
import {
  DashboardOutlined,
  PeopleOutlined,
  AssignmentOutlined,
  LocalHospitalOutlined,
  MedicalServicesOutlined,
  SettingsOutlined
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260; // Légèrement plus large pour l'élégance
const PRIMARY_BLUE = '#1976d2';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardOutlined />, path: '/dashboard' },
    { text: 'Patients', icon: <PeopleOutlined />, path: '/patients' },
    { text: 'Références', icon: <AssignmentOutlined />, path: '/references' },
    { text: 'Hôpitaux', icon: <LocalHospitalOutlined />, path: '/hospitals' },
    { text: 'Services', icon: <MedicalServicesOutlined />, path: '/services' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: '64px', // Aligné sous la Navbar
          height: 'calc(100% - 64px)',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: '#fff',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', px: 2, py: 3 }}>
        
        <Typography 
          variant="caption" 
          sx={{ 
            px: 2, 
            fontWeight: 700, 
            color: 'text.secondary', 
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            fontSize: '0.7rem'
          }}
        >
          Menu Principal
        </Typography>

        <List sx={{ mt: 1, gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={active}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  transition: 'all 0.2s',
                  '&.Mui-selected': {
                    bgcolor: `${PRIMARY_BLUE}10`,
                    color: PRIMARY_BLUE,
                    '& .MuiListItemIcon-root': { color: PRIMARY_BLUE },
                    '&:hover': { bgcolor: `${PRIMARY_BLUE}20` },
                    '&::before': { // La barre d'accentuation à gauche
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      height: '60%',
                      width: 4,
                      bgcolor: PRIMARY_BLUE,
                      borderRadius: '0 4px 4px 0'
                    }
                  },
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary', transition: 'color 0.2s' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.95rem',
                    fontFamily: "'DM Sans', sans-serif"
                  }} 
                />
              </ListItemButton>
            );
          })}
        </List>

        <Divider sx={{ my: 3, mx: 2, opacity: 0.6 }} />

        <Typography 
          variant="caption" 
          sx={{ 
            px: 2, 
            fontWeight: 700, 
            color: 'text.secondary', 
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            fontSize: '0.7rem'
          }}
        >
          Configuration
        </Typography>

        <List sx={{ mt: 1 }}>
          <ListItemButton 
            onClick={() => navigate('/settings')}
            selected={location.pathname === '/settings'}
            sx={{ 
              borderRadius: 2,
              '&:hover': { transform: 'translateX(4px)' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}><SettingsOutlined /></ListItemIcon>
            <ListItemText 
              primary="Paramètres" 
              primaryTypographyProps={{ fontSize: '0.95rem', fontFamily: "'DM Sans', sans-serif" }} 
            />
          </ListItemButton>
        </List>
      </Box>

      {/* Petit badge de version en bas de la sidebar */}
      <Box sx={{ mt: 'auto', p: 3, textAlign: 'center' }}>
        <Paper 
          variant="outlined" 
          sx={{ 
            py: 1, 
            px: 2, 
            borderRadius: 3, 
            bgcolor: 'action.hover', 
            borderColor: 'divider' 
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            v1.0.2-SID
          </Typography>
        </Paper>
      </Box>
    </Drawer>
  );
};

export default Sidebar;