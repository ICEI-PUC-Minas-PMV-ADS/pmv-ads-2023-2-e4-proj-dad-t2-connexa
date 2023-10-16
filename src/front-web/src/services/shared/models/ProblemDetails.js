/**
 * Esta é uma classe que representa um objeto de erro padronizado com a https://tools.ietf.org/html/rfc7807.
 *
 * @class ProblemDetails
 */
export default class ProblemDetails {
    constructor(type, title, status, detail, instance) {
      this.type = type;
      this.title = title;
      this.status = status;
      this.detail = detail;
      this.instance = instance;
    }
  
    addCustomField(fieldName, value) {
      this[fieldName] = value;
    }
  }