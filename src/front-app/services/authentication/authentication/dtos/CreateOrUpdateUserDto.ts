export default class CreateOrUpdateUserDto {
  name: string;
  email: string;
  password: string;
  document: string;
  birthdate: string;
  secretQuestion: string;
  secretAnswer: string;

  constructor(
    name: string,
    email: string,
    password: string,
    document: string,
    birthdate: string,
    secretQuestion: string,
    secretAnswer: string
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.document = document;
    this.birthdate = birthdate;
    this.secretQuestion = secretQuestion;
    this.secretAnswer = secretAnswer;
    console.log("CreateOrUpdateUserDto -> Construtor completo.");
  }

  static CreateDtoToUpdate(
    email: string,
    password: string,
    document: string,
    secretAnswer: string
  ) {
    return new CreateOrUpdateUserDto(
      '',
      email,
      password,
      document,
      '0001-01-01',
      '',
      secretAnswer
    );
  }
}
