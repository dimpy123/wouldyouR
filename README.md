# wouldyouR

THIS IS THE SQL

drop database if exists dilemma;
create database dilemma;
use dilemma;

drop table if exists users;
create table users(
    username varchar(60) primary key,
    password varchar(60) not null
);

drop table if exists dilemmas;
create table dilemmas(
    id int AUTO_INCREMENT,
    choice1 varchar(200) not null,
    choice2 varchar(200) not null,
    choice1chosen int default 0,
    choice2chosen int default 0,
    primary key(id)
);

