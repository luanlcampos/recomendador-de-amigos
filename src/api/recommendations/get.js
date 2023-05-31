const { checkIfUserExists, getRecommendationsByCpf } = require("../../services");

module.exports.handler = async (event) => {
    const { cpf } = typeof event.pathParameters === 'string' ? JSON.parse(event.pathParameters) : event.pathParameters;

    // validate cpf. 
    // TODO: consider moving to utils
    if (cpf.length !== 11 || isNaN(cpf)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid CPF",
            }, null, 2)
        }
    }
    try {
        // check if user exists
        const userExists = await checkIfUserExists(cpf);
        if (!userExists) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: "Person not found",
                }, null, 2)
            }
        }

        const res = await getRecommendationsByCpf(cpf);
        return {
            statusCode: 200,
            body: JSON.stringify({
                data: res
            }, null, 2)
        }
    } catch (err) {
        console.warn(`Error fetching recommendations`, err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Internal Server Error. Check logs for detail`
            }, null, 2)
        }
    }
}