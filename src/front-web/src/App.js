import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Rota de Login como página inicial */}
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </Router>
  );
}
export default App;