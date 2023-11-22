import { differenceInYears } from "date-fns";

const MIN_AGE_IN_YEARS = 12;

export const emailValidator = (email: string) => {
  const regex = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Por favor, insira seu endereço de e-mail.';
  if (!regex.test(email)) return 'Endereço de e-mail inválido.';

  return '';
};

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) return 'Por favor, insira sua senha.';

  return '';
};

export const passwordConfirmValidator = (password: string, confirmPassword: string) => {
  if (password !== confirmPassword) return 'As senhas não coincidem.';

  return '';
};

export const nameValidator = (name: string) => {
  if (!name || name.length <= 0) return 'Por favor, insira seu nome completo.';

  return '';
};

export const secretAnswerValidator = (secretAnswer: string) => {
  if (!secretAnswer || secretAnswer.length <= 0) return 'Por favor, insira sua resposta secreta.';

  return '';
};

export const secretQuestionValidator = (secretQuestion: string) => {
  if (!secretQuestion || secretQuestion.length <= 0) return 'Selecione uma pergunta secreta.';

  return '';
};

export const documentValidator = (document: string) => {
  if (!document || document.length <= 0) return 'Por favor, insira seu CPF.';

  if (!isValidCpf(document)) return 'CPF inválido.';

  return '';
};

export const birthdateValidator = (birthdate: Date) => {
  if (!birthdate) return 'Por favor, insira a data de nascimento.';
  if (validateAge(birthdate)) return `Idade mínima para uso: ${MIN_AGE_IN_YEARS} anos.`;

  return '';
};

const isValidCpf = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf === '') return false;

  // Eliminate known invalid CPFs
  if (
    cpf.length !== 11 ||
    cpf === "00000000000" ||
    cpf === "11111111111" ||
    cpf === "22222222222" ||
    cpf === "33333333333" ||
    cpf === "44444444444" ||
    cpf === "55555555555" ||
    cpf === "66666666666" ||
    cpf === "77777777777" ||
    cpf === "88888888888" ||
    cpf === "99999999999"
  ) {
    return false;
  }

  // Validate 1st digit
  let add = 0;
  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== parseInt(cpf.charAt(9))) {
    return false;
  }

  // Validate 2nd digit
  add = 0;
  for (let i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

const validateAge = (dateToCompare: Date) => {
  const currentDate = new Date();
  const yearsDifference = differenceInYears(currentDate, dateToCompare);
  return yearsDifference >= MIN_AGE_IN_YEARS;
}