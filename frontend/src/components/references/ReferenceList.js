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
  Alert
} from '@mui/material';
import { Add, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ReferenceList = () => {
  const [references, setReferences] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReferences();
  }, []);

  useEffect(() => {
    if (Array.isArray(references)) {
      const term = search.toLowerCase();
      const results = references.filter(r => {
        const patient = (r.patient_name || '').toLowerCase();
        const hospital = (r.hospital_destination_name || '').toLowerCase();
        const service = (r.service_name || '').toLowerCase();
        return patient.includes(term) || hospital.includes(term) || service.includes(term);
      });
      setFiltered(results);
    } else {
      setFiltered([]);
    }
  }, [search, references]);

  const fetchReferences = async () => {
    try {
      const response = await api.get('/references/');
      // On extrait le tableau 'results' si la pagination est activée
      const data = response.data.results || response.data;
      setReferences(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur chargement references');
      setReferences([]); // Sécurité : on remet à vide en cas d'erreur
    }
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">References</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/references/nouvelle')}
        >
          Nouvelle reference
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Rechercher une reference"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Hopital cible</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.patient_name}</TableCell>
                <TableCell>{r.service_name}</TableCell>
                <TableCell>{r.hospital_destination_name}</TableCell>
                <TableCell>
                  <Chip
                    label={r.status}
                    color={r.status === 'rejected' ? 'error' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(r.date_reference).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => navigate(`/references/${r.id}`)}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ReferenceList;
