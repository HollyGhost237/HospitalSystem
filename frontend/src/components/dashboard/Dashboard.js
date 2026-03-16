import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  CardActionArea,
  Avatar,
  Skeleton,
  Fade,
  Divider,
  Alert,
} from '@mui/material';
import {
  PeopleAltOutlined,
  LocalHospitalOutlined,
  AssignmentOutlined,
  PersonAddOutlined,
  AddCircleOutline,
  ArrowForwardIos,
  WifiOutlined,
} from '@mui/icons-material';
import api from '../../services/api';

// --- Palette de couleurs cohérente avec la Navbar ---
const PRIMARY_BLUE = '#1976d2'; // Couleur standard AppBar MUI
const BG_LIGHT = '#f4f7fa';

const PulseRing = ({ color }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 0 0 ${color}55`,
      animation: 'pulse 2s infinite',
      '@keyframes pulse': {
        '0%': { boxShadow: `0 0 0 0 ${color}` },
        '70%': { boxShadow: `0 0 0 6px transparent` },
        '100%': { boxShadow: `0 0 0 0 transparent` },
      },
    }}
  />
);

const StatCard = ({ icon, label, value, loading, delay }) => (
  <Fade in={true} style={{ transitionDelay: `${delay}ms` }}>
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        transition: 'box-shadow 0.3s ease',
        '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Avatar
          variant="rounded"
          sx={{ bgcolor: `${PRIMARY_BLUE}10`, color: PRIMARY_BLUE, width: 48, height: 48 }}
        >
          {icon}
        </Avatar>
        <Box display="flex" alignItems="center" gap={1}>
          <PulseRing color="#10b981" />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Live
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
          {label}
        </Typography>
        {loading ? (
          <Skeleton width="60%" height={48} />
        ) : (
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.5, fontFamily: "'Inter', sans-serif" }}>
            {value}
          </Typography>
        )}
      </Box>
    </Paper>
  </Fade>
);

const ActionCard = ({ title, description, onClick, icon, featured, delay }) => (
  <Fade in={true} style={{ transitionDelay: `${delay}ms` }}>
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        height: '100%',
        bgcolor: featured ? PRIMARY_BLUE : '#fff',
        color: featured ? '#fff' : 'text.primary',
        border: '1px solid',
        borderColor: featured ? PRIMARY_BLUE : 'divider',
        transition: 'transform 0.2s ease',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ p: 4, height: '100%' }}>
        <Avatar
          sx={{ 
            bgcolor: featured ? 'rgba(255,255,255,0.2)' : `${PRIMARY_BLUE}10`, 
            color: featured ? '#fff' : PRIMARY_BLUE, 
            mb: 2 
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: featured ? 0.9 : 0.7, mb: 3 }}>
          {description}
        </Typography>
        <Box display="flex" alignItems="center" gap={1} sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
          EXÉCUTER <ArrowForwardIos sx={{ fontSize: '0.75rem' }} />
        </Box>
      </CardActionArea>
    </Card>
  </Fade>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ patients: 0, hopitaux: 0, references: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [p, h, r] = await Promise.all([api.get('/patients/'), api.get('/hospitals/'), api.get('/references/')]);
        setStats({
          patients: p.pagination?.count || p.data.length,
          hopitaux: h.pagination?.count || h.data.length,
          references: r.pagination?.count || r.data.length,
        });
      } catch (err) {
        setError("Erreur de synchronisation avec le serveur local.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: BG_LIGHT, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ py: 6, flexGrow: 1 }}>
        
        {/* Barre de titre et état système */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a2027' }}>
              Tableau de bord
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Système de Référencement SID • Douala, Cameroun
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fff', px: 2, py: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <WifiOutlined sx={{ color: PRIMARY_BLUE, fontSize: '1.2rem' }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>POINT D'ACCÈS LOCAL</Typography>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

        {/* Statistiques */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatCard icon={<PeopleAltOutlined />} label="Patients" value={stats.patients} loading={loading} delay={100} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatCard icon={<LocalHospitalOutlined />} label="Hôpitaux" value={stats.hopitaux} loading={loading} delay={200} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatCard icon={<AssignmentOutlined />} label="Références" value={stats.references} loading={loading} delay={300} />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 6 }} />

        {/* Actions */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1.5 }}>
          Gestion Opérationnelle
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ActionCard
              icon={<PersonAddOutlined />}
              title="Admission Patient"
              description="Formulaire d'enregistrement sécurisé pour les nouveaux patients arrivants."
              onClick={() => navigate('/patients/nouveau')}
              delay={400}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ActionCard
              icon={<AddCircleOutline />}
              title="Nouveau Transfert"
              description="Générer une référence médicale vers un établissement partenaire."
              featured
              onClick={() => navigate('/references/nouvelle')}
              delay={500}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;