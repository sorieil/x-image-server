"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageLog = exports.ImageLogSchema = void 0;
const ConnectLog_1 = require("./ConnectLog");
const mongoose_1 = require("mongoose");
exports.ImageLogSchema = new mongoose_1.Schema({
    accountId: { type: mongoose_1.Schema.Types.ObjectId, indexes: true },
    eventId: { type: mongoose_1.Schema.Types.ObjectId, indexes: true },
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
exports.ImageLog = ConnectLog_1.mongoManagerLog.model('imageLog', exports.ImageLogSchema);
//# sourceMappingURL=MongoImageLog.js.map