# Person Recommendation API

This is a Node.js API for recommending friends of friends based on a given person's CPF (Cadastro de Pessoas Físicas). The API allows creating persons, establishing relationships between them, and retrieving friend recommendations.

## The Tech Stack

AWS Lambda, API Gateway, DynamoDB, Serverless Framework

# Getting Started

To run the API locally, follow these steps:

## 1. Clone the repository:

```bash
git clone https://github.com/luanlcampos/recomendar-amigos.git
```

## 2. Navigate to the project directory:

```bash
cd recomendador-de-amigos
```

## 3. Install the dependencies:

```bash
npm install
```

## 4. Install and configure Serverless

```bash
npm instal -g serverless
```

More details to set up the AWS credentials at: [Serverless Doc](https://www.serverless.com/framework/docs/providers/aws/guide/credentials)

## 5. Running the API

### 5.1 Running it locally with sls offline and dynamodb local

Note: I am using docker to create a local instance of DynamoDB. SLS offers a plugin for running DynamoDB local, but the library is outdated. To make it work, you would have to manually change the DynamoDB image download URL in the node_modules. [Click here to check the GitHub Issue on that](https://github.com/99x/dynamodb-localhost/pull/78)

The following command will run the following actions:

1. Start the DynamoDB container by running the `docker-compose.yml` with `docker compose up -d`
2. Start the server by using the [serverless-offline](https://github.com/dherault/serverless-offline) plugin running `sls offline start`
3. API will be running on http://localhost:3000/dev

```bash
npm run dev:local
```

### 5.2 Run the function you want to test

Note: this method requires AWS configuration as it is using the actual AWS DynamoDB table. This is a good way to test the functions before deploying.

```bash
serverless invoke local --function getRecommendationsByCpf --data '{"pathParameters": {"cpf":"11111111111"}}
```

_Todo: Setup the serverless-offline and serverless-dynamodb-local plugins for an appropiate local environment_

# Project Structure

The project structure is organized as follows:

```css
├── README.md
├── package-lock.json
├── package.json
├── serverless.yml
└── src
    ├── api
    │   ├── person
    │   │   ├── get.js
    │   │   └── post.js
    │   ├── recommendations
    │   │   └── get.js
    │   └── relationship
    │       └── post.js
    ├── models
    │   ├── data
    │   │   ├── aws
    │   │   │   └── ddbClient.js
    │   │   └── index.js
    │   └── jsonSchemas
    │       ├── createPersonModel.json
    │       └── createRelationshipModel.json
    └── services
        ├── checkIfUserExists.js
        ├── createRelationship.js
        ├── getPersonByCpf.js
        ├── getRecommendationsByCpf.js
        ├── index.js
        └── writePerson.js
```

## File/Directory Description

| File/Directory     | Description                                                                                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| serverless.yml     | This is a configuration file for the serverless framework. It defines the serverless application's infrastructure, functions, events, and other resources. It specifies the AWS Lambda functions, their triggers, and any necessary configurations. |
| src/               | This is a folder that contains the source code of the serverless application.                                                                                                                                                                       |
| src/api/           | This folder contains the API-related code.                                                                                                                                                                                                          |
| - person/          | This folder contains the code related to the "person" API endpoint.                                                                                                                                                                                 |
| - recommendations/ | This folder contains the code related to the "recommendations" API endpoint.                                                                                                                                                                        |
| - relationship/    | This folder contains the code related to the "relationship" API endpoint.                                                                                                                                                                           |
| src/models/        | This folder contains the data models and related code.                                                                                                                                                                                              |
| - data/aws         | This folder contains the code for interacting with AWS services, specifically the DynamoDB database                                                                                                                                                 |
| - jsonSchemas/     | This folder contains JSON schemas that define the structure and validation rules for the data models.                                                                                                                                               |
| services/          | This folder contains the code for various services or business logic for handling data requests to the database                                                                                                                                     |

# API Endpoints

## Person

| Method | Description         | Endpoint |
| ------ | ------------------- | -------- |
| POST   | Create a new person | /person  |

<details>
<summary> Request </summary>

Using curl

```bash
curl --location '{awsURL}/person' \
--header 'Content-Type: application/json' \
--data '{ "cpf": "77777777777", "name": "Giba" }'
```

Using serverless CLI

```bash
serverless invoke local --function createPerson --data '{ "cpf": "77777777777", "name": "Giba" }'
```

</details>

<details>
<summary>HTTP 200: Successful Response </summary>

```json
{
  "status": "ok",
  "cpf": "77777777777",
  "name": "Giba"
}
```

</details>

<details>
<summary>Error Responses</summary>

### HTTP 400: User already exists

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "Usuário já cadastrado"
  }
}
```

### HTTP 400: Invalid CPF

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "CPF Inválido"
  }
}
```

</details>

| Method | Description              | Endpoint     |
| ------ | ------------------------ | ------------ |
| GET    | Retrieve a person by CPF | /person/:cpf |

<details>
<summary> Request </summary>

Using curl

```bash
curl --location '{awsUrl}/person/77777777777'
```

Using serverless CLI

```bash
serverless invoke local --function getPersonByCpf --data '{"pathParameters": {"cpf":"11111111111"}}'
```

</details>

<details>
<summary> HTTP 200: Successful Response </summary>

```json
{
  "status": "ok",
  "cpf": "77777777777",
  "name": "Giba"
}
```

</details>

<details>
<summary>Error Reponses</summary>

### HTTP 400: User not found

```json
{
  "status": "error",
  "error": {
    "code": 404,
    "message": "Usuário não encontrado"
  }
}
```

</details>

## Relationship

| Method | Description               | Endpoint      |
| ------ | ------------------------- | ------------- |
| POST   | Create a new relationship | /relationship |

<details>
<summary> Request </summary>

Using curl

```bash
curl --location '{awsUrl}/relationship' \
--header 'Content-Type: application/json' \
--data '{ "cpf1": "11111111111", "cpf2": "22222222222" }'
```

Using serverless CLI

```bash
serverless invoke local --function createRelationship --data '{ "cpf1": "11111111111", "cpf2": "22222222222" }'
```

</details>

<details>
<summary>HTTP 200: Successful Response </summary>

```json
{
  "status": "ok",
  "cpf": "77777777777",
  "name": "Giba"
}
```

</details>

<details>
<summary>Error Responses</summary>

### HTTP 404: User not found

```json
{
  "status": "error",
  "error": {
    "code": 404,
    "message": "Usuário não encontrado"
  }
}
```

### HTTP 400: Invalid CPF

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "CPF Inválido"
  }
}
```

</details>

## Recommendations

| Method | Description                             | Endpoint              |
| ------ | --------------------------------------- | --------------------- |
| GET    | Get friend recommendations for a person | /recommendations/:cpf |

<details>
<summary> Request </summary>

Using curl

```bash
curl --location '{awsUrl}/recommendations/11111111111'
```

Using serverless CLI

```bash
serverless invoke local --function getRecommendationsByCpf --data '{"pathParameters": {"cpf":"11111111111"}}'
```

</details>

<details>
<summary>HTTP 200: Successful Response </summary>

```json
{
  "status": "ok",
  "data": ["44444444444", "55555555555"]
}
```

</details>

<details>
<summary>Error Responses</summary>

### Code 404: User not found

```json
{
  "status": "error",
  "error": {
    "code": 404,
    "message": "Usuário não encontrado"
  }
}
```

### Code 400: Invalid CPF

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "CPF Inválido"
  }
}
```

</details>

# Deploy

To deploy our applicaiton, Serverless will use the configuration written in the serverless.yml file to create/update the CloudFormation stack with your code. To deploy, you have to execute:

```bash
sls deploy
```

You can find more information and options of deploy [here](https://www.serverless.com/framework/docs/providers/aws/guide/deploying).

_**TODO**: Create a pipeline on GitHub to deploy everytime a new code is merged/pushed into main._
