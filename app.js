const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/src/html/login.html');
});

app.post('/login', (req, res) => {
  // req.body.username & req.body.password
  res.send("Username: " + req.body.username + "; Password: " + req.body.password);
}); 

app.listen(port, () => {
  console.log(`App listening on port ${port} 🙃`);
});