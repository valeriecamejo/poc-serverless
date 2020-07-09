'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.region });
const lambda = new AWS.Lambda();

module.exports.handler = async (event, context, callback) => {
  console.log("Mensaje de entrada: ", JSON.stringify(event, null, 2))

  try {
    let itemDynamo = await getItemDynamo();
    if (itemDynamo.Count) await saveDataOnS3(itemDynamo);
    callback(null, 'Proceso finalizado')
  } catch (err) {
    console.log("Error: ", err)
  }
}

const getItemDynamo = async () => {
  const lambdaToCall = process.env.lambdaGetDynamoItem;
  const data = 'pelota';
  const item = await invokeLambda(lambdaToCall, data);
  return item
}

const saveDataOnS3 = async (data) => {
  const lambdaToCall = process.env.lambdaSaveDataOnS3;
  const result = await invokeLambda(lambdaToCall, data);
  return result
}

const invokeLambda = (lambdaToCall, data) => {
  return lambda.invoke({
    FunctionName: lambdaToCall,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(data)
  }).promise()
    .then((res) => {
      console.log("response: ", res);
      return JSON.parse(res.Payload);
    })
    .catch((err) => {
      console.error('Ha ocurrido un error al intentar invocar la lambda', err);
      return;
    });
};