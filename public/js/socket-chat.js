
var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var user = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};



socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enter-chat', user, function(resp) {
        // console.log('Usuarios conectados', resp);
        renderPersons(resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('create-message', function(message) {
    console.log('Servidor:', message);
    renderMessages(message, false);
    scrollBottom();

});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('list-persons', function(persons) {
    // console.log(persons);
    renderPersons(persons);
});

// Mensajes privados
socket.on('private-message', function(message) {

    console.log('Mensaje Privado:', message);


});