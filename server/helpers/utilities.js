

const createMesage = (nombre, message) => {

    return {
        nombre,
        message,
        date: new Date().getTime()
    }

};

module.exports = {
    createMesage
}

