import { mongoManagerLog } from './ConnectLog';
import { Schema, Document } from 'mongoose';

export type EventType = 'type';

export interface ImageLogI extends Document {
    accountId: Schema.Types.ObjectId;
    eventId: Schema.Types.ObjectId;
    original: object;
    originalWidth: number;
    originalHeight: number;
    outUrl: string;
    size: number;
    mimetype: string;
    bucket: string;
    filename: string;
    createDt: Date;
    user: boolean;
    deleteDt: Date;
}

export const ImageLogSchema: Schema = new Schema({
    accountId: { type: Schema.Types.ObjectId, indexes: true },
    eventId: { type: Schema.Types.ObjectId, indexes: true },
    original: { type: Object },
    originalWidth: { type: Number, default: 0 },
    originalHeight: { type: Number, default: 0 },
    outUrl: { type: String },
    size: { type: Number, default: 0 },
    mimetype: { type: String },
    butket: { type: String },
    filename: { type: String },
    createDt: { type: Date },
    use: { type: Boolean, default: true },
    deleteDt: { type: Date },
});

// console.log('mongoManagerLog:', mongoManagerLog);

export const ImageLog = mongoManagerLog.model<ImageLogI>(
    'imageLog',
    ImageLogSchema,
);
