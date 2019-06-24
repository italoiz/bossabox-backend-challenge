<h1 align="center">

  ![](assets/vuttr-challenge.png)

</h1>

<h3 align="center">
  Bossabox Challenge developed by Italo Izaac 🤘
</h3>

<div align="center">

  ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/italoiz/bossabox-backend-challenge/master.svg?color=0A5184&label=version)<space>
  ![Travis (.org) branch](https://img.shields.io/travis/italoiz/bossabox-backend-challenge/master.svg?color=0A5184)<space>
  ![Coveralls github branch](https://img.shields.io/coveralls/github/italoiz/bossabox-backend-challenge/master.svg?color=0A5184)

</div>

## Visão geral

<img src="https://media.giphy.com/media/14udF3WUwwGMaA/giphy-downsized.gif" align="right" hspace="70">

Esta aplicação foi contruída utilizando **NodeJS**, bando de dados **NoSQL MongoDB** e técnicas como **TDD** e **BDD**. A mesma é proposta como desafio ([veja o desafio aqui](https://www.notion.so/Back-end-0b2c45f1a00e4a849eefe3b1d57f23c6)) da [Bossabox](https://bossabox.com) para participar do "processo seletivo" e conseguir se candidatar para vagas de trabalho remoto dispoíveis no site.

<br /><br />

## Indíce

- [Instalando](#instalando)
- [Utilizando a API](#utilizando-a-api)
- [Versão Online](#versao-online)
- [Licença](#licença)

## Instalando

### 1. Clone do projeto:

```bash
$ git clone https://github.com/italoiz/bossabox-backend-challenge.git
```

### 2. Instale as dependências:

> Se você utiliza NPM, substitua o comando `yarn` por `npm install`.

```bash
$ cd bossabox-backend-challenge
$ yarn
```

### 3. Configure as variaveis ambiente:

Renomei o arquivo `.env.example` e configure as variais presentes nele, entenda abaixo o que significa cada uma delas.

* `SECRET` - Um hash que será usado para criptografar dados dos usuário e outras informações.
* `PORT` - A porta em que o servidor irá executar, a porta padrão é a **3333**.
* `SESSION_EXPIRES` - Tempo de expiração da sessão do usuário.
* `DATABASE_URI` - URI de conexão com banco de dados **MongoDB**. Exemplo: *mongodb://localhost:27017/database-name*

### 4. Execute o projeto:

Rode o comando abaixo para executar o servidor:

> Se você utiliza NPM, substitua o comando `yarn dev` por `npm run dev`

```bash
$ yarn dev
```

Se você configurou alguma porta de execução do servidor, acesse com a porta configurada assim
`http://localhost:PORT`. Se você não configurou porta alguma, acesso com `http//localhost:3333`.

Se para sessão [Utilizando a API](#utilizando-a-api) e saiba como usar a API de forma simples e rápida 👌

## Utilizando a API

Se você chegou aqui, significa que o projeto está rodando tranquilo, e agora você precisa saber como utilizar.
Isto é muito simples, acesse a documentação da API clicando no link abaixo.

[Ir para documentação!](http://docs.vuttr-challenge.com/api)

## Versão Online 🌎

Há uma versão da API hospedada e rodando para você *brincar* o mais rápido possível, assim você
não precisa executar o projeto em sua máquina.

Você pode utilizar a API através da seguinte URL: `http://api.vuttr-challenge/v1`

## BUGs 🐛

Este é um projeto realizado para participar do desafio da Bossabox como explicado na [Visão Geral](#visao-geral) do projeto. Porém se você detectar algum 🐛 e gostaria de deixar uma sugestão de melhoria ou até mesmo algum *Pull Request*, ficarei muito feliz em aprender com sua contribuição!

## Licença

MIT © [Italo Izaac](https://italoiz.github.io)
