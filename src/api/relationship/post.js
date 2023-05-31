const { createRelationship } = require("../../services");

module.exports.handler = async (event) => {
    // cpfs are validated in the json schema
    const { cpf1, cpf2 } = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    try {
        const res1 = await createRelationship(cpf1, cpf2);
        const res2 = await createRelationship(cpf2, cpf1);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: `Relationship between ${cpf1} and ${cpf2} established`
            }, null, 2)
        }
    } catch (err) {
        console.warn(`Error creating relationship`, err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Internal Server Error. Check logs for detail`
            }, null, 2)
        }
    }
}