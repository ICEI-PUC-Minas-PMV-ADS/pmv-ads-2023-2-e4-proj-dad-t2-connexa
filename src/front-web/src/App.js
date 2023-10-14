import { React, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Recovery from "./pages/Recovery";
import Home from "./pages/Home";

function App() {
  const [isLogged, setIsLogged] = useState(false);

  const handleLogin = (_isLogged, _isTeacher) => {
    setIsLogged(_isLogged);
  }

  const handleLogout = () => {
    setIsLogged(false);
  }

  return (
    <Router>
      <Routes>
        {!isLogged ?
          <>
            <Route path="/" element={<Login />} /> {/* Rota de Login como página inicial */}
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