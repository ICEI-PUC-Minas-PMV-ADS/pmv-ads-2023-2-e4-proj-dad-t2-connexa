import React, { useState } from "react";
import "./styles.css";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";
import AuthenticationService from "../../services/AuthenticationService";
import LoginDto from "../../services/AuthenticationService/dtos/LoginDto";

function Login({ handleLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authenticationService = new AuthenticationService();

  const handleLoginClick = async () => {
    const loginDto = new LoginDto(email, password);
    const success = await authenticationService.loginAsync(loginDto);
    handleLogin(success);
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2>Login</h2>
        <img src={logo} alt="Logo" className="logo" />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLoginClick}
          className="login-button"
        >
          Entrar
        </button>
        <Link to="/registration">Cadastrar</Link>
        <Link to="/recovery">Recuperar Senha</Link>
      </div>
    </div>
  );
}

export default Login;
