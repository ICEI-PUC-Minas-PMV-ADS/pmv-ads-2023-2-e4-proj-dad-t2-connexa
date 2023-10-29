import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";

const App = () => {
  const [email, setEmail] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleClick = () => {
    setIsPopupOpen(true);
  };

  const handleSubmit = async () => {
    const response = await fetch("https://api.example.com/participants", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (response.status === 200) {
      setIsPopupOpen(false);
      setEmail("");
      alert("Participante adicionado a lista");
    } else {
      alert("Participante não encontrado");
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Adicionar participante</button>
      <Popup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        width={400}
        height={200}
      >
        <h2>Adicionar participante</h2>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSubmit}>Enviar</button>
        <button onClick={() => setIsPopupOpen(false)}>Fechar</button>
      </Popup>
    </div>
  );
};

export default App;