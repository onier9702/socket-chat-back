const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMesage } = require('../helpers/utilities');

const users = new Users();

io.on('connection', (client) => {

    // new user is connect
    // console.log('Usuario conectado');

    client.on('enter-chat', (user, callback) => {

        if ( !user.name || !user.sala ) {
            return callback({
                error: true,
                msg: 'Name/sala is necessary'
            });
        };

        client.join(user.sala);

        users.addPerson( client.id , user.name, user.sala );

        client.broadcast.to(user.sala).emit('list-persons', users.getPersonsForRoom(user.sala) );

        callback( users.getPersonsForRoom(user.sala));

    });

    client.on('create-message', (data) => {

        let person = users.getPerson(client.id);

        let msg = createMesage(person.name, data.message);

        client.broadcast.to(person.sala).emit('create-message', msg);

    });

    // Private messages
    client.on('private-message', data => {

        let person = users.getPerson(client.id);

        client.broadcast.to(data.to).emit('private-message', createMesage(person.name, data.message));
    });

    client.on('disconnect', () => {

        const removedPerson = users.removePerson(client.id);
        // return removedPerson;

        client.broadcast.to(removedPerson.sala).emit('create-message',   createMesage('Admin',`${removedPerson.name} leave `));
        client.broadcast.to(removedPerson.sala).emit('list-persons', users.getPersonsForRoom(removedPerson.sala) );

    });

});