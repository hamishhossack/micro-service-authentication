module.exports = {

    version: 'v1.0.0',

    port: {
        http: 3009
    },
    redis: {
        host: 'redis.7uappc.0001.euw1.cache.amazonaws.com',
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
        key: 'AKIAIE4XEDH4JLQYBHBQ',
        secret: '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',
        region: 'eu-west-1',
        tableName: 'prod-auth'
    },
    safe: [
        '127.0.0.1',
        '::1/128'
    ],
    socials: {
        'facebook': {
            'callback': {
                'scheme': 'http',
                'prefix': 'www',
                'port': ''
            }
        }
    },
    mongodb: 'mongodb://mongo.pada.io:27017/auth',
    apis: {
        search: 'http://search.pada.private:3000/api',
        auth: 'http://authentication.pada.io/api'
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
