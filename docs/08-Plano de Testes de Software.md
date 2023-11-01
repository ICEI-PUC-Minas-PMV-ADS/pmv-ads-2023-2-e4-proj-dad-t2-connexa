# Plano de Testes de Software

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Especificação do Projeto</a></span>, <a href="3-Projeto de Interface.md"> Projeto de Interface</a>

Testes unitários realizados e foram seguidos os seguintes passos para aplicação dos testes e verificação das funcionalidades.

**Cenário de Teste 1** - Login Bem-sucedido e mal-sucedido, criação de novo login:

Objetivo: Verificar se um usuário registrado pode fazer login com sucesso ou criar nova conta.
Passos:
Acesse a página de login.
Insira um nome de usuário e senha válidos e inválidos.
Resultado Esperado: O usuário é redirecionado para a página inicial após o login bem-sucedido e alerta de erro quando login mal sucedido.

**Cenário de Teste 2** - Obter Todas as Listas:

Objetivo: Verificar se a API retorna todas as listas.
Passos:
Faça uma solicitação GET para a rota "/lists".
Verifique a resposta para garantir que o código de status seja 200 (OK).
Verifique se a resposta contém uma lista de listas.

**Cenário de Teste 3** - Criar uma Nova Lista e Permissoes para tal:

Objetivo: Verificar se a API permite criar uma nova lista e se as permissões de criação estão válidas.
Passos:
Faça uma solicitação POST para a rota "/lists" com os dados da nova lista.
Verifique a resposta para garantir que o código de status seja 200 (OK) ou 201 (Created).
Verifique se a nova lista foi adicionada corretamente.

**Cenário de Teste 4** - Obter Listas Relacionadas a um Usuário:

Objetivo: Verificar se a API retorna listas relacionadas a um usuário específico.
Passos:
Faça uma solicitação GET para a rota "/lists/relateds/{idUser}" com o ID do usuário.
Verifique a resposta para garantir que o código de status seja 200 (OK).
Verifique se a resposta contém as listas relacionadas ao usuário.

**Cenário de Teste 5** - Excluir uma Lista e permissões para tal:

Objetivo: Verificar se a API permite excluir uma lista e se a verificação de permissões para tal feito está em pleno funcionamento.
Passos:
Faça uma solicitação DELETE para a rota "/lists/{idList}" com o ID da lista a ser excluída.
Verifique a resposta para garantir que o código de status seja 200 (OK) ou 204 (No Content).
Verifique se a lista foi excluída corretamente.

# Plano de Testes de Unidade - API Autenticação

## Cenário de Teste 1 - Buscar Usuário por Email
**Objetivo:** Validar o retorno do endpoint.
**Passos:**
- Realizar a chamada da API.
- Verificar a resposta para garantir que o código de status seja 200 (OK).

## Cenário de Teste 2 - Cadastrar Usuário com Sucesso
**Objetivo:** Validar o retorno do endpoint.
**Passos:**
- Realizar a chamada da API.
- Verificar a resposta para garantir que o código de status seja 201 (Created).

## Cenário de Teste 3 - Erro ao Cadastrar Usuário
**Objetivo:** Validar o retorno do endpoint.
**Passos:**
- Realizar a chamada da API.
- Simular erro ao cadastrar usuário.
- Verificar a resposta para garantir que o código de status seja 400 (Bad Request).

## Cenário de Teste 4 - Excluir Usuário
**Objetivo:** Validar o retorno do endpoint.
**Passos:**
- Realizar a chamada da API.
- Verificar a resposta para garantir que o código de status seja 204 (NoContent).

## Cenário de Teste 5 - Erro ao Excluir Usuário
**Objetivo:** Validar o retorno do endpoint.
**Passos:**
- Realizar a chamada da API.
- Simular erro ao excluir usuário.
- Verificar a resposta para garantir que o código de status seja 400 (Bad Request).

## Cenário de Teste 6 - Validar Email
**Objetivo:** Validar o retorno do endpoint.
**Passos:**
- Realizar a chamada da API.
- Verificar a resposta para garantir que o código de status seja 200 (OK).

## Cenário de Teste 7 - Erro ao Validar Usuário
**Objetivo:** Validar o retorno do endpoint.
**Passos:**
- Realizar a chamada da API.
- Simular erro na validação do usuário.
- Verificar a resposta para garantir que o código de status seja 400 (Bad Request).

## Cenário de Teste 8 - Validar CPF com Sucesso
**Objetivo:** Validar o retorno do endpoint de validação de CPF.
**Passos:**
- Realizar a chamada da API de validação de CPF.
- Enviar um CPF válido como parâmetro.
- Verificar a resposta para garantir que o código de status seja 200 (OK).
- Verificar se a resposta indica que o CPF é válido.

