module.exports = {

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
        tokenlife: 172800
    },
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
