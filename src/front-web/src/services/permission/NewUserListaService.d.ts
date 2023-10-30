declare module 'NewUserListaService' {
  class NewUserListaService {
    addUserLista(newUserListaDTO: any): Promise<any>;
    buildNewUserListaDTO(userEmail: string, listaId: number): Promise<any>;
  }

  export default NewUserListaService;
}