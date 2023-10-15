import React, { useState } from "react";
import logo from "../../img/logo.png";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthenticationService from "../../services/authentication/AuthenticationService";
import CreateUserDto from "../../services/authentication/dtos/CreateUserDto";
import { useNavigate } from 'react-router-dom';

function Recovery(defaultTheme) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    password: '',
  });

  
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }; 
  const validateForm = () => {
    let errors = {};

    if (!formData.fullName) {
      errors.fullName = 'Por favor, insira seu nome.';
    }

    if (!formData.email) {
      errors.email = 'Por favor, insira seu endereço de e-mail.';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Endereço de e-mail inválido.';
    }

    if (!formData.password) {
      errors.password = 'Por favor, insira sua senha.';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
  
        const createUserDto = new CreateUserDto(
          formData.fullName,
          formData.email,
          formData.password
        );
        const authenticationService = new AuthenticationService();
        const response = await authenticationService.createUserAsync(createUserDto);

        if (response.success) {
          setErrors({});
          redirectToLogin();
        } else {
          setErrors({ createUser: response.error || "Ocorreu um erro ao salvar o usuário, tente novamente mais tarde." });
        }
      } catch (error) {
        console.error("Erro ao criar o usuário:", error);
        setErrors({ createUser: "Ocorreu um erro ao salvar o usuário, tente novamente mais tarde." });
      }
    }
  };
  const redirectToLogin = () => {
    navigate("/");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box>
            <img src={logo} alt="Logo" className="logo" height={200} />
          </Box>
          <Typography component="h1" variant="h5">
            Recuperar Senha
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="fullName"
                  required
                  fullWidth
                  id="fullName"
                  label="Nome Completo"
                  autoFocus
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="Nova Senha"
                  name="password"
                  autoComplete="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Recadastrar Senha
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Lembrou da senha? Entrar
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
export default Recovery;


