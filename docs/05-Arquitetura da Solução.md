# Arquitetura da Solução

<span style="color:red">Pré-requisitos: <a href="3-Projeto de Interface.md"> Projeto de Interface</a></span>

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![image](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2023-2-e4-proj-dad-t2-connexa/assets/16859514/b6fafd7a-4148-41c7-a73d-bb8a0b4ee37c)

## Diagrama de Classes

O diagrama de classes ilustra graficamente como será a estrutura do software, e como cada uma das classes da sua estrutura estarão interligadas. Essas classes servem de modelo para materializar os objetos que executarão na memória.

As referências abaixo irão auxiliá-lo na geração do artefato “Diagrama de Classes”.

> - [Diagramas de Classes - Documentação da IBM](https://www.ibm.com/docs/pt-br/rational-soft-arch/9.6.1?topic=diagrams-class)
> - [O que é um diagrama de classe UML? | Lucidchart](https://www.lucidchart.com/pages/pt/o-que-e-diagrama-de-classe-uml)

## Modelo ER
<!--
O Modelo ER representa através de um diagrama como as entidades (coisas, objetos) se relacionam entre si na aplicação interativa.]

As referências abaixo irão auxiliá-lo na geração do artefato “Modelo ER”.

> - [Como fazer um diagrama entidade relacionamento | Lucidchart](https://www.lucidchart.com/pages/pt/como-fazer-um-diagrama-entidade-relacionamento)
-->

![image](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2023-2-e4-proj-dad-t2-connexa/assets/16859514/d7b165e3-601e-4db2-8c20-e1426b1781e3)

## Esquema Relacional

O Esquema Relacional corresponde à representação dos dados em tabelas juntamente com as restrições de integridade e chave primária.
 
As referências abaixo irão auxiliá-lo na geração do artefato “Esquema Relacional”.

> - [Criando um modelo relacional - Documentação da IBM](https://www.ibm.com/docs/pt-br/cognos-analytics/10.2.2?topic=designer-creating-relational-model)

## Modelo Físico

Entregar um arquivo banco.sql contendo os scripts de criação das tabelas do banco de dados. Este arquivo deverá ser incluído dentro da pasta src\bd.

``` SQL
CREATE TABLE zlbspi_connexa.user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    pswh_hash VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_status BOOLEAN NOT NULL
);

CREATE TABLE zlbspi_connexa.lista (
    lista_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    lista_publica BOOLEAN NOT NULL,
    lista_status BOOLEAN NOT NULL,
    lista_descricao TEXT,
    lista_titulo TEXT,
    FOREIGN KEY (user_id) REFERENCES zlbspi_connexa.user(user_id)
);

CREATE TABLE zlbspi_connexa.item_lista (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_nome VARCHAR(255) NOT NULL,
    item_descricao TEXT,
    lista_id INT,
    item_status BOOLEAN NOT NULL,
    FOREIGN KEY (lista_id) REFERENCES zlbspi_connexa.lista(lista_id)
);

CREATE TABLE zlbspi_connexa.convite (
    convite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    lista_id INT,
    data_expiracao DATE,
    FOREIGN KEY (user_id) REFERENCES zlbspi_connexa.user(user_id),
    FOREIGN KEY (lista_id) REFERENCES zlbspi_connexa.lista(lista_id)
);

CREATE TABLE zlbspi_connexa.user_lista (
    user_lista_id INT AUTO_INCREMENT PRIMARY KEY,
    lista_id INT,
    user_id INT,
    user_lista_status BOOLEAN NOT NULL,
    user_lista_role INT,
    FOREIGN KEY (user_id) REFERENCES zlbspi_connexa.user(user_id),
    FOREIGN KEY (lista_id) REFERENCES zlbspi_connexa.lista(lista_id)
);
```

## Tecnologias Utilizadas

* Redis
* RabbitMQ
* Ambiente .NET com foco em ASP.NET Core MVC
* Visual Studio Community
* Git e Github para versionamento de código


## Hospedagem

O programa usará a aplicação de JSON SERVER como método de hospedagem do back-end da aplicação podendo, a depender da evolução do projeto, ser migrado para uma estrutura de back-end em ASP.NET Core. O planejamento é hospedar o back-end na infraestrutura local de um participante do grupo.

## Qualidade de Software

De acordo com a norma ISO/IEC 25010:2011, as características de qualidade do software são:

Funcionalidade - Atende às necessidades do usuário

Confiabilidade - Executa suas funções de forma correta e consistente

Usabilidade - Fácil de usar e aprender

Eficiência - Desempenho adequado em relação aos recursos utilizados

Manutenibilidade - Capacidade de ser modificado e corrigido facilmente

Portabilidade - Pode ser utilizado em diferentes ambientes

Segurança - Protege informações e funcionalidades contra acesso não autorizado.

Diante disso, nossa aplicação tem como meta de desenvolvimento ser capaz de cumprir todos esses requisitos de qualidade de software para que seus stakeholders sejam corretamente satisfeitos.

> **Links Úteis**:
>
> - [ISO/IEC 25010:2011 - Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models](https://www.iso.org/standard/35733.html/)
> - [Análise sobre a ISO 9126 – NBR 13596](https://www.tiespecialistas.com.br/analise-sobre-iso-9126-nbr-13596/)
> - [Qualidade de Software - Engenharia de Software 29](https://www.devmedia.com.br/qualidade-de-software-engenharia-de-software-29/18209/)
