const { getPersonByCpf } = require("../../services");

module.exports.handler = async (event) => {

    const { cpf } = typeof event.pathParameters === 'string' ? JSON.parse(event.pathParameters) : event.pathParameters;

    if (cpf.length !== 11 || isNaN(cpf)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid CPF",
            }, null, 2)
        }
    }

    try {
        const person = await getPersonByCpf(cpf);

        if (!person) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: "Person not found",
                }, null, 2)
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                cpf: person.cpf,
                name: person.name
            }, null, 2)
        }
    } catch (err) {
        console.warn(`error fetching person: ${err}`);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error fetching person",
            }, null, 2)
        }
    }
};