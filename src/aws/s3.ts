import AWS from 'aws-sdk';
import uuid from 'uuid';
const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;

export const fileUpload = (file: string) => {
    console.log('name:', file);
    // Create unique bucket name
    const bucketName = file + uuid.v4();
    // Create name for uploaded object key
    const keyName = bucketName + '.webp';

    // Create a promise on S3 service object
    const bucketPromise = new AWS.S3({
        apiVersion: '2006-03-01',
        accessKeyId: ID,
        secretAccessKey: SECRET,
    })
        .createBucket({ Bucket: bucketName })
        .promise();

    // Handle promise fulfilled/rejected states
    bucketPromise
        .then(() => {
            // Create params for putObject call
            var objectParams = {
                Bucket: bucketName,
                Key: keyName,
                Body: 'Hello World!',
            };
            // Create object upload promise
            var uploadPromise = new AWS.S3({
                apiVersion: '2006-03-01',
                accessKeyId: ID,
                secretAccessKey: SECRET,
            })
                .putObject(objectParams)
                .promise();
            uploadPromise.then(data => {
                console.log(
                    'Successfully uploaded data to ' +
                        bucketName +
                        '/' +
                        keyName,
                );
            });
        })
        .catch(function(err) {
            console.error(err, err.stack);
        });
};
