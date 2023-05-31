const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { clientDocDB } = require("../models/data");

const writePerson = async (cpf, name) => {
    const params = {
        TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
        Key: { cpf },
        Item: {
            cpf, name
        }
    }
    const command = new PutCommand(params);
    const res = await clientDocDB.send(command);
    return res;
}

module.exports = writePerson;
