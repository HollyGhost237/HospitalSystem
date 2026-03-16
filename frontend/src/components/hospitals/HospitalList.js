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
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  LocationOn
} from '@mui/icons-material';
import api from '../../services/api';
import HospitalForm from './HospitalForm';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

    useEffect(() => {
    if (Array.isArray(hospitals)) {
        const filteredResults = hospitals.filter(h =>
        h.name?.toLowerCase().includes(search.toLowerCase()) ||
        h.address?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(filteredResults);
    } else {
        setFiltered([]); // Sécurité : on remet à zéro si ce n'est pas un tableau
    }
    }, [search, hospitals]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals/');
      // On extrait 'results' pour la pagination, sinon on prend data
      const data = response.data.results || response.data;
      setHospitals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur chargement hôpitaux');
      setHospitals([]); // Sécurité
    }
  };

  const handleOpenDialog = (hospital = null) => {
    setSelectedHospital(hospital);
    setOpenDialog(true);
  };

  const handleCloseDialog = (refresh = false) => {
    setOpenDialog(false);
    setSelectedHospital(null);
    if (refresh) fetchHospitals();
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/hospitals/${deleteDialog.id}/`);
      setDeleteDialog({ open: false, id: null });
      fetchHospitals();
    } catch (err) {
      setError('Erreur suppression');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Hôpitaux</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nouvel hôpital
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Rechercher un hôpital"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Localisation</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((h) => (
              <TableRow key={h.id}>
                <TableCell>{h.name}</TableCell>
                <TableCell>{h.address}</TableCell>
                <TableCell>{h.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={h.type}
                    color={h.type === 'PUBLIC' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {h.latitude && h.longitude ? (
                    <IconButton
                      size="small"
                      onClick={() => window.open(`https://maps.google.com/?q=${h.latitude},${h.longitude}`)}
                    >
                      <LocationOn />
                    </IconButton>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(h)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => setDeleteDialog({ open: true, id: h.id })}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogue d'ajout/édition */}
      <Dialog open={openDialog} onClose={() => handleCloseDialog()} maxWidth="md" fullWidth>
        <DialogTitle>{selectedHospital ? 'Modifier' : 'Ajouter'} un hôpital</DialogTitle>
        <DialogContent>
          <HospitalForm
            hospital={selectedHospital}
            onSuccess={() => handleCloseDialog(true)}
            onCancel={() => handleCloseDialog()}
          />
        </DialogContent>
      </Dialog>

      {/* Dialogue confirmation suppression */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cet hôpital ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Annuler</Button>
          <Button onClick={handleDelete} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HospitalList;
