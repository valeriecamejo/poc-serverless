'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.region });

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context, callback) => {
  console.log("Mensaje de entrada: ", JSON.stringify(event, null, 2))

  try {
    const dynamoItem = await getItem('pelota');
    callback(null, dynamoItem);
  } catch (err) {
    console.log("Error: ", err)
  }
}

const getItem = product => {
  const params = {
    TableName: process.env.tablePruebaTekpro,
    KeyConditionExpression: 'product = :product',
    ExpressionAttributeValues: {
      ':product': product
    }
  }
  console.log("PARAMS: ", params);
  return dynamo.query(params).promise()
    .then((data) => {
      console.log("Resultado de la query: ", JSON.stringify(data, null, 2));
      return data;
    }).catch((err) => {
      console.error("ERROR al realizar consulta a tabla prueba_tekpro : ", err);
      return err;
    })
}