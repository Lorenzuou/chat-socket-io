
const Usuario = require("./usuario.js")
const express = require('express');
const { futimes } = require('fs');
const path = require('path');


const app = express()
const port = 3000

const server = require('http').createServer(app);
const sockets = require('socket.io')(server);




app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

let mensagens = [];
let usuarios = [];
let online = 0;


function verificarUsuario(dado, socket) {
  let encontrou = 0;
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].nome == dado) {
      usuarios[i].socketId = socket.id;
      encontrou = 1;
      break;
    }
  }
  if (!encontrou) {
    let novoUsuario = new Usuario(dado, usuarios.length, socket);
    usuarios.push(novoUsuario);

  } else {

  }

}

sockets.on('connection', (socket) => { // ativavdo quando alguem se conecta
  
  online++; // contador de conexões
  console.log("conectado");

  socket.on('novoUsuario',(dado)=>{
    verificarUsuario(dado, socket.id);
    console.log(dado);
    socket.broadcast.emit('usuarioConectado',dado);

  }); 
  
  socket.emit('receberHistorico', mensagens);


  socket.on('enviarMensagem', (dado) => {

    // console.log(dado);
    socket.broadcast.emit('receberMensagem', dado);
    mensagens.push(dado);
  });

  socket.on('disconnect', () => {

    online = online - 1;
    console.log(online);
    let usuarioDesconectado = usuarios.filter((obj) => { return obj.socketId == socket.id});
    console.log(usuarioDesconectado[0]);
    if(usuarioDesconectado[0])
      socket.broadcast.emit('usuarioDesconectado',usuarioDesconectado[0].nome); 


  });
});

app.get('/chat', (req, res) => {
  res.render('chat.html');
});


server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

