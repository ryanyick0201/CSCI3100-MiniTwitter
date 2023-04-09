const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

require('dotenv').config();

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

// console.log(`\n${bucketName}\n`);
// console.log(`\n${region}\n`);
// console.log(`\n${accessKeyId}\n`);
// console.log(`\n${secretAccessKey}\n`);

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

function uploadFile(fileBuffer, fileName, mimetype) {
    // console.log(`File Buffer is: ${fileBuffer}`);
    // console.log(`File name is: ${fileName}`);
    // console.log(`File type is: ${mimetype}`);

    try{
        const uploadParams = {
            Bucket: bucketName,
            Body: fileBuffer,
            Key: fileName,
            ContentType: mimetype
        }   
            s3Client.send(new PutObjectCommand(uploadParams));
            return `{"message": "File upload succeeded"}`
        } catch(err){
            return `{"message": "File upload failed"}`
    }
}

function deleteFile(fileName) {
  try{
    const deleteParams = {
        Bucket: bucketName,
        Key: fileName,
      }   
      s3Client.send(new DeleteObjectCommand(deleteParams));
      return `{"message": "File delete succeeded"}`
    } catch {
        return `{"message": "File delete failed"}`
  }
}

async function getObjectSignedUrl(key) {
  const params = {
    Bucket: bucketName,
    Key: key
  }

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params);
  //const seconds = 60
  const url = await getSignedUrl(s3Client, command/*, { expiresIn: seconds }*/);

  return url
}

module.exports = {uploadFile, deleteFile, getObjectSignedUrl};