import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Recovery from "./pages/Recovery";
import ItemList from "./pages/ItemList/ItemList.tsx"
import Home from "./pages/Home";
import CreateLists from "../src/pages/CreateLists/createcomponent.js";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";

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
    const accessToken = localStorage.getItem('accessToken');
    const isLogged = accessToken != null;
    setIsLogged(isLogged);
  }, []);

  const handleLogin = (accessToken) => {

    if (!accessToken) {
      setIsLogged(false);
      toast.error("Usuário ou senha inválido!");
      return;
    }

    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken["id"];
    const userName = decodedToken["unique_name"];

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);

    setIsLogged(true);
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
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
                <Route path="/CreateLists" element={<CreateLists handleLogout={handleLogout} />} />
                <Route path="list/:idList/itemlist/edit/:titulo/:descricao" element={<ItemList handleLogout={handleLogout} editMode={true}/>} />
                <Route path="list/:idList/itemlist/:titulo/:descricao" element={<ItemList handleLogout={handleLogout} editMode={false}/>} />
              </>
            }
          </Routes>
        </Router>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;