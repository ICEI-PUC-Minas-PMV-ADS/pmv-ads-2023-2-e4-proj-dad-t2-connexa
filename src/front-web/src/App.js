import { React, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Recovery from "./pages/Recovery";
import Home from "./pages/Home";
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  // TODO remove, this demo shouldn't need to reset the theme.
  const defaultTheme = createTheme();

  const [isLogged, setIsLogged] = useState(false);

  const handleLogin = (isLogged) => {
    setIsLogged(isLogged);

    if (!isLogged)
      alert("Usuário ou senha inválido!")
  }

  const handleLogout = () => {
    setIsLogged(false);
  }

  return (
    <Router>
      <Routes>
        {!isLogged ?
          <>
            <Route path="/" element={<Login defaultTheme={defaultTheme} handleLogin={handleLogin} />} /> {/* Rota de Login como página inicial */}
            <Route path="/registration" element={<Registration />} />
            <Route path="/recovery" element={<Recovery />} />
          </>
          :
          <>
            <Route path="/" element={<Home />} />
          </>
        }
      </Routes>
    </Router>
  );
}
export default App;