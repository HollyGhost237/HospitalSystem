import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Grid, FormControl, InputLabel,
  Select, MenuItem, Stepper, TextField, Step, StepLabel, Alert,
  CircularProgress, Card, CardContent
} from '@mui/material';
import api from '../../services/api';
import HospitalProposal from './HospitalProposal';

const steps = ['Patient et service', 'Détails cliniques', 'Choix de l\'hôpital', 'Confirmation'];

const ReferenceForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [referenceCreated, setReferenceCreated] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    patient_id: '',
    service_id: '',
    motif_consultation: '',
    trouvailles_cliniques: '',
    diagnostic: '',
    examens_paracliniques: '',
    traitements_recus: '',
    niveau_urgence: 'FAIBLE',
    raisons_reference: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patientsRes, servicesRes] = await Promise.all([
          api.get('/patients/'),
          api.get('/services/')
        ]);
        const patientsData = patientsRes.data.results || patientsRes.data;
        const servicesData = servicesRes.data.results || servicesRes.data;
        setPatients(Array.isArray(patientsData) ? patientsData : []);
        setServices(Array.isArray(servicesData) ? servicesData : []);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleCreateReference = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/references/', {
        patient: parseInt(formData.patient_id, 10),
        service: parseInt(formData.service_id, 10),
        hospital_destination: selectedHospital.id,
        motif_consultation: formData.motif_consultation,
        trouvailles_cliniques: formData.trouvailles_cliniques,
        diagnostic: formData.diagnostic,
        examens_faits: formData.examens_paracliniques,
        traitements_recus: formData.traitements_recus,
        niveau_urgence: formData.niveau_urgence
      });

      // Si ton backend utilise un moteur de recommandation spécifique
      if (selectedHospital.ml_data_id) {
        await api.post('/references/choisir_hopital/', {
          ml_data_id: selectedHospital.ml_data_id,
          reference_id: response.data.id
        });
      }

      setReferenceCreated(response.data);
      handleNext();
    } catch (err) {
      setError('Erreur lors de la création de la référence');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const patientLabel = patients.find(p => p.id === Number(formData.patient_id));
  const serviceLabel = services.find(s => s.id === Number(formData.service_id));

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Patient</InputLabel>
                <Select
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                >
                  {patients.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.first_name} {p.last_name} ({p.phone})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Service requis</InputLabel>
                <Select
                  value={formData.service_id}
                  onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                >
                  {services.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Motif de consultation" required multiline rows={2} value={formData.motif_consultation} onChange={(e) => setFormData({ ...formData, motif_consultation: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Degré d'urgence" value={formData.niveau_urgence} onChange={(e) => setFormData({ ...formData, niveau_urgence: e.target.value })}>
                <MenuItem value="TRES_URGENT">Très Urgent</MenuItem>
                <MenuItem value="MOYENNE">Moyenne urgence</MenuItem>
                <MenuItem value="FAIBLE">Faible urgence</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Trouvailles cliniques" multiline rows={3} value={formData.trouvailles_cliniques} onChange={(e) => setFormData({ ...formData, trouvailles_cliniques: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Diagnostic" required multiline rows={3} value={formData.diagnostic} onChange={(e) => setFormData({ ...formData, diagnostic: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Examens faits et résultats" multiline rows={2} value={formData.examens_paracliniques} onChange={(e) => setFormData({ ...formData, examens_paracliniques: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Traitements reçus" multiline rows={2} value={formData.traitements_recus} onChange={(e) => setFormData({ ...formData, traitements_recus: e.target.value })} />
            </Grid>
          </Grid>
        );
      case 2:
        return <HospitalProposal patientId={formData.patient_id} serviceId={formData.service_id} onSelect={setSelectedHospital} />;
      case 3:
        return (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="h6">Référence créée avec succès</Typography>
            <Typography><strong>Patient :</strong> {referenceCreated?.patient_name}</Typography>
            <Typography><strong>Hôpital cible :</strong> {referenceCreated?.hospital_destination_name}</Typography>
            <Button variant="contained" href="/dashboard" sx={{ mt: 2 }}>Retour au Dashboard</Button>
          </Alert>
        );
      default: return 'Etape inconnue';
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Nouvelle référence patient</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stepper activeStep={activeStep} sx={{ my: 3 }}>
        {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      <Box sx={{ mt: 2 }}>{getStepContent(activeStep)}</Box>

      {activeStep < steps.length - 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Retour</Button>
          <Button
            variant="contained"
            onClick={activeStep === 2 ? handleCreateReference : handleNext}
            disabled={
              (activeStep === 0 && (!formData.patient_id || !formData.service_id)) ||
              (activeStep === 1 && (!formData.motif_consultation || !formData.diagnostic)) ||
              (activeStep === 2 && !selectedHospital) ||
              loading
            }
          >
            {loading ? <CircularProgress size={24} /> : (activeStep === 2 ? 'Confirmer et Créer' : 'Suivant')}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ReferenceForm;