CREATE TABLE gfkhak_connexa.user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    pswh_hash VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_status BOOLEAN NOT NULL
);

CREATE TABLE gfkhak_connexa.lista (
    lista_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    lista_publica BOOLEAN NOT NULL,
    lista_status BOOLEAN NOT NULL,
    lista_descricao TEXT,
    lista_titulo TEXT,
    FOREIGN KEY (user_id) REFERENCES gfkhak_connexa.user(user_id)
);

CREATE TABLE gfkhak_connexa.item_lista (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_nome VARCHAR(255) NOT NULL,
    item_descricao TEXT,
    lista_id INT,
    item_status BOOLEAN NOT NULL,
    FOREIGN KEY (lista_id) REFERENCES gfkhak_connexa.lista(lista_id)
);

CREATE TABLE gfkhak_connexa.convite (
    convite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    lista_id INT,
    data_expiracao DATE,
    FOREIGN KEY (user_id) REFERENCES gfkhak_connexa.user(user_id),
    FOREIGN KEY (lista_id) REFERENCES gfkhak_connexa.lista(lista_id)
);
