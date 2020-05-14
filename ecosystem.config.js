module.exports = {
    apps: [
        {
            name: 'Conference API',
            autorestart: true,
            script: './dist/app.js',
            env: {
                instances: 1,
                watch: true,
                watch_delay: 1000,
                NODE_ENV: 'development',
                HOST: '0.0.0.0',
                PORT: 4002,
                MONGO_USERNAME: 'xsync-dev',
                MONGO_PASSWORD: 'GDxdAeiE6Xpe889u',
                MONGO_DATABASE: 'xsync-main',
                MONGO_NON_ROOT_ROLE: 'root',
                MONGO_HOST: 'xsync-mongodb-v1-n1tic.mongodb.net',
                SESSION_SECRET: 'alskdjfiiifja#dkf912359*$',
                MYSQL_ROOT_PASSWORD: 'mKatMYWCqTZfYNvHtgmw',
                MYSQL_DATABASE: 'main',
                MYSQL_USER: 'xsync_user_dev',
                MYSQL_PASSWORD: 'mKatMYWCqTZfYNvHtgmw',
                MYSQL_HOST:
                    'dev-xsync-all-db.cluster-cfucr7qnmfpn.ap-northeast-2.rds.amazonaws.com',
                MYSQL_PORT: 3306,
            },
            env_production: {
                exec_mode: 'cluster',
                instances: 0,
                max_memory_restart: '7G',
                watch: false,
                NODE_ENV: 'production',
                HOST: '0.0.0.0',
                PORT: 4002,
                MONGO_USERNAME: 'xsync-dev',
                MONGO_PASSWORD: 'GDxdAeiE6Xpe889u',
                MONGO_DATABASE: 'xsync-main',
                MONGO_NON_ROOT_ROLE: 'root',
                MONGO_HOST: 'xsync-mongodb-v1-n1tic.mongodb.net',
                SESSION_SECRET: 'alskdjfiiifja#dkf912359*$',
                MYSQL_ROOT_PASSWORD: 'mKatMYWCqTZfYNvHtgmw',
                MYSQL_DATABASE: 'main',
                MYSQL_USER: 'xsync_user_dev',
                MYSQL_PASSWORD: 'mKatMYWCqTZfYNvHtgmw',
                MYSQL_HOST:
                    'dev-xsync-all-db.cluster-cfucr7qnmfpn.ap-northeast-2.rds.amazonaws.com',
                MYSQL_PORT: 3306,
            },
        },
    ],
};
