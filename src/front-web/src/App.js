import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Recovery from "./pages/Recovery";
import Home from "./pages/Home";
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  const defaultTheme = createTheme();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const isLoggedString = localStorage.getItem('isLogged');
    const isLogged = isLoggedString === "true";
    localStorage.getItem('rememberUser');

    setIsLogged(isLogged);
  }, []);

  const handleLogin = (isLogged) => {
    if (isLogged) {
      localStorage.setItem('isLogged', 'true');
    } else {
      alert("Usuário ou senha inválido!");
    }
    setIsLogged(isLogged);
  }

  const handleLogout = () => {
    localStorage.removeItem('isLogged');
    setIsLogged(false);
  }

  return (
    <Router>
      <Routes>
        {!isLogged ?
          <>
            <Route path="/" element={<Login defaultTheme={defaultTheme} handleLogin={handleLogin} />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/recovery" element={<Recovery />} />
          </>
          :
          <>
            <Route path="/" element={<Home handleLogout={handleLogout} />} />
          </>
        }
      </Routes>
    </Router>
  );
}

export default App;
