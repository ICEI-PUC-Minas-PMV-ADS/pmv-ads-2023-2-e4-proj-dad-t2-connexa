import React, { useState } from "react";
import "./Registration.css";
import { Link } from "react-router-dom";
import backArrowIcon from "./icon/icon-back.png";
import TextField from '@mui/material/TextField';

function Registration() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsClicked(true);
    // Implementar a lógica de autenticação aqui
    setTimeout(() => {
      setIsClicked(false);
    }, 500);
    // Implemente a lógica de envio do formulário 
  };

  return (
    <div className="Registration">
      <h2>Cadastrar</h2>
      <Link to="/" className="back-button">
        <img src={backArrowIcon} alt="Seta de Retorno" className="back-icon" />
        Voltar para o Login
      </Link>
      <form onSubmit={handleSubmit}>
        <div className="registration-container">
          <div>
            <label>Nome Completo:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label>Data de nascimento:</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`registration-button ${isClicked ? "clicked" : ""}`}
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Registration;

