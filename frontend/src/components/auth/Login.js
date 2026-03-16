import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  CircularProgress
} from "@mui/material";

import { Person, Lock } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Login = ({ onLogin }) => {

  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const response = await api.post("/users/login/", credentials);

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      onLogin();

      navigate("/dashboard");

    } catch {

      setError("Nom d'utilisateur ou mot de passe incorrect");

    } finally {

      setLoading(false);

    }
  };

  return (

    <Container maxWidth="sm">

      <Box
        sx={{
          mt: 12,
          display: "flex",
          justifyContent: "center"
        }}
      >

        <Paper elevation={6} sx={{ p: 5, width: "100%", borderRadius: 3 }}>

          <Typography variant="h4" align="center" gutterBottom>
            🏥 Patient Referral System
          </Typography>

          <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
            Connectez-vous à votre compte
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>

            <TextField
              label="Nom d'utilisateur"
              fullWidth
              autoFocus
              margin="normal"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  username: e.target.value
                })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              margin="normal"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value
                })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Se connecter"}
            </Button>

          </form>

        </Paper>

      </Box>

    </Container>
  );
};

export default Login;