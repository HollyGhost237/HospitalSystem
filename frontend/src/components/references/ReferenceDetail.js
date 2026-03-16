import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Chip,
  Box,
  Divider,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  LocalHospital,
  Person,
  Event,
  Description
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const steps = ['pending', 'accepted', 'received', 'completed'];

const ReferenceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reference, setReference] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReference();
  }, [id]);

  const fetchReference = async () => {
    setLoading(true);
    try {
      const [refRes, histRes] = await Promise.all([
        api.get(`/references/${id}/`),
        api.get(`/references/${id}/history/`)
      ]);
      setReference(refRes.data);
      setHistory(histRes.data || []);
    } catch (err) {
      setError('Erreur lors du chargement de la reference');
    } finally {
      setLoading(false);
    }
  };

  const getActiveStep = () => {
    const index = steps.indexOf(reference?.status);
    return index === -1 ? 0 : index;
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !reference) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Reference introuvable'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/references')}
        sx={{ mb: 2 }}
      >
        Retour a la liste
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reference #{reference.id}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Description sx={{ mr: 1 }} /> Informations generales
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={4}><strong>Statut:</strong></Grid>
                  <Grid item xs={8}>
                    <Chip
                      label={reference.status}
                      color={reference.status === 'rejected' ? 'error' : 'success'}
                    />
                  </Grid>
                  <Grid item xs={4}><strong>Date:</strong></Grid>
                  <Grid item xs={8}>{new Date(reference.date_reference).toLocaleString()}</Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Person sx={{ mr: 1 }} /> Patient
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={4}><strong>Nom:</strong></Grid>
                  <Grid item xs={8}>{reference.patient_name}</Grid>
                  <Grid item xs={4}><strong>Age:</strong></Grid>
                  <Grid item xs={8}>{reference.patient_age ? `${reference.patient_age} ans` : '-'}</Grid>
                  <Grid item xs={4}><strong>Sexe:</strong></Grid>
                  <Grid item xs={8}>{reference.patient_gender || '-'}</Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <LocalHospital sx={{ mr: 1 }} /> Hopital source
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">{reference.hospital_source_name}</Typography>
                <Typography variant="body2" color="text.secondary">{reference.hospital_source_address}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <LocalHospital sx={{ mr: 1 }} /> Hopital cible
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">{reference.hospital_destination_name}</Typography>
                <Typography variant="body2" color="text.secondary">{reference.hospital_destination_address}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Event sx={{ mr: 1 }} /> Suivi de la reference
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stepper activeStep={getActiveStep()} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {history.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1">Historique des actions</Typography>
                    {history.map((h) => (
                      <Box key={h.id} sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="body2">
                          <strong>{new Date(h.created_at).toLocaleString()}</strong> - {h.status}
                        </Typography>
                        {h.comment && (
                          <Typography variant="body2" color="text.secondary">
                            {h.comment}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ReferenceDetail;
