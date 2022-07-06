const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMesage } = require('../helpers/utilities');

const users = new Users();

io.on('connection', (client) => {

    // new user is connect
    // console.log('Usuario conectado');

    client.on('enter-chat', (user, callback) => {

        if ( !user.nombre || !user.sala ) {
            return callback({
                error: true,
                msg: 'Name/sala is necessary'
            });
        };

        client.join(user.sala);

        users.addPerson( client.id , user.nombre, user.sala );

        client.broadcast.to(user.sala).emit('list-persons', users.getPersonsForRoom(user.sala) );
        client.broadcast.to(user.sala).emit('create-message',   createMesage('Admin',`${user.nombre} joined `));

        callback( users.getPersonsForRoom(user.sala));

    });

    client.on('create-message', (data, callback) => {

        let person = users.getPerson(client.id);

        let msg = createMesage(person.nombre, data.message);

        client.broadcast.to(person.sala).emit('create-message', msg);

        callback(msg);

    });

    // Private messages
    client.on('private-message', data => {

        let person = users.getPerson(client.id);

        client.broadcast.to(data.to).emit('private-message', createMesage(person.nombre, data.message));
    });

    client.on('disconnect', () => {

        const removedPerson = users.removePerson(client.id);
        // return removedPerson;

        client.broadcast.to(removedPerson.sala).emit('create-message',   createMesage('Admin',`${removedPerson.nombre} leave `));
        client.broadcast.to(removedPerson.sala).emit('list-persons', users.getPersonsForRoom(removedPerson.sala) );

    });

});