const express = require('express');

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Vinicius", "email": "viniciusgarica@gmail.com" }

// CRUD - Create, Read, Update, Delete

const users = ['Vinícius', 'Diego', 'Letícia'];

//middleware global
server.use((req, res, next) => {
  // console.log(`Method: ${req.method}; URL: ${req.url}`);
  return next();
});

//middleware de checagem da existencia do usuário
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({
      error: "User name is required"
    });
  }

  return next();
};

//middleware de checagem da existencia do usuário no Vetor de usuários
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: 'User does not exists' })
  }

  req.user = user;

  return next();
}

// Rota para a listagem de todos os usuários
server.get('/users', (req, res) => {
  return res.json(users);
});

// Rota para a listagem de usuários passando seu parametro index
server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

// Rota para a inclusão de um novo usuário no vetor
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
})

// Rota para a alteração de um usuário no vetor
server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// Rota para deletar um usuário no vetor passando o seu identificador
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
});

// porta onde o servidor backend estará rodando
server.listen(3000);