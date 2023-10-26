import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Recovery from "./pages/Recovery";
import Home from "./pages/Home";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function App() {
  const primary = {
    main: '#616161',
    light: '#bdbdbd',
    dark: '#424242',
    contrastText: '#fff',
  };

  const secundary = {
    main: '#455a64',
    light: '#90a4ae',
    dark: '#37474f',
    contrastText: '#fff',
  };

  const defaultTheme = createTheme({
    palette: {
      primary: primary,
      secondary: secundary,
    },
  });

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
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
