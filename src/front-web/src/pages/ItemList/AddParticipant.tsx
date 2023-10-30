import React, { useState } from "react";

const AddParticipantButton = (  
    { onClick }: { onClick: (email: string) => void }
) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    // Faça o que você quiser ao clicar em enviar
    onClick(email);
  };

  return (
    <button type="button" onClick={handleSubmit}>
      Adicionar participante
    </button>
  );
};

export default AddParticipantButton;