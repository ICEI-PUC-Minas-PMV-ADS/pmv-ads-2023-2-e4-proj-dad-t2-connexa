import React, { useState } from "react";
import "./Login.css";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const handleLogin = () => {
    setIsClicked(true);
    // Implementar a lógica de autenticação aqui
    setTimeout(() => {
      setIsClicked(false);
    }, 500);
  };
  
  return (
    <div className="Login">
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
          onClick={handleLogin}
          className={`login-button ${isClicked ? "clicked" : ""}`}
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
