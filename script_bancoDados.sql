

select user, host, password from mysql.user;
create user 'adm'@'localhost' identified by 'user';
grant insert, select, update, delete on loja.* to 'adm'@'localhost';

create table categorias(
	
	catid int(6) not null auto_increment,
	nome varchar(30) not null,
	primary key(catid)

);

create table produtos(

	pid int(6) not null auto_increment,
	nome varchar(30) not null,
	catid int(6),
	valor real,
	primary key(pid)

);

INSERT INTO categorias (nome)
VALUES
    ('cpu'),
    ('disco rigido'),
    ('memoria ram'),
    ('monitores');


INSERT INTO produtos (nome, catid, valor)
VALUES
    ('Hd Externo', '2', '400.00'),
    ('2', 'CPU i7', '1', '800.00');


select * from categorias;

select * from produtos;


insert into produtos (nome, catid, valor) values ('Monitor Sans','4','200.00');













