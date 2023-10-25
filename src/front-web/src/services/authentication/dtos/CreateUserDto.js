
export default class CreateUserDto {
    constructor(name, email, password, document, birthdate, secretQuestion, secretAnswer) {
      this.name = name;
      this.email = email;
      this.password = password;
      this.document = document;
      this.birthdate = birthdate;
      this.secretQuestion = secretQuestion;
      this.secretAnswer = secretAnswer;
    }
  }