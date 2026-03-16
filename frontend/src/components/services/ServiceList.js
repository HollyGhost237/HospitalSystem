import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../../services/api';
import ServiceForm from './ServiceForm';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services/');
      // Extraction des résultats
      const data = response.data.results || response.data;
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur chargement services');
      setServices([]);
    }
  };

  const handleOpenDialog = (service = null) => {
    setSelectedService(service);
    setOpenDialog(true);
  };

  const handleCloseDialog = (refresh = false) => {
    setOpenDialog(false);
    setSelectedService(null);
    if (refresh) fetchServices();
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/services/${deleteDialog.id}/`);
      setDeleteDialog({ open: false, id: null });
      fetchServices();
    } catch (err) {
      setError('Erreur suppression');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Services medicaux</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nouveau service
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(services) && services.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.description}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(s)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => setDeleteDialog({ open: true, id: s.id })}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => handleCloseDialog()} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedService ? 'Modifier' : 'Ajouter'} un service</DialogTitle>
        <DialogContent>
          <ServiceForm
            service={selectedService}
            onSuccess={() => handleCloseDialog(true)}
            onCancel={() => handleCloseDialog()}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Etes-vous sur de vouloir supprimer ce service ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Annuler</Button>
          <Button onClick={handleDelete} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServiceList;
