const getPersonByCpf = require('./getPersonByCpf');

const checkIfUserExists = async (cpf) => {
    try {
        const person = await getPersonByCpf(cpf);
        // person is undefined if the user is not found
        return person ? true : false;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = checkIfUserExists;