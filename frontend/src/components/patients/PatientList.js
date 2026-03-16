import React, { useEffect, useState, useMemo } from 'react';
import { CircularProgress } from '@mui/material';
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
  Typography,
  TextField,
  Box,
  IconButton,
  Chip
} from '@mui/material';
import {
  Add,
  Visibility,
  Edit
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await api.get('/patients/');
      // On récupère le tableau 'results' pour la pagination
      const data = response.data.results || response.data;
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement patients:', error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = useMemo(() => {
    if (!Array.isArray(patients)) return [];
    
    const term = search.toLowerCase();
    return patients.filter(p => {
      const fullName = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase();
      const phone = (p.phone || '').toLowerCase();
      return fullName.includes(term) || phone.includes(term);
    });
  }, [patients, search]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Patients</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/patients/nouveau')}
        >
          Nouveau patient
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Rechercher un patient"
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
              <TableCell>Prenom</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Sexe</TableCell>
              <TableCell>Telephone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.last_name}</TableCell>
                  <TableCell>{patient.first_name}</TableCell>
                  <TableCell>{patient.age ? `${patient.age} ans` : '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={patient.gender}
                      color={patient.gender === 'M' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => navigate(`/patients/${patient.id}/edit`)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PatientList;
