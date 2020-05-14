import { Event } from './../entity/mongodb/main/MongoEvent';
import { ImageLog } from './../entity/mongodb/main/MongoImageLog';
import { Accounts } from './../entity/mongodb/main/MongoAccounts';
import { Request, Response } from 'express';
import { responseJson, RequestRole, tryCatch } from '../util/common';
import { validationResult, param } from 'express-validator';
import fs from 'fs';
import sharp from 'sharp';
import multer from 'multer';
import aws from 'aws-sdk';
import ServiceImageLog from '../service/mongodb/ServiceImageLog';
const s3 = new aws.S3({
    accessKeyId: 'AKIARKY6OJBAFI2O42CL',
    secretAccessKey: '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',
});
const fileFilter = (req: Request, file: { mimetype: string }, cb: any) => {
    try {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            // console.log(req.res);
            responseJson(
                req.res,
                ['이미지 파일을 선택해주세요.'],
                'POST',
                'invalid',
            );
            // cb('이미지 파일을 선택해 주세요.', true);
        }

        console.log('req:', req);
    } catch (err) {
        return false;
    }
};
const upload = multer({
    fileFilter: fileFilter,
    dest: './uploads',
});
const cpUpload = upload.fields([{ name: 'images', maxCount: 1 }]);
const apiDelete = [
    [param('targetId').notEmpty()],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const account = new Accounts();
            const event = new Event();
            account._id = user._id;
            event._id = user.eventId;

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            responseJson(res, [false], method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

const apiPost = [
    cpUpload,
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const account = new Accounts();
            const event = new Event();
            account._id = user._id;
            event._id = user.eventId;

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            const image = req.files as any;
            const file = fs.readFileSync(image.images[0].path);
            const filename = await sharp(file)
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
            const uploadS3 = await s3.putObject(params).promise();
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
                    fs.unlink(image.images[0].path, err => {
                        console.log('Deleted result:', err);
                    });
                }
                const getS3 = await s3
                    .getObject({
                        Bucket: myBucket,
                        Key: myKey,
                    })
                    .promise();

                if (getS3) {
                    // console.log('image:', image);
                    // console.log('Successfully uploaded data to myBucket/myKey');
                    if (
                        image.images.length &&
                        typeof image.images !== 'undefined'
                    ) {
                        delete image.images[0].fieldname;
                        delete image.images[0].destination;
                        delete image.images[0].filename;
                        delete image.images[0].path;
                        const original = image.images[0];

                        const url = `https://d4falz9iw5uvg.cloudfront.net/${user.eventId}/${myKey}?w=640&f=webp&q=90`;

                        const imageLog = new ImageLog();
                        imageLog.accountId = user._id;
                        imageLog.eventId = user.eventId;
                        imageLog.original = original;
                        imageLog.outUrl = url;
                        imageLog.size = getS3.ContentLength;
                        imageLog.mimetype = mimetype;
                        imageLog.bucket = myBucket;
                        imageLog.filename = myKey;
                        imageLog.createDt = new Date();

                        const serviceImageLog = new ServiceImageLog();
                        const queryImageLog = await serviceImageLog.post(
                            imageLog,
                        );

                        responseJson(res, [queryImageLog], method, 'success');
                    } else {
                        // Fails Save Mongodb.
                        responseJson(
                            res,
                            [
                                '임시 이미지가 없어서 데이터베이스에 저장을 하지 못했습니다.',
                            ],
                            method,
                            'fails',
                        );
                    }
                } else {
                    // Fails Get.
                    responseJson(
                        res,
                        ['업로드된 데이터 조회를 실패 했습니다.'],
                        method,
                        'fails',
                    );
                }
            } else {
                // Deleted Temporary an upload file. Don't need to sync.
                if (image.images.length > 0 && typeof image.images) {
                    fs.unlink(image.images[0].path, err => {
                        console.log('Deleted result:', err);
                    });
                }

                responseJson(res, ['업로드를 실패 했습니다.'], method, 'fails');
            }
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

export default {
    apiGet: apiDelete,
    apiPost,
};
