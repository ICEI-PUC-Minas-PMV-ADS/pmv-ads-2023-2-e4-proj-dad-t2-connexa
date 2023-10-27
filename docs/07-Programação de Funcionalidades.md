# Programação de Funcionalidades

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Especificação do Projeto</a></span>, <a href="3-Projeto de Interface.md"> Projeto de Interface</a>, <a href="4-Metodologia.md"> Metodologia</a>, <a href="3-Projeto de Interface.md"> Projeto de Interface</a>, <a href="5-Arquitetura da Solução.md"> Arquitetura da Solução</a>

<!-- Implementação do sistema descritas por meio dos requisitos funcionais e/ou não funcionais. Deve relacionar os requisitos atendidos os artefatos criados (código fonte) além das estruturas de dados utilizadas e as instruções para acesso e verificação da implementação que deve estar funcional no ambiente de hospedagem.

Para cada requisito funcional, pode ser entregue um artefato desse tipo -->


## Programação de Funcionalidades

A programação das funcionalidades do sistema foi descrita com base nos requisitos funcionais estabelecidos. A seguir, são apresentados os detalhes da implementação de cada requisito funcional, incluindo as estruturas de dados utilizadas e as instruções para acesso e verificação da implementação. É importante destacar que o sistema está funcional em um ambiente de hospedagem.

### Requisito Funcional (RF-001)

**Descrição:** O sistema permite que o usuário crie uma conta.

**Endpoint:** `POST /users`

**Estruturas de Dados Utilizadas:**

- `CreateOrUpdateUserDto` - Classe que contém informações como nome, e-mail, senha, documento, data de nascimento, pergunta secreta e resposta secreta.

**Instruções para Acesso:**

Para criar uma conta, o usuário deve enviar uma solicitação HTTP POST para o endpoint `/users` com os seguintes dados:

- Nome
- E-mail
- Senha
- Documento (opcional)
- Data de Nascimento
- Pergunta Secreta
- Resposta Secreta

Após o envio da solicitação, o sistema processará os dados e criará a conta do usuário.

### Requisito Funcional (RF-002)

**Descrição:** O sistema permite que o usuário faça login em uma conta.

**Endpoint:** `POST /users/validate`

**Estruturas de Dados Utilizadas:**

- `LoginUserDto` - Classe que contém as credenciais do usuário, incluindo e-mail e senha.

**Instruções para Acesso:**

Para fazer login em uma conta, o usuário deve enviar uma solicitação HTTP POST para o endpoint `/users/validate` com os seguintes dados:

- E-mail
- Senha

O sistema validará as credenciais e concederá acesso à conta se as informações forem corretas.

### Requisito Funcional (RF-003)

**Descrição:** Esta funcionalidade permite que os usuários recuperem o acesso à sua conta em caso de perda de senha. O processo envolve a validação de uma pergunta secreta. Para realizar a recuperação da senha, o usuário deve fornecer seu e-mail e a resposta à pergunta secreta.

**Endpoint:** `GET /users/secret-question`

**Estruturas de Dados Utilizadas:**  Classe `CreateOrUpdateUserDto`


**Descrição:** A classe `CreateOrUpdateUserDto` é usada para criar uma instância de dados para atualizar a senha no banco de dados. Ela contém as informações necessárias, incluindo e-mail, nova senha, documento e resposta à pergunta secreta.

**Método Estático:** `CreateDtoToUpdate(email, password, document, secretAnswer)`

**Parâmetros:**

- `email`: O e-mail associado à conta do usuário.
- `password`: A nova senha desejada.
- `document`: O novo documento (se aplicável).
- `secretAnswer`: A resposta à pergunta secreta para fins de validação.

**Descrição:** Este método estático cria uma instância de `CreateOrUpdateUserDto` com os parâmetros fornecidos. É usado para realizar uma atualização da senha no banco de dados.

**Instruções para Acesso:**

Para recuperar o acesso à conta em caso de perda de senha, o usuário deve seguir as seguintes etapas:

1. Enviar uma solicitação HTTP GET para o endpoint `/users/secret-question` com o parâmetro `email` na URL.
2. O sistema verificará se o e-mail existe no banco de dados.
3. Se o e-mail existir, o sistema retornará a pergunta secreta associada à conta.
4. Se o e-mail não existir, o sistema responderá com "O usuário não existe."

A implementação deste requisito envolve a validação da pergunta secreta para garantir a segurança do processo de recuperação de senha.

O sistema validará as credenciais e concederá a recuperação da senha se as informações forem corretas.

Cada requisito funcional descrito acima atende a uma funcionalidade específica do sistema, fornecendo as informações necessárias para acessar e verificar a implementação. O sistema está plenamente funcional em um ambiente de hospedagem e cumpre os requisitos definidos.


> **Links Úteis**:
>
> - [Trabalhando com HTML5 Local Storage e JSON](https://www.devmedia.com.br/trabalhando-com-html5-local-storage-e-json/29045)
> - [JSON Tutorial](https://www.w3resource.com/JSON)
> - [JSON Data Set Sample](https://opensource.adobe.com/Spry/samples/data_region/JSONDataSetSample.html)
> - [JSON - Introduction (W3Schools)](https://www.w3schools.com/js/js_json_intro.asp)
> - [JSON Tutorial (TutorialsPoint)](https://www.tutorialspoint.com/json/index.htm)