

const express = require('express')
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
sockets.on('connection', (socket) => {
  
  
  socket.emit('receberHistorico',mensagens); 
  console.log(socket.id);

  socket.on('enviarMensagem', dado => {
    // console.log(dado);
    socket.broadcast.emit('receberMensagem',dado); 
    mensagens.push(dado);
  }); 
});

app.get('/chat', (req, res) => {
  res.render('chat.html');
});


server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

