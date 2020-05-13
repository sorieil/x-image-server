import { createConnections, ConnectionOptions } from 'typeorm';
import mongoose, {
    connection,
    connect,
    Schema,
    model,
    Document,
} from 'mongoose';
interface Idb {
    MYSQL_DATABASE: string;
    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    MYSQL_HOST: string;
    MYSQL_PORT: number;
    MONGO_INITDB_ROOT_USERNAME: string;
    MONGO_INITDB_ROOT_PASSWORD: string;
    MONGO_HOST: string;
    MONGO_INITDB_DATABASE: string;
    MONGO_PORT: number;
}
export type ConnectionType = 'mysqlDB';
export type MongodbSchema = 'sk-knight' | 'xsync-main' | 'xsync-log';
export const connectionMysql: ConnectionType = 'mysqlDB';

export const connections = (env: any) => {
    const mysqlOptions: ConnectionOptions = {
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
    return createConnections([mysqlOptions]);
};

const connectionsMongodb = (schema: MongodbSchema) => {
    const schemaName = schema ? schema : process.env.MONGO_DATABASE;
    const connectionUrl = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${schemaName}?retryWrites=true&w=majority`;
    // const connectionUrl = mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`;
    const conn = mongoose.createConnection(connectionUrl, {
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

export { connectionsMongodb };
