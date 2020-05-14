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
Object.defineProperty(exports, "__esModule", { value: true });
const MongoImageLog_1 = require("./../../entity/mongodb/main/MongoImageLog");
class ServiceImageLog {
    constructor() { }
    post(imageLog) {
        return __awaiter(this, void 0, void 0, function* () {
            const saveResult = yield imageLog.save();
            return saveResult;
        });
    }
    delete(imageLog) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield MongoImageLog_1.ImageLog.update({
                accountId: imageLog.accountId,
                eventId: imageLog.eventId,
            }, {
                $set: {
                    use: false,
                    deleteDt: new Date(),
                },
            });
            console.log(query);
            return true;
        });
    }
}
exports.default = ServiceImageLog;
//# sourceMappingURL=ServiceImageLog.js.map