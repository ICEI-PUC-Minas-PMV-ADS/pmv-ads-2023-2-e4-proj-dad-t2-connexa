import React, { useState } from 'react';
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
import logo from "../../img/logo.png";
import AuthenticationService from "../../services/authentication/AuthenticationService";
import CreateUserDto from '../../services/authentication/dtos/CreateUserDto';

function Recovery() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    cpf: '',
    secretQuestion: '',
    secretAnswer: '',
    newPassword: '',
    confirmPassword: '',
    document: '',
  });

  const [disableInputs, setDisableInputs] = useState(true);
  const [secretQuestion, setSecretQuestion] = useState('');

  const navigate = useNavigate();

  const redirectToLogin = () => {
    console.info("Recovery.redirectToLogin -> Redirecionando para a tela de login.");
    navigate("/");
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const fetchEmailAndSecretQuestion = async (email) => {
    try {
      if (validateEmail(email)) {
        const authenticationService = new AuthenticationService();
        const emailResponse = await authenticationService.getEmailAsync(email);

        if (emailResponse) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            email: emailResponse.email,
          }));
          fetchSecretQuestion(emailResponse.email);
          setErrors({});
        } else {
          setFormData((prevFormData) => ({
            ...prevFormData,
          }));
          setErrors({ email: 'Email não encontrado' });
        }
      } else {
        setErrors({ email: 'Endereço de e-mail inválido' });
      }
    } catch (error) {
      console.error('Erro ao buscar email:', error);
      setFormData((prevFormData) => ({
        ...prevFormData,
      }));
      setErrors({ email: 'Erro ao buscar email' });
    }
  };

  const fetchSecretQuestion = async (email) => {
    try {
      const authenticationService = new AuthenticationService();
      const secretQuestionResponse = await authenticationService.getSecretQuestion(email);

      if (secretQuestionResponse) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          secretQuestion: secretQuestionResponse.secretQuestion,
        }));
        setErrors({});
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          secretQuestion: 'Pergunta secreta não encontrada',
        }));
        setErrors({ secretQuestion: 'Pergunta secreta não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao buscar pergunta secreta:', error);
      setFormData((prevFormData) => ({
        ...prevFormData,
        secretQuestion: 'Erro ao buscar pergunta secreta',
      }));
      setErrors({ secretQuestion: 'Erro ao buscar pergunta secreta' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.info("Recovery.handleSubmit -> Iniciando recuperação de senha.");

    if (!validateForm())
      return;

    try {
      console.info("Recovery.handleSubmit -> Chamando API para recuperar senha.");

      const createUserDto = new CreateUserDto(
        formData.email,
        formData.newPassword,
        formData.document,
        formData.secretQuestion,
        formData.secretAnswer,
      );

      const authenticationService = new AuthenticationService();
      const success = await authenticationService.recoverPasswordAsync(createUserDto);

      console.info("Recovery.handleSubmit -> Resposta da API para recuperar senha.", success);

      if (success) {
        setErrors({});
        alert("Nova senha criada com sucesso!")
        redirectToLogin();
        return;
      }

      console.error("Recovery.handleSubmit -> Erro ao recuperar senha.");

      setErrors({ recoveryError: "Ocorreu um erro ao recuperar a senha, tente novamente mais tarde." });
    } catch (error) {
      console.error("Recovery.handleSubmit -> Erro ao recuperar senha:", error);
      setErrors({ recoveryError: "Ocorreu um erro ao recuperar a senha, tente novamente mais tarde." });
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.email) {
      errors.email = 'Por favor, insira seu endereço de e-mail.';
    }

    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Endereço de e-mail inválido.';
    }

    if (!formData.cpf) {
      errors.cpf = 'Por favor, insira seu CPF.';
    }

    if (!formData.secretAnswer) {
      errors.secretAnswer = 'Por favor, insira sua resposta secreta.';
    }

    if (!formData.newPassword) {
      errors.newPassword = 'Por favor, insira sua nova senha.';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem.';
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
          Recuperar Senha
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
          {formData.secretQuestion}
        </Typography>
        <form noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
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
            {disableInputs &&
              <Grid item xs={12}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={!disableInputs}
                >
                  Prosseguir
                </Button>
              </Grid>
            }
            {!disableInputs &&
              <>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="cpf"
                    label="CPF"
                    name="cpf"
                    disabled={disableInputs}
                    value={formData.cpf}
                    onChange={(e) =>
                      setFormData({ ...formData, cpf: e.target.value })
                    }
                    error={!!errors.cpf}
                    helperText={errors.cpf}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="secretQuestion"
                    label="Pergunta Secreta"
                    name="secretQuestion"
                    disabled={true}
                    value={secretQuestion}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="secretAnswer"
                    label="Resposta Secreta"
                    name="secretAnswer"
                    disabled={disableInputs}
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
                    id="newPassword"
                    label="Nova Senha"
                    name="newPassword"
                    autoComplete="new-password"
                    type={showPassword ? 'text' : 'password'}
                    disabled={disableInputs}
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
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
                    disabled={disableInputs}
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
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    disabled={disableInputs}
                  >
                    Recadastrar Senha
                  </Button>
                </Grid>
              </>
            }
          </Grid>
        </form>
        <Grid container>
          <Grid item xs={12} mt={1}>
            <Link to="/" style={{ float: 'right' }}>
              Lembrou sua senha? Entrar
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Recovery;