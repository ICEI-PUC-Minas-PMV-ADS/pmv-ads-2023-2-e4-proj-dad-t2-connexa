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
import InputMask from 'react-input-mask';
import logo from "../../img/logo.png";
import AuthenticationService from "../../services/authentication/AuthenticationService";
import CreateOrUpdateUserDto from '../../services/authentication/dtos/CreateOrUpdateUserDto';

function Recovery() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    document: '',
    secretQuestion: '',
    secretAnswer: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [disableInputs, setDisableInputs] = useState(true);

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

  const handleContinueClick = async () => {

    if (!validateEmailFromForm())
      return;

    try {
      const authenticationService = new AuthenticationService();
      const secretQuestionResponse = await authenticationService.getSecretQuestionAsync(formData.email);

      if (!secretQuestionResponse) {
        alert("Usuário não encontrado.");
        return;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        secretQuestion: secretQuestionResponse,
      }));

      setDisableInputs(false);

    } catch (error) {
      console.error('Recovery.handleContinueClick -> Erro ao buscar pergunta secreta:', error);
      alert("Erro ao buscar usuário, tente novamente mais tarde.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.info("Recovery.handleSubmit -> Iniciando recuperação de senha.");

    if (!validateForm())
      return;

    try {
      console.info("Recovery.handleSubmit -> Chamando API para recuperar senha.");

      // email, password, document, secretAnswer
      const updateUserDto = CreateOrUpdateUserDto.CreateDtoToUpdate(
        formData.email,
        formData.newPassword,
        formData.document,
        formData.secretAnswer
      );

      const authenticationService = new AuthenticationService();
      const success = await authenticationService.createUserAsync(updateUserDto);

      console.info("Recovery.handleSubmit -> Resposta da API para recuperar senha.", success);

      if (!success) {
        console.error("Recovery.handleSubmit -> Erro ao recuperar senha.", success);
        alert("Não foi possível recuperar a senha, confira os dados informados e tente novamente.");
        return;
      }

      setErrors({});
      alert("Nova senha criada com sucesso!")
      redirectToLogin();
      return;

    } catch (error) {
      console.error("Recovery.handleSubmit -> Erro ao recuperar senha:", error);
      alert("Não foi possível recuperar a senha, confira os dados informados e tente novamente.");
      return;
    }
  };

  const validateEmailFromForm = () => {
    let errors = {};

    if (!formData.email) {
      errors.email = 'Por favor, insira seu endereço de e-mail.';
    }

    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Endereço de e-mail inválido.';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const validateForm = () => {
    let errors = {};

    if (!formData.email) {
      errors.email = 'Por favor, insira seu endereço de e-mail.';
    }

    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Endereço de e-mail inválido.';
    }

    if (!formData.document) {
      errors.document = 'Por favor, insira seu CPF.';
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
                  onClick={handleContinueClick}
                >
                  Prosseguir
                </Button>
              </Grid>
            }
            {!disableInputs &&
              <>
                <Grid item xs={12}>
                  <InputMask
                    mask="999.999.999-99"
                    maskChar={null}
                    onChange={(e) =>
                      setFormData({ ...formData, document: e.target.value })
                    }
                    disabled={disableInputs}
                    value={formData.document}
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
                    id="secretQuestion"
                    label="Pergunta Secreta"
                    name="secretQuestion"
                    fullWidth
                    multiline
                    maxRows={4}
                    contentEditable={false}
                    value={formData.secretQuestion}
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
