import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Container,
  Paper,
  Typography
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'M',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPatient();
      setIsEditMode(true);
    }
  }, [id]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/patients/${id}/`);
      setFormData(response.data);
    } catch (err) {
      setError('Erreur lors du chargement du patient');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone ? formData.phone.trim() : null,
        address: formData.address ? formData.address.trim() : ''
      };
      if (isEditMode) {
        await api.put(`/patients/${id}/`, payload);
      } else {
        await api.post('/patients/', payload);
      }
      navigate('/patients');
    } catch (err) {
      const detail = err.response?.data;
      if (detail && typeof detail === 'object') {
        const message = Object.entries(detail)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
          .join(' | ');
        setError(message);
      } else {
        setError('Erreur lors de l\'enregistrement du patient');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <Typography>Chargement...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={3}>
          {isEditMode ? 'Modifier le patient' : 'Ajouter un nouveau patient'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nom"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Prenom"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Date de naissance"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                label="Sexe"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="M">Masculin</MenuItem>
                <MenuItem value="F">Feminin</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telephone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                name="address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/patients')}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : isEditMode ? 'Modifier' : 'Ajouter'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientForm;
