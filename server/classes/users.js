

class Users {

    constructor() {
        this.people = [];

    }

    addPerson(id, nombre, sala) {
        let person = { id, nombre, sala };

        this.people.push(person);
        return this.people;
    }

    getPerson(id) {
        let person = this.people.filter( person => person.id === id )[0];
        return person;
    }

    getPeople() {
        return this.people;
    }

    getPersonsForRoom(sala) {
        let personsInRoom = this.people.filter( person => person.sala === sala );
        return personsInRoom;
    }

    removePerson(id) {

        let removedPerson = this.getPerson(id);

        this.people = this.people.filter( person => person.id !== id );

        return removedPerson;
    }
};

module.exports = {
    Users
}