/* iamge.js
PROGRAMMER: YICK Ka Ho (SID: 1155142189)
PURPOSE: Functions that handle CRUD operations of image on AWS S3
Artificial intelligence tool such as ChatGPT is used for code generation.
*/

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

require("dotenv").config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// console.log(`\n${bucketName}\n`);
// console.log(`\n${region}\n`);
// console.log(`\n${accessKeyId}\n`);
// console.log(`\n${secretAccessKey}\n`);

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
PURPOSE: uploads a file to S3 bucket
@param {Buffer} fileBuffer - the file data as a buffer object
@param {string} fileName - the name of the file
@param {string} mimetype - the mimetype of the file
@returns {string} a message indicating whether the upload file operation was successful or not
*/
async function uploadFile(fileBuffer, fileName, mimetype) {
  // console.log(`File Buffer is: ${fileBuffer}`);
  // console.log(`File name is: ${fileName}`);
  // console.log(`File type is: ${mimetype}`);

  try {
    const uploadParams = {
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimetype,
    };
    await s3Client.send(new PutObjectCommand(uploadParams));
    return `{"message": "File upload succeeded"}`;
  } catch (err) {
    return `{"message": "File upload failed"}`;
  }
}

/**
PURPOSE: deletes a file from S3 bucket
@param {string} fileName - the name of the file to delete
@returns {string} a message indicating whether the delete file operation was successful or not
*/
async function deleteFile(fileName) {
  try {
    const deleteParams = {
      Bucket: bucketName,
      Key: fileName,
    };
    s3Client.send(new DeleteObjectCommand(deleteParams));
    return `{"message": "File delete succeeded"}`;
  } catch {
    return `{"message": "File delete failed"}`;
  }
}

/**
PURPOSE: generates a pre-signed URL for an object in S3 bucket
@param {string} key - the key of the object in S3 bucket
@returns {string} a pre-signed URL for the object
*/
async function getObjectSignedUrl(key) {
  console.log(key);
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params);
  const seconds = 60000;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url;
}

module.exports = { uploadFile, deleteFile, getObjectSignedUrl };
