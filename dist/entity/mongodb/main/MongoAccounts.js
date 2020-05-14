"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accounts = exports.AccountsSchema = exports.AccountsEvent = void 0;
const Connect_1 = require("./Connect");
const mongoose_1 = require("mongoose");
const accountsEventSchema = new mongoose_1.Schema({
    eventId: { type: mongoose_1.Schema.Types.ObjectId },
    name: { type: String },
    joinDt: { type: Date },
    accessDt: { type: Date },
    pushToken: { type: String },
    mobileType: { type: String },
    isPushOn: { type: Boolean },
    point: { type: Number },
});
exports.AccountsEvent = mongoose_1.model('eventList', accountsEventSchema);
exports.AccountsSchema = new mongoose_1.Schema({
    block: { type: Array, required: true },
    group: { type: Array },
    phone: { type: String, required: true },
    password: { type: String },
    name: { type: String },
    eventList: { type: [accountsEventSchema] },
    profiles: { type: Array },
    myQRCode: { type: String },
    isDupPhoneNum: {
        type: Boolean,
        required: true,
    },
    isInactive: {
        type: Boolean,
        required: true,
    },
    permission: { type: Array },
});
exports.Accounts = Connect_1.mongoManager.model('accounts', exports.AccountsSchema);
//# sourceMappingURL=MongoAccounts.js.map