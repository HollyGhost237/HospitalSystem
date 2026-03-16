import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  OutlinedInput,
  Select,
  InputLabel,
  FormControl,
  Chip
} from '@mui/material';
import api from '../../services/api';

const HospitalForm = ({ hospital, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: hospital?.name || '',
    address: hospital?.address || '',
    phone: hospital?.phone || '',
    latitude: hospital?.latitude || '',
    longitude: hospital?.longitude || '',
    type: hospital?.type || 'PUBLIC',
    services: hospital?.services?.map(s => s.id) || [], // On stocke les IDs des services
  });

  const [availableServices, setAvailableServices] = useState([]); // Liste venant de la DB
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Charger la liste des services disponibles au montage du composant
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services/');
        setAvailableServices(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des services", err);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        latitude: formData.latitude !== '' ? Number(formData.latitude) : null,
        longitude: formData.longitude !== '' ? Number(formData.longitude) : null,
        // C'est ici que l'on envoie les IDs des services au backend
        services: formData.services.map(id => parseInt(id)) 
      };

      if (hospital) {
        await api.put(`/hospitals/${hospital.id}/`, payload);
      } else {
        await api.post('/hospitals/', payload);
      }
      onSuccess();
    } catch (err) {
      setError('Erreur lors de l\'enregistrement des données et des services.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Nom de l'hopital"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Adresse"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Telephone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Latitude"
            name="latitude"
            type="number"
            inputProps={{ step: 'any' }}
            value={formData.latitude}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Longitude"
            name="longitude"
            type="number"
            inputProps={{ step: 'any' }}
            value={formData.longitude}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <MenuItem value="PUBLIC">Public</MenuItem>
            <MenuItem value="PRIVE">Prive</MenuItem>
            <MenuItem value="MISSION">Mission / Confessionnel</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Services disponibles</InputLabel>
            <Select
              multiple
              name="services"
              value={formData.services}
              onChange={handleChange}
              input={<OutlinedInput label="Services disponibles" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const service = availableServices.find(s => s.id === value);
                    return <Chip key={value} label={service?.name} color="primary" variant="outlined" size="small" />;
                  })}
                </Box>
              )}
            >
              {availableServices.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>Annuler</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Enregistrement...' : (hospital ? 'Modifier' : 'Ajouter')}
        </Button>
      </Box>
    </Box>
  );
};

export default HospitalForm;
