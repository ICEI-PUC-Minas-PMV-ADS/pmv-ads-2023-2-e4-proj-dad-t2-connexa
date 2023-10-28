
export default class CreateOrUpdateUserDto {
    constructor(name, email, password, document, birthdate, secretQuestion, secretAnswer) {
      this.name = name;
      this.email = email;
      this.password = password;
      this.document = document;
      this.birthdate = birthdate;
      this.secretQuestion = secretQuestion;
      this.secretAnswer = secretAnswer;
      console.log("CreateOrUpdateUserDto -> Construtor completo.");
    }

    static CreateDtoToUpdate(email, password, document, secretAnswer){
      return new CreateOrUpdateUserDto('', email, password, document, '0001-01-01', '', secretAnswer);
    }
  }