"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admins = exports.AdminsSchema = exports.AdminsContainer = void 0;
const Connect_1 = require("./Connect");
const mongoose_1 = require("mongoose");
const AdminsContainerSchema = new mongoose_1.Schema({
    packageName: { type: String },
    level: { type: String },
    joinDt: { type: Date },
    eventList: { type: Array },
});
exports.AdminsContainer = mongoose_1.model('adminsContainer', AdminsContainerSchema);
exports.AdminsSchema = new mongoose_1.Schema({
    id: { type: String },
    password: { type: String },
    name: { type: String },
    phone: { type: String },
    createDt: { type: Date },
    verified: { type: Boolean },
    level: { type: String },
    containerList: { type: [AdminsContainerSchema] },
});
exports.Admins = Connect_1.mongoManager.model('admins', exports.AdminsSchema);
//# sourceMappingURL=MongoAdmins.js.map