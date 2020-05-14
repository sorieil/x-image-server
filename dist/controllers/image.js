"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoEvent_1 = require("./../entity/mongodb/main/MongoEvent");
const MongoImageLog_1 = require("./../entity/mongodb/main/MongoImageLog");
const MongoAccounts_1 = require("./../entity/mongodb/main/MongoAccounts");
const common_1 = require("../util/common");
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const multer_1 = __importDefault(require("multer"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const ServiceImageLog_1 = __importDefault(require("../service/mongodb/ServiceImageLog"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: 'AKIARKY6OJBAFI2O42CL',
    secretAccessKey: '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',
});
const fileFilter = (req, file, cb) => {
    try {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        }
        else {
            // console.log(req.res);
            common_1.responseJson(req.res, ['이미지 파일을 선택해주세요.'], 'POST', 'invalid');
            // cb('이미지 파일을 선택해 주세요.', true);
        }
        console.log('req:', req);
    }
    catch (err) {
        common_1.tryCatch(req.res, err);
    }
};
const upload = multer_1.default({
    fileFilter: fileFilter,
    dest: './uploads',
});
const cpUpload = upload.fields([{ name: 'images', maxCount: 1 }]);
const apiDelete = [
    [express_validator_1.param('targetId').notEmpty()],
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            const account = new MongoAccounts_1.Accounts();
            const event = new MongoEvent_1.Event();
            account._id = user._id;
            event._id = user.eventId;
            if (!errors.isEmpty()) {
                common_1.responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            common_1.responseJson(res, [false], method, 'success');
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
const apiPost = [
    cpUpload,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            const account = new MongoAccounts_1.Accounts();
            const event = new MongoEvent_1.Event();
            account._id = user._id;
            event._id = user.eventId;
            if (!errors.isEmpty()) {
                common_1.responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            const image = req.files;
            const file = fs_1.default.readFileSync(image.images[0].path);
            const filename = yield sharp_1.default(file)
                .rotate()
                .webp()
                // .png()
                .toBuffer();
            // 오리지널 데이터 저장 주소: 이벤트/유저 디렉토리
            const mimetype = 'webp';
            const myBucket = `xsync-image-server/${user.eventId}`;
            // 파일명
            const subKey = user._id.toString().slice(0, 10);
            const myKey = `${subKey}_${Date.now().toString()}.${mimetype}`;
            // const myKey =
            //     Date.now().toString() +
            //     `.${image.images[0].mimetype.split('/')[1]}`;
            const params = { Bucket: myBucket, Key: myKey, Body: filename };
            const uploadS3 = yield s3.putObject(params).promise();
            /** Error check code. Inside in puObject function.
             * err => {
                    if (err) {
                        // handle errors
                        return new Error('oops');
                        responseJson(res, [err.message], method, 'fails');
                    }
                } */
            if (uploadS3) {
                // Get uploaded image information.
                // Deleted Temporary an upload file. Don't need to sync.
                if (image.images.length > 0 && typeof image.images) {
                    fs_1.default.unlink(image.images[0].path, err => {
                        console.log('Deleted result:', err);
                    });
                }
                const getS3 = yield s3
                    .getObject({
                    Bucket: myBucket,
                    Key: myKey,
                })
                    .promise();
                if (getS3) {
                    // console.log('image:', image);
                    // console.log('Successfully uploaded data to myBucket/myKey');
                    if (image.images.length &&
                        typeof image.images !== 'undefined') {
                        delete image.images[0].fieldname;
                        delete image.images[0].destination;
                        delete image.images[0].filename;
                        delete image.images[0].path;
                        const original = image.images[0];
                        const url = `https://d4falz9iw5uvg.cloudfront.net/${user.eventId}/${myKey}?w=640&f=webp&q=90`;
                        const imageLog = new MongoImageLog_1.ImageLog();
                        imageLog.accountId = user._id;
                        imageLog.eventId = user.eventId;
                        imageLog.original = original;
                        imageLog.outUrl = url;
                        imageLog.size = getS3.ContentLength;
                        imageLog.mimetype = mimetype;
                        imageLog.bucket = myBucket;
                        imageLog.filename = myKey;
                        imageLog.createDt = new Date();
                        const serviceImageLog = new ServiceImageLog_1.default();
                        const queryImageLog = yield serviceImageLog.post(imageLog);
                        common_1.responseJson(res, [queryImageLog], method, 'success');
                    }
                    else {
                        // Fails Save Mongodb.
                        common_1.responseJson(res, [
                            '임시 이미지가 없어서 데이터베이스에 저장을 하지 못했습니다.',
                        ], method, 'fails');
                    }
                }
                else {
                    // Fails Get.
                    common_1.responseJson(res, ['업로드된 데이터 조회를 실패 했습니다.'], method, 'fails');
                }
            }
            else {
                // Deleted Temporary an upload file. Don't need to sync.
                if (image.images.length > 0 && typeof image.images) {
                    fs_1.default.unlink(image.images[0].path, err => {
                        console.log('Deleted result:', err);
                    });
                }
                common_1.responseJson(res, ['업로드를 실패 했습니다.'], method, 'fails');
            }
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
exports.default = {
    apiGet: apiDelete,
    apiPost,
};
//# sourceMappingURL=image.js.map