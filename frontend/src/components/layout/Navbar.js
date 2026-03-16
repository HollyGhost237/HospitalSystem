import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Divider,
  Avatar,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  useNavigate 
} from 'react-router-dom';
import { 
  LocalHospitalOutlined, 
  LogoutOutlined, 
  AccountCircleOutlined 
} from '@mui/icons-material';

const PRIMARY_BLUE = '#1976d2';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        
        {/* Section Logo / Titre */}
        <Box 
          display="flex" 
          alignItems="center" 
          gap={1.5} 
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Avatar 
            variant="rounded" 
            sx={{ 
              bgcolor: PRIMARY_BLUE, 
              width: 40, 
              height: 40,
              boxShadow: `0 4px 12px ${PRIMARY_BLUE}40`
            }}
          >
            <LocalHospitalOutlined sx={{ color: '#fff' }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800, 
                lineHeight: 1.2, 
                letterSpacing: '-0.5px',
                color: '#1a2027'
              }}
            >
              MedRef
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                fontWeight: 600, 
                color: 'text.secondary',
                textTransform: 'uppercase',
                fontSize: '0.65rem'
              }}
            >
              Master SID • Douala
            </Typography>
          </Box>
        </Box>

        {/* Section Utilisateur et Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
          
          {/* Badge Utilisateur */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              bgcolor: 'action.hover',
              px: 1.5,
              py: 0.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }}>
                {user?.username || 'Utilisateur'}
              </Typography>
              <Typography variant="caption" sx={{ color: PRIMARY_BLUE, fontWeight: 600 }}>
                {user?.role_name || 'Personnel'}
              </Typography>
            </Box>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: 'divider', 
                color: 'text.secondary' 
              }}
            >
              <AccountCircleOutlined fontSize="small" />
            </Avatar>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ my: 1.5, display: { xs: 'none', sm: 'block' } }} />

          {/* Bouton Déconnexion */}
          <Tooltip title="Se déconnecter">
            <Button
              variant="contained"
              disableElevation
              onClick={handleLogout}
              startIcon={<LogoutOutlined />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#fdeded',
                color: '#d32f2f',
                '&:hover': {
                  bgcolor: '#f9dada',
                }
              }}
            >
              Quitter
            </Button>
          </Tooltip>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;