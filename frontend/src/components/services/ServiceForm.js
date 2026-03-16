import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Alert
} from '@mui/material';
import api from '../../services/api';

const ServiceForm = ({ service, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (service) {
        await api.put(`/services/${service.id}/`, formData);
      } else {
        await api.post('/services/', formData);
      }
      onSuccess();
    } catch (err) {
      setError('Erreur lors de l\'enregistrement');
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
            label="Nom du service"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>Annuler</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Enregistrement...' : (service ? 'Modifier' : 'Ajouter')}
        </Button>
      </Box>
    </Box>
  );
};

export default ServiceForm;
