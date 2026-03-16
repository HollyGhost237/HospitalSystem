import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  LocationOn,
  LocalHospital,
  Speed,
  Star,
  CheckCircle
} from '@mui/icons-material';
import api from '../../services/api';

const HospitalProposal = ({ patientId, serviceId, onSelect }) => {
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    if (patientId && serviceId) {
      fetchProposals();
    }
  }, [patientId, serviceId]);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const response = await api.post('/references/proposer_hopitaux/', {
        patient_id: patientId,
        service_id: serviceId
      });

      // On vérifie si l'intercepteur a déjà extrait les données ou non
      // Si response.data est déjà un tableau, c'est que l'intercepteur a agi
      const data = Array.isArray(response.data) 
        ? response.data 
        : (response.data.propositions || []);

      setProposals(data);
      setError(null);
    } catch (err) {
      // Si Django renvoie {'error': 'Hopital source non geolocalise'}, on l'affiche !
      const serverMessage = err.response?.data?.error || 'Erreur de récupération';
      setError(serverMessage); 
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHospital = async (proposal) => {
    setSelectedHospital(proposal.id);
    
    try {
      // 1. On informe le moteur de décision du choix final (pour le ML futur)
      await api.post('/references/choisir_hopital/', {
        ml_data_id: proposal.ml_data_id
      });

      // 2. On passe l'info au parent pour créer la référence réelle
      if (onSelect) {
        onSelect(proposal);
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du choix:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Hopitaux recommandes
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        Base sur la distance et l'offre de services disponibles
      </Typography>

      <Grid container spacing={2}>
        {proposals.map((proposal) => (
          <Grid item xs={12} key={proposal.id}>
            <Card
              sx={{
                border: selectedHospital === proposal.id ? 2 : 1,
                borderColor: selectedHospital === proposal.id ? 'primary.main' : 'divider',
                position: 'relative'
              }}
            >
              <CardContent>
                <Chip
                  label={`Score: ${proposal.score}%`}
                  color={proposal.score > 80 ? 'success' : proposal.score > 60 ? 'primary' : 'default'}
                  sx={{ position: 'absolute', top: 10, right: 10 }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6">
                      {proposal.name}
                    </Typography>

                    <Box display="flex" alignItems="center" mt={1}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" ml={1}>
                        {proposal.address}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mt={1}>
                      <LocalHospital fontSize="small" color="action" />
                      <Typography variant="body2" ml={1}>
                        {proposal.phone}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mt={2}>
                      <Chip
                        icon={<Speed />}
                        label={proposal.distance_km ? `${proposal.distance_km} km` : 'Distance inconnue'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        icon={<Star />}
                        label="Profil verifie"
                        size="small"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box display="flex" flexDirection="column" alignItems="flex-end">
                      <Button
                        variant={selectedHospital === proposal.id ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => handleSelectHospital(proposal)}
                        startIcon={<CheckCircle />}
                        fullWidth
                      >
                        {selectedHospital === proposal.id ? 'Selectionne' : 'Choisir'}
                      </Button>

                      <Typography variant="caption" color="text.secondary" mt={1}>
                        ID ML: {proposal.ml_data_id}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {proposals.length === 0 && !loading && (
        <Alert severity="info">
          Aucun hopital disponible pour ce service
        </Alert>
      )}
    </Box>
  );
};

export default HospitalProposal;
