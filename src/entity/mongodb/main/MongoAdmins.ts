import { mongoManager } from './Connect';
import { Schema, model, Document } from 'mongoose';

export interface AdminsContainerI extends Document {
    packageName: string;
    level: string;
    joinDt: Date;
    eventList: any[];
}

const AdminsContainerSchema: Schema = new Schema({
    packageName: { type: String },
    level: { type: String },
    joinDt: { type: Date },
    eventList: { type: Array },
});

export const AdminsContainer = model<AdminsContainerI>(
    'adminsContainer',
    AdminsContainerSchema,
);

/**
 *  "_id": {
        "$oid": "5ebb54269e5b0374b4f12341"
    },
    "id": "jhkim@xsync.co",
    "password": "A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=",
    "name": "김재혁",
    "phone": "01027909418",
    "createDt": {
        "$date": "2020-05-13T01:57:58.000Z"
    },
    "verified": true,
    "level": "basic",
    "containerList": [
        {
            "packageName": "com.xsync.container.no7m95vsr6j35zhv",
            "level": "owner",
            "joinDt": {
            "$date": "2020-04-01T01:13:45.000Z"
        },
        "eventList": []
        }
    ], 
 */

export interface AdminsI extends Document {
    id: string;
    password: string;
    name: string;
    phone: string;

    createDt: Date;

    verified: boolean;

    level: string;

    containerList: [AdminsContainerI];
}

export const AdminsSchema: Schema = new Schema({
    id: { type: String },
    password: { type: String },
    name: { type: String },
    phone: { type: String },

    createDt: { type: Date },

    verified: { type: Boolean },

    level: { type: String },

    containerList: { type: [AdminsContainerSchema] },
});
export const Admins = mongoManager.model<AdminsI>('admins', AdminsSchema);
