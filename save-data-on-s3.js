'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.region });
const S3 = new AWS.S3();

module.exports.handler = async (event, context, callback) => {
  console.log("Mensaje de entrada: ", JSON.stringify(event, null, 2))

  try {
    const saveData = await saveDataOnS3(process.env.bucketName, process.env.filenameDynamoData, event)
    callback(null, saveData)
  } catch (err) {
    console.log("Error: ", err)
  }
}

const saveDataOnS3 = async (bucket, filename, data) => {
  console.log("Parámetros de entrada: ", bucket, filename, data);
  let params = {
    Body: JSON.stringify(data),
    Bucket: bucket,
    Key: filename
  }
  await S3.putObject(params, (err, data) => {
    if(err) {
      console.log("Ha ocurrido un error al guardar archivo en S3: ", err);
      return err
    }
    else {
      console.log("Se ha guardado la data exitosamente en S3");
      return "Data guardada exitosamente"
    }
  });
}