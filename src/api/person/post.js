const { checkIfUserExists, writePerson } = require("../../services");

module.exports.handler = async (event) => {
    // additional checking to work with serveless local
    // when running locally, the event body is automatically converted to json
    const { cpf, name } = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    console.log('Body Cpf and name: ', { cpf, name, event });

    try {
        const userExists = await checkIfUserExists(cpf);

        if (userExists) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: `User already exists`
                }, null, 2)
            }
        }

        const res = await writePerson(cpf, name);
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: `Person created`,
                input: event.body
            }, null, 2)
        }
    }
    catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Error adding person. Check logs for details`,
                err: err.message
            }, null, 2)
        }
    }

};
