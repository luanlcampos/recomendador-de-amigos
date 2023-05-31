const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const { clientDocDB } = require("../models/data");

// TODO: move this to his own service file and create a route to retrieve person friends
const getRelationshipsByCpf = async (cpf) => {
    const command = new GetCommand({
        Key: { cpf },
        TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
        ProjectionExpression: "relationships"
    });

    try {
        const relationships = await clientDocDB.send(command);
        return relationships.Item ? relationships.Item.relationships : new Set();
    } catch (err) {
        throw new Error(err);
    }
}

const getRecommendationsByCpf = async (cpf) => {

    try {
        const friends = await getRelationshipsByCpf(cpf);

        const recommendations = {};
        for (const cpfInner of friends) {
            const friendsOfFriend = await getRelationshipsByCpf(cpfInner);

            for (const friend of friendsOfFriend) {
                if (!friends.has(friend) && friend !== cpf) {
                    recommendations[friend] = (recommendations[friend] || 0) + 1;
                }
            }
        }

        // order recommendations by relevance score
        const sortedRecommendations = Object.entries(recommendations)
            // filter > 0 scores
            // eslint-disable-next-line no-unused-vars
            .filter(([_, score]) => score > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([cpf]) => cpf);

        return sortedRecommendations;
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = getRecommendationsByCpf;