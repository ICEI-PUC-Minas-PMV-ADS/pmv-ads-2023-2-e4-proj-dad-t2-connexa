# Plano de Testes de Usabilidade

## 1 . Login e Cadastro:

**Testar Login:**

Preencher os campos de e-mail e senha e verificar se o login é realizado corretamente.
- Testar o redirecionamento para a página correta após o login.
- Testar validações:
- Tentar fazer login sem preencher todos os campos e verificar se são exibidos erros.
- Confirmar se o login não ocorre se as informações fornecidas forem inválidas.

**Testar Cadastro:**

Preencher todos os campos e verificar cadastro.
- Testar alertas em caso de não preenchimento dos campos.
- Testar alerta por email fora dos padrões correstos.
- Verificar se CPF cadastrado é verdadeiro.
- Testar o redirecionamento para a página correta após o cadatsro.

 **Testar Recuperar Senha:**

Preencher todos os campos e verificar se senha está redefinida.
- Testar alertas em caso de não preenchimento dos campos.
- Testar alerta por usuário não existente.
- Validação de mensagem de segurança.
- Testar o redirecionamento para a página correta após o recuperar senha.
 
## 2. Criar Lista:

**Testar a exibição do modal:**

- Verificar se o botão "Criar Lista" abre o modal corretamente.
- Confirmar se os campos de entrada no modal estão visíveis e funcionando.
  
**Testar a criação de lista:**

- Preencher os campos no modal e tentar criar uma lista.
- Verificar se a API é chamada corretamente ao criar uma lista.
- Confirmar se o modal é fechado após a criação bem-sucedida.
  
**Testar validações:** 

- Tentar criar uma lista sem fornecer um nome e verificar se é exibido um alerta.
- Garantir que a API não seja chamada se o nome da lista estiver em branco.

## 3. Itens da Lista:

**Testar a exibição de itens:**

- Verificar se a lista de itens é exibida corretamente.
- Testar o botão "Adicionar Item" para abrir o modal de adição de item.
- Testar a edição e exclusão de itens:
- Tentar editar um item e confirmar se os campos são preenchidos corretamente.
- Verificar se a exclusão de um item remove o item da lista.

## 3. Adicionar Participantes:

**Testar adição de participante:**

- Confirmar se o botão "Adicionar Participante" abre o modal corretamente.
- Verificar se é possível adicionar um participante à lista.
  
**Testar logout:**
- Verificar se o botão de logout encaminha para a página correta após o logout.
- Verificar se o modal é aberto corretamente ao clicar em "Adicionar participante".
- Testar a adição de um participante e verificar as mensagens de sucesso ou erro.


> **Links Úteis**:
> - [Teste De Usabilidade: O Que É e Como Fazer Passo a Passo (neilpatel.com)](https://neilpatel.com/br/blog/teste-de-usabilidade/)
> - [Teste de usabilidade: tudo o que você precisa saber! | by Jon Vieira | Aela.io | Medium](https://medium.com/aela/teste-de-usabilidade-o-que-voc%C3%AA-precisa-saber-39a36343d9a6/)
> - [Planejando testes de usabilidade: o que (e o que não) fazer | iMasters](https://imasters.com.br/design-ux/planejando-testes-de-usabilidade-o-que-e-o-que-nao-fazer/)
> - [Ferramentas de Testes de Usabilidade](https://www.usability.gov/how-to-and-tools/resources/templates.html)
