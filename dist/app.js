"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require("reflect-metadata");
Promise.resolve().then(() => __importStar(require('./util/secrets')));
const routerEnum_1 = require("./util/routerEnum");
const common_1 = require("./util/common");
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const passport_2 = require("./util/passport");
const helmet = require("helmet");
const cors = require("cors");
// import { connections } from './util/db';
const chalk_1 = __importDefault(require("chalk"));
const image_1 = __importDefault(require("./controllers/image"));
// Mysql connection code.
// connections(process.env)
//     .then(async (connect: any) => {
// Create Express server
const app = express_1.default();
// Express configuration
app.set('port', process.env.PORT);
// Cross browsing free open.
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
}));
// Traffic compress.
app.use(compression_1.default());
// Auto convert body parse
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({
    limit: '50mb',
    extended: true,
}));
// Default secure guard
app.use(helmet());
app.use(passport_1.default.initialize());
/**
 * Primary app routes.
 */
// Admin Route
const authCheck = passport_2.auth('xsync-user').isAuthenticate;
const authAdminCheck = passport_2.auth('xsync-admin').isAuthenticate;
// app.get(RouterRole['/api/v1/sample'], ...admin.apiGet);
app.get(routerEnum_1.RouterV1['root'], (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    common_1.responseJson(res, [{ message: `start` }], 'GET', 'success');
}));
app.get(routerEnum_1.RouterV1['image'], authCheck, ...image_1.default.apiGet);
app.post(routerEnum_1.RouterV1['image'], authCheck, ...image_1.default.apiPost);
app.post(routerEnum_1.RouterV1['imageAdmin'], authAdminCheck, ...image_1.default.apiPost);
/**s
 * Error Handler. Provides full stack - remove for production
 */
if (process.env.NODE_ENV !== 'production') {
    app.use(errorhandler_1.default());
}
/**
 * Start Express server.
 */
app.use((err, req, res, next) => {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    const method = req.method.toString();
    common_1.responseJson(res, [res.sentry], method, 'invalid');
});
process.on('SIGINT', () => {
    console.log('Received SIGINT. Press Control-D to exit.');
});
app.listen(app.get('port'), () => {
    console.clear();
    console.log(`  App is running at http://${process.env.HOST}:${app.get('port')} in ${process.env.NODE_ENV} mode',`);
    console.log(chalk_1.default.red('Press CTRL-C to stop\n'));
});
// })
// .catch((error: any) => {
//     console.log('Typeorm database connection error...?d', error);
//     process.exit(1);
//     // logger.error(chalk.red('DB connection error', error));
// });
//# sourceMappingURL=app.js.map