"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUpload = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = __importDefault(require("uuid"));
const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;
exports.fileUpload = (file) => {
    console.log('name:', file);
    // Create unique bucket name
    const bucketName = file + uuid_1.default.v4();
    // Create name for uploaded object key
    const keyName = bucketName + '.webp';
    // Create a promise on S3 service object
    const bucketPromise = new aws_sdk_1.default.S3({
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
        var uploadPromise = new aws_sdk_1.default.S3({
            apiVersion: '2006-03-01',
            accessKeyId: ID,
            secretAccessKey: SECRET,
        })
            .putObject(objectParams)
            .promise();
        uploadPromise.then(data => {
            console.log('Successfully uploaded data to ' +
                bucketName +
                '/' +
                keyName);
        });
    })
        .catch(function (err) {
        console.error(err, err.stack);
    });
};
//# sourceMappingURL=s3.js.map