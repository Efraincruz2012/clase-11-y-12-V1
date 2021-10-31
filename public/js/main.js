
//onst socket = io();
////////////nuevo producto/////////////////
cargarMensajes()

async function cargarMensajes() {
    const plantilla = await buscarPlantilla()
    const mensajes = await buscarMensajes()
    const html = armarHTML(plantilla, mensajes)
    document.getElementById('mensajes').innerHTML = html
}

function buscarMensajes() {
    return fetch('/api/mensajes')
        .then(response => response.json())
}

//---------------------------------------


function buscarPlantilla() {
    return fetch('/plantillas/producto.html')
        .then(respuesta => respuesta.text())
}

function armarHTML(plantilla, mensajes) {
    const render = ejs.compile(plantilla);
    const html = render({ mensajes })
    return html
}


/////////CHAT////////
function addMessage(e) {
    const mensaje = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value
    }
    socket.emit('nuevoMensaje', mensaje);
    return false;
}

function makeHTML(mensajes) {
    return mensajes.map((elem, index) => {
        return (`<div>
            <strong>${elem.author}</strong>:
            <em>${elem.text}</em> </div>`)
    }).join(" ")
}

function render(mensajes) {
    const html = makeHTML(mensajes)
    document.getElementById('mensajes').innerHTML = html;
}

socket.on('mensajes', mensajes => {
    render(mensajes)
});