## Cenário de Teste 9 - Erro ao Validar CPF
**Objetivo:** Validar o retorno do endpoint de validação de CPF.
**Passos:**
- Realizar a chamada da API de validação de CPF.
- Enviar um CPF inválido como parâmetro.
- Verificar a resposta para garantir que o código de status seja 400 (Bad Request).
- Verificar se a resposta indica que o CPF é inválido.

## Cenário de Teste 10 - Validar E-mail Adicional
**Objetivo:** Validar o retorno do endpoint de validação de e-mail.
**Passos:**
- Realizar a chamada da API de validação de e-mail.
- Enviar um e-mail válido como parâmetro.
- Verificar a resposta para garantir que o código de status seja 200 (OK).
- Verificar se a resposta indica que o e-mail é válido.

## Cenário de Teste 11 - Erro ao Validar E-mail
**Objetivo:** Validar o retorno do endpoint de validação de e-mail.
**Passos:**
- Realizar a chamada da API de validação de e-mail.
- Enviar um e-mail inválido como parâmetro.
- Verificar a resposta para garantir que o código de status seja 400 (Bad Request).
- Verificar se a resposta indica que o e-mail é inválido.

# Plano de Testes de Unidade para a API List


## Cenário de Teste 1 - Buscar Listas
**Objetivo:** Verificar se o endpoint /lists retorna uma lista de listas.
**Passos:**
- Realizar uma chamada ao endpoint /lists.
- Verificar se a resposta possui um código de status 200 (OK).
- Verificar se a resposta contém uma lista de listas válida.
- 
## Cenário de Teste 2 - Criar Lista
**Objetivo:**  Verificar se o endpoint /lists cria uma nova lista com sucesso.
**Passos:**
- Realizar uma chamada ao endpoint /lists com dados válidos para criar uma nova lista.
- Verificar se a resposta possui um código de status 201 (Created).

## Cenário de Teste 3 - Erro ao Criar Lista
**Objetivo:** Verificar se o endpoint /lists retorna um erro ao tentar criar uma lista com dados inválidos.
**Passos:**
- Realizar uma chamada ao endpoint /lists com dados inválidos para criar uma nova lista.
- Verificar se a resposta possui um código de status 400 (Bad Request).

## Cenário de Teste 4 - Excluir Lista
**Objetivo:** Verificar se o endpoint /lists/{idList} exclui uma lista com sucesso.
**Passos:**
- Realizar uma chamada ao endpoint /lists/{idList} com um ID de lista válido para excluí-la.
- Verificar se a resposta possui um código de status 204 (No Content).

## Cenário de Teste 5 - Erro ao Excluir Lista
**Objetivo:** Verificar se o endpoint /lists/{idList} retorna um erro ao tentar excluir uma lista inexistente.
**Passos:**
- Realizar uma chamada ao endpoint /lists/{idList} com um ID de lista inválido.
- Verificar se a resposta possui um código de status 404 (Not Found).

## Cenário de Teste 6 - Adicionar Membro a uma Lista
**Objetivo:** Verificar se o endpoint /member/{listMember} adiciona um membro a uma lista com sucesso.
**Passos:**
- Realizar uma chamada ao endpoint /member/{listMember} com dados válidos para adicionar um membro a uma lista.
- Verificar se a resposta possui um código de status 200 (OK).

## Cenário de Teste 7 - Erro ao Adicionar Membro a uma Lista
**Objetivo:** Verificar se o endpoint /member/{listMember} retorna um erro ao tentar adicionar um membro a uma lista inexistente.
**Passos:**
- Realizar uma chamada ao endpoint /member/{listMember} com dados inválidos.
- Verificar se a resposta possui um código de status 404 (Not Found).


## Ferramentas de Testes

- [FluentAssertions](https://fluentassertions.com/): facilita a leitura e elaboração dos *asserts*.
  - Nuget: https://www.nuget.org/packages/FluentAssertions
- [FluentAssertions.Web](https://github.com/adrianiftode/FluentAssertions.Web): facilita a leitura e elaboração dos *asserts* em requisições HTTP.
  - Nuget: https://www.nuget.org/packages/FluentAssertions.Web
- [FakeItEasy](https://fakeiteasy.github.io/): é um *framework* para criação de todos os tipos de *fake objects*, *mocks*, *stubs* etc.
  - Nuget: https://www.nuget.org/packages/FakeItEasy

<!-- Comente sobre as ferramentas de testes utilizadas.
 
> **Links Úteis**:
> - [IBM - Criação e Geração de Planos de Teste](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Práticas e Técnicas de Testes Ágeis](http://assiste.serpro.gov.br/serproagil/Apresenta/slides.pdf)
> -  [Teste de Software: Conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/)
> - [Criação e Geração de Planos de Teste de Software](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Ferramentas de Test para Java Script](https://geekflare.com/javascript-unit-testing/)
> - [UX Tools](https://uxdesign.cc/ux-user-research-and-user-testing-tools-2d339d379dc7) -->
