import React, { useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FicheReference } from './FicheReference';
import {
  Box, Paper, Typography, Button, Grid, FormControl, InputLabel,
  Select, MenuItem, Stepper, TextField, Step, StepLabel, Alert,
  CircularProgress, Card, CardContent, Divider, Chip
} from '@mui/material';

// Icônes recommandées (Assure-toi d'avoir fait : npm install @mui/icons-material)
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PrintIcon from '@mui/icons-material/Print';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import api from '../../services/api';
import HospitalProposal from './HospitalProposal';

const user = JSON.parse(localStorage.getItem('user')) || { id: 1, hospital_id: 1 };
const steps = ['Patient et Service', 'Détails Cliniques', 'Choix de l\'Hôpital', 'Confirmation'];

const ReferenceForm = () => {
  const componentRef = React.useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [referenceCreated, setReferenceCreated] = useState(null);
  const [error, setError] = useState('');

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Reference_${referenceCreated?.id || 'export'}`,
  });

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
        setError('Erreur lors du chargement des données. Veuillez vérifier votre connexion.');
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
      const payload = {
        patient: parseInt(formData.patient_id, 10),
        service: parseInt(formData.service_id, 10),
        doctor: user.id,
        hospital_source: 1, 
        hospital_destination: selectedHospital.id, 
        motif_consultation: formData.motif_consultation,
        trouvailles_cliniques: formData.trouvailles_cliniques,
        diagnostic: formData.diagnostic,
        examens_faits: formData.examens_paracliniques,
        traitements_recus: formData.traitements_recus,
        niveau_urgence: formData.niveau_urgence,
        raisons_reference: formData.raisons_reference || "Non spécifié",
        status: 'en_attente'
      };

      const response = await api.post('/references/', payload);

      if (selectedHospital.ml_data_id) {
        await api.post('/references/choisir_hopital/', {
          ml_data_id: selectedHospital.ml_data_id,
          reference_id: response.data.id
        });
      }

      setReferenceCreated(response.data);
      handleNext();
    } catch (err) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Erreur réseau';
      setError(`Impossible de créer la référence : ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDU DES ÉTAPES ---
  const getStepContent = (step) => {
    switch (step) {
      case 0: // ÉTAPE 1 : Patient & Service
        return (
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', mt: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>Identification</Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Sélectionner un Patient</InputLabel>
                    <Select
                      value={formData.patient_id}
                      label="Sélectionner un Patient"
                      onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                    >
                      {patients.map((p) => (
                        <MenuItem key={p.id} value={p.id}>{p.first_name} {p.last_name} - {p.phone}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Service Requis</InputLabel>
                    <Select
                      value={formData.service_id}
                      label="Service Requis"
                      onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                    >
                      {services.map((s) => (
                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 1: // ÉTAPE 2 : Détails Cliniques
        return (
          <Box>
            {/* Section Motif & Urgence */}
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 3, mt: 2 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <TextField fullWidth label="Motif de consultation" required multiline rows={2} value={formData.motif_consultation} onChange={(e) => setFormData({ ...formData, motif_consultation: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField select fullWidth label="Degré d'urgence" value={formData.niveau_urgence} onChange={(e) => setFormData({ ...formData, niveau_urgence: e.target.value })}>
                      <MenuItem value="FAIBLE"><Chip label="Faible" size="small" color="success" /></MenuItem>
                      <MenuItem value="MOYENNE"><Chip label="Moyenne" size="small" color="warning" /></MenuItem>
                      <MenuItem value="TRES_URGENT"><Chip label="Très Urgent" size="small" color="error" /></MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Section Médicale */}
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Données Médicales</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Trouvailles cliniques" multiline rows={3} placeholder="Symptômes constatés..." value={formData.trouvailles_cliniques} onChange={(e) => setFormData({ ...formData, trouvailles_cliniques: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Diagnostic Provisoire" required multiline rows={3} placeholder="Votre diagnostic..." value={formData.diagnostic} onChange={(e) => setFormData({ ...formData, diagnostic: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Examens faits et résultats" multiline rows={2} value={formData.examens_paracliniques} onChange={(e) => setFormData({ ...formData, examens_paracliniques: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Traitements reçus" multiline rows={2} placeholder="Médicaments administrés..." value={formData.traitements_recus} onChange={(e) => setFormData({ ...formData, traitements_recus: e.target.value })} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );

      case 2: // ÉTAPE 3 : Choix de l'Hôpital
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>Sélectionnez l'établissement le plus adapté selon le système de recommandation.</Alert>
            <HospitalProposal patientId={formData.patient_id} serviceId={formData.service_id} onSelect={setSelectedHospital} />
          </Box>
        );

      case 3: // ÉTAPE 4 : Confirmation et Impression
        return (
          <Card elevation={0} sx={{ border: '1px solid #4caf50', mt: 2, backgroundColor: '#f1f8e9' }}>
            <CardContent sx={{ textAlign: 'center', py: 5 }}>
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" color="success.main" gutterBottom>
                Référence créée avec succès !
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Le transfert du patient a bien été enregistré dans le système.
              </Typography>

              {/* Conteneur pour l'impression (Caché sans utiliser display:none) */}
              <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div ref={componentRef}>
                  <FicheReference data={referenceCreated} />
                </div>
              </div>

              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="large"
                    startIcon={<PrintIcon />}
                    onClick={() => handlePrint()} 
                    disabled={!referenceCreated}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Imprimer la fiche officielle
                  </Button>
                </Grid>
                <Grid item>
                  <Button 
                    variant="outlined" 
                    size="large"
                    href="/dashboard"
                    sx={{ px: 4, py: 1.5, backgroundColor: 'white' }}
                  >
                    Retour au Tableau de Bord
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      default: return 'Étape inconnue';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 5 }, maxWidth: 1000, mx: 'auto', mt: 4, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <LocalHospitalIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          Nouvelle Référence Patient
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: '300px' }}>
        {getStepContent(activeStep)}
      </Box>

      {activeStep < steps.length - 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, pt: 2, borderTop: '1px solid #eeeeee' }}>
          <Button 
            disabled={activeStep === 0} 
            onClick={handleBack} 
            startIcon={<ArrowBackIcon />}
            size="large"
          >
            Retour
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={activeStep !== 2 && <ArrowForwardIcon />}
            onClick={activeStep === 2 ? handleCreateReference : handleNext}
            disabled={
              (activeStep === 0 && (!formData.patient_id || !formData.service_id)) ||
              (activeStep === 1 && (!formData.motif_consultation || !formData.diagnostic)) ||
              (activeStep === 2 && !selectedHospital) ||
              loading
            }
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : (activeStep === 2 ? 'Confirmer et Créer' : 'Étape Suivante')}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ReferenceForm;