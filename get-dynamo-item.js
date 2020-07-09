'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.region });

const dynamo = new AWS.DynamoDB.DocumentClient();
const S3 = new AWS.S3();

module.exports.handler = async (event, context, callback) => {
  console.log("Mensaje de entrada: ", JSON.stringify(event, null, 2))

  try {
    const dynamoItem = await getItem('pelota');
    if (dynamoItem) await saveDataOnS3(process.env.bucketName, process.env.filenameDynamoData, dynamoItem)
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
      return data.Items && data.Items.length ? data.Items : null;
    }).catch((err) => {
      console.error("ERROR al realizar consulta a tabla prueba_tekpro : ", err);
      return err;
    })
}

const saveDataOnS3 = (bucket, filename, data) => {
  let params = {
    Body: JSON.stringify(data),
    Bucket: bucket,
    Key: filename
  }

  return S3.putObject(params, (err, data) => {
    if(err) console.log("Ha ocurrido un error al guardar archivo en S3: ", err);
    else console.log("Se ha guardado la data exitosamente en S3")
  });
}