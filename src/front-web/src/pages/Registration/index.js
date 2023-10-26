import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import logo from '../../img/logo.png';
import AuthenticationService from '../../services/authentication/AuthenticationService';
import CreateOrUpdateUserDto from '../../services/authentication/dtos/CreateOrUpdateUserDto';
import InputMask from 'react-input-mask';

const secretQuestions = [
  'Qual é o nome do seu primeiro animal de estimação?',
  'Qual é o nome da sua mãe?',
  'Qual é o nome da sua cidade natal?',
  'Qual é o seu prato de comida favorito?',
  'Qual é o nome do seu melhor amigo de infância?',
  'Qual é a sua cor favorita?',
  'Qual é o seu filme favorito?',
  'Qual é a data de aniversário da sua avó?',
  'Qual é o nome do seu professor favorito?',
  'Qual é o modelo do seu primeiro carro?',
];

function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretAnswer: '',
    secretQuestion: '',
    birthdate: '',
    document: '',
  });

  const navigate = useNavigate();

  const redirectToLogin = () => {
    console.info('Cadastro.redirectToLogin -> Redirecionando para a tela de login.');
    navigate('/');
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.info('Cadastro.handleSubmit -> Iniciando processo de cadastro.');

    if (!validateForm()) return;

    try {
      const createUserDto = new CreateOrUpdateUserDto(
        formData.name,
        formData.email,
        formData.password,
        formData.document,
        formData.birthdate,
        formData.secretQuestion,
        formData.secretAnswer
      );

      const authService = new AuthenticationService();
      const success = await authService.createUserAsync(createUserDto);

      console.info('Cadastro.handleSubmit -> Resposta da API de cadastro de usuário:', success);

      if (success) {
        setErrors({});
        alert('Cadastro realizado com sucesso!');
        redirectToLogin();
        return;
      }

      console.error('Cadastro.handleSubmit -> Erro no processo de cadastro.');

      setErrors({ registrationError: 'Ocorreu um erro no processo de cadastro, tente novamente mais tarde.' });
      return;
    } catch (error) {
      console.error('Cadastro.handleSubmit -> Erro no processo de cadastro:', error);
      setErrors({ registrationError: 'Ocorreu um erro no processo de cadastro, tente novamente mais tarde.' });
      return;
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.name) {
      errors.name = 'Por favor, insira seu nome completo.';
    }

    if (!formData.email) {
      errors.email = 'Por favor, insira seu endereço de e-mail.';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Endereço de e-mail inválido.';
    }

    if (!formData.password) {
      errors.password = 'Por favor, insira sua senha.';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem.';
    }

    if (!formData.secretAnswer) {
      errors.secretAnswer = 'Por favor, insira sua resposta secreta.';
    }

    if (!formData.secretQuestion) {
      errors.secretQuestion = 'Selecione uma pergunta secreta.';
    }

    if (!formData.document) {
      errors.document = 'Por favor, insira seu documento (CPF, RG, etc.).';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box>
          <img src={logo} alt="Logo" className="logo" height={200} />
        </Box>
        <Typography component="h1" variant="h5">
          Cadastrar
        </Typography>
        <form noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                label="Nome Completo"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="email"
                name="email"
                required
                fullWidth
                id="email"
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <InputMask
                mask="999.999.999-99"
                maskChar=""
                value={formData.document}
                onChange={(e) =>
                  setFormData({ ...formData, document: e.target.value })
                }
              >
                {() => (
                  <TextField
                    required
                    fullWidth
                    id="document"
                    label="CPF"
                    name="document"
                    error={!!errors.document}
                    helperText={errors.document}
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="password"
                label="Senha"
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
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="confirmPassword"
                label="Confirmar Senha"
                name="confirmPassword"
                autoComplete="new-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="secretQuestion"
                label="Pergunta Secreta"
                name="secretQuestion"
                select
                value={formData.secretQuestion}
                onChange={(e) =>
                  setFormData({ ...formData, secretQuestion: e.target.value })
                }
                error={!!errors.secretQuestion}
                helperText={errors.secretQuestion}
              >
                <MenuItem value="" disabled>
                  Selecione uma pergunta secreta
                </MenuItem>
                {secretQuestions.map((question, index) => (
                  <MenuItem key={index} value={question}>
                    {question}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="secretAnswer"
                label="Resposta Secreta"
                name="secretAnswer"
                value={formData.secretAnswer}
                onChange={(e) =>
                  setFormData({ ...formData, secretAnswer: e.target.value })
                }
                error={!!errors.secretAnswer}
                helperText={errors.secretAnswer}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={(e) =>
                  setFormData({ ...formData, birthdate: e.target.value })
                }
                error={!!errors.birthdate}
                helperText={errors.birthdate}
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Cadastrar
          </Button>
        </form>
        <Grid container>
          <Grid item xs={12}>
            <Link to="/" style={{ float: 'right' }}>
              Já tem uma conta? Entrar
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Registration;
