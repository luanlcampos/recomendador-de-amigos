const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { clientDocDB } = require("../models/data");

const createRelationship = async (cpf1, cpf2) => {
    const command = new UpdateCommand({
        TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
        Key: { cpf: cpf1 },
        ExpressionAttributeValues: {
            ":list": new Set([cpf2])
        },
        ReturnValues: "ALL_NEW",
        UpdateExpression: "ADD relationships :list"
    });

    try {
        const res = await clientDocDB.send(command);
        return res;
    } catch (err) {
        console.warn(err);
        throw new Error(err);
    }
}

module.exports = createRelationship;