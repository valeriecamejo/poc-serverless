'use strict';

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});

const dynamo = new AWS.DynamoDB.DocumentClient();

const getData = product => {
  const params = {
    TableName: process.env.tablePruebaTekpro,
    KeyConditionExpression: 'product = :product',
    ExpressionAttributeValues: {
      ':product': product
    }
  }

  return dynamo.query(params).promise()
    .then((data) => {
      return data.Items && data.Items.length ? data.Items : null;
    }).catch((err) => {
      console.error("ERROR al realizar consulta a tabla prueba_tekpro : ", err);
      return err;
    })
}

module.exports.hello = async (event, context, callback) => {
  console.log("Mensaje de entrada: ", JSON.stringify(event, null, 2))

  try {
    const result = await getData('valerie');
    console.log("Resultado de la query: ", result);
  } catch (err) {
    console.log("Error: ", err)
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};