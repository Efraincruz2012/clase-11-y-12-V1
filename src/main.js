const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


const path = require('path')
const ContenedorArchivo = require('./contenedores/ContenedorArchivo.js')//3//
const mensajesApi = new ContenedorArchivo('./DB/mensajes.txt')
app.use(express.static('public'))
app.set('views', './views')

///////////Producto///////////////////////

app.get('/mensajesEJS', async (req, res) => {
    const mensajes = await mensajesApi.listarAll()
    res.render('mensajes.ejs', { mensajes })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views/mensajes.html'))
})
// rutas de la api rest

app.get('/api/mensajes', async (req, res) => {
    const mensajes = await mensajesApi.listarAll()
    res.json(mensajes)
})


const mensajes = [
    { author: "Efrain", text: "¡Hola! ¿Que tal?" },
       ]


io.on('connection', socket => {
    console.log('Nuevo cliente conectado!')

    socket.emit('mensajes', mensajes)
    

    socket.on('nuevoMensaje', mensaje => {
        mensajes.push(mensaje)
        io.sockets.emit('mensajes', mensajes)
    })

  
})

const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`) )

