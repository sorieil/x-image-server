"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionsMongodb = exports.connections = exports.connectionMysql = void 0;
const typeorm_1 = require("typeorm");
const mongoose_1 = __importDefault(require("mongoose"));
exports.connectionMysql = 'mysqlDB';
exports.connections = (env) => {
    const mysqlOptions = {
        name: 'mysqlDB',
        type: 'mysql',
        host: env.MYSQL_HOST,
        port: Number(env.MYSQL_PORT),
        username: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE,
        entities: ['./src/entity/mysql/entities/*{.js,.ts}'],
        synchronize: true,
        debug: false,
        insecureAuth: true,
        // logging: ['error'],
        // logger: 'file',
        extra: {
            connectionLimit: 4,
        },
    };
    console.log(`Mysql connection '${env.MYSQL_DATABASE}'`);
    return typeorm_1.createConnections([mysqlOptions]);
};
const connectionsMongodb = (schema) => {
    const schemaName = schema ? schema : process.env.MONGO_DATABASE;
    const connectionUrl = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${schemaName}?retryWrites=true&w=majority`;
    // const connectionUrl = mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`;
    const conn = mongoose_1.default.createConnection(connectionUrl, {
        socketTimeoutMS: 0,
        keepAlive: true,
        useNewUrlParser: true,
        dbName: schemaName,
        useCreateIndex: false,
        useUnifiedTopology: true,
    });
    console.log(`Mongodb connection '${schemaName}'`);
    return conn;
};
exports.connectionsMongodb = connectionsMongodb;
//# sourceMappingURL=db.js.map