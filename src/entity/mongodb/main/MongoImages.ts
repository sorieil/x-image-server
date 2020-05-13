import { EventI } from './MongoEvent';
import { AccountsI, Accounts } from './MongoAccounts';
import './Connect';
import mongoose, { Schema, Document, model } from 'mongoose';
export interface ParticipantsAccountsI extends Document {
    accountId: AccountsI;

    createDt: Date;
}
export interface ParticipantsFavoriteI extends Document {
    accountId: AccountsI;
    eventId: EventI;
    originPath: string;
    convertSize: symbol;
    createDt: Date;
}

export const ImagesSchema: Schema = new Schema({
    accountId: { type: Schema.Types.ObjectId },
    eventId: { type: Schema.Types.ObjectId },
    createDt: { type: Date },
});

export const ParticipantsFavorite = mongoose.model<ParticipantsFavoriteI>(
    'participantsFavorite',
    ImagesSchema,
);
