module.exports = {

    version: 'v0.0.2',

    port: {
        http: 3009
    },
    redis: {
        host: '192.168.99.100',
        port: 6379,
        ttl_cache: 2 * 60
    },
    ttlRedisCache: 2 * 60,
    security: {
        clientId: 'qO6sfKYt',
        userId: 'auth-api',
        token: 'af10823eb025af78085650e8ef200419',
        tokenlife: 172800
    },
    dynamodb: {
        key: 'AKIAJ3EIFX53L6FEQMDQ',
        secret: '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',
        region: 'us-west-1',
        tableName: 'preprod-auth'
    },
    safe: [
        '127.0.0.1',
        '::1/128'
    ],
    socials: {
        'facebook': {
            'callback': {
                'scheme': 'http',
                'prefix': 'dev',
                'port': ':81'
            }
        }
    },
    mongodb: 'mongodb://192.168.99.100:27017/auth',
    apis: {
        search: 'http://192.168.99.100:3000/api',
        auth: 'http://192.168.99.100:3002/api'
    },
    strategies: ['basic', 'client', 'bearer', 'facebook_jeveux1truc.be'],
    locales: [
        'en_CA',
        'en_GB',
        'en_HK',
        'en_IN',
        'en_MY',
        'en_SG',
        'en_TH',
        'en_US',
        'es_AR',
        'es_CO',
        'es_ES',
        'es_MX',
        'es_PE',
        'es_US',
        'es_CL',
        'es_CR',
        'es_BO',
        'es_EC',
        'es_GT',
        'es_NI',
        'es_PY',
        'es_VE',
        'fr_BE',
        'fr_CA',
        'fr_CH',
        'fr_FR',
        'fr_MR',
        'fr_MA',
        'it_CH',
        'it_IT',
        'nl_BE',
        'pt_BR',
        'pt_PT',
        'all'
    ]

};
