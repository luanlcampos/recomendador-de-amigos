const { GetCommand } = require("@aws-sdk/lib-dynamodb")
const { clientDocDB } = require("../models/data");

const getPersonByCpf = async (cpf) => {
    const command = new GetCommand({
        Key: { cpf },
        TableName: process.env.AWS_DYNAMODB_TABLE_NAME
    });

    try {
        const res = await clientDocDB.send(command);
        return res.Item;
    } catch (err) {
        console.warn(err);
    }
}

module.exports = getPersonByCpf;