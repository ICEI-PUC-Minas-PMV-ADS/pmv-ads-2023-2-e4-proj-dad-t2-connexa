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

## Ferramentas de Testes (Opcional)

Comente sobre as ferramentas de testes utilizadas.
 
> **Links Úteis**:
> - [IBM - Criação e Geração de Planos de Teste](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Práticas e Técnicas de Testes Ágeis](http://assiste.serpro.gov.br/serproagil/Apresenta/slides.pdf)
> -  [Teste de Software: Conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/)
> - [Criação e Geração de Planos de Teste de Software](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Ferramentas de Test para Java Script](https://geekflare.com/javascript-unit-testing/)
> - [UX Tools](https://uxdesign.cc/ux-user-research-and-user-testing-tools-2d339d379dc7)
