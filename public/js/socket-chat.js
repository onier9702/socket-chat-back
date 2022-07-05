
const socket = io();

const params = new URLSearchParams(window.location.search);

if ( !params.has('name') || !params.has('sala') ) {
    window.location = 'index.html';
    throw new Error('Name and sala are necessary');
};

const user = {
    name: params.get('name'),
    sala: params.get('sala'),
}

socket.on('connect', () => {
    console.log('Conectado al servidor');

    // enter to chat
    socket.emit('enter-chat', user, (resp) => {
        console.log(resp);
    });

});

// escuchar
socket.on('disconnect', () => {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
socket.on('create-message', (message) => {

    console.log('Servidor:', message);

});

// listen changes of users, when a user connect or disconnect from chat
socket.on('list-persons', (people) => {
    console.log('Servidor:', people);
} );

// private messages
socket.on('private-message', (message) => {

    console.log('Private Message: ', message);
